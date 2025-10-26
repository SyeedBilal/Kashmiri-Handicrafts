const Order = require('../models/bookings');
const Products = require('../models/productModel');
const CartItems = require('../models/cartModel');
const User = require('../models/userModel');
const crypto = require('crypto');
const razorpayPromise = require('../config/paymentConfig');

exports.createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;
    
    // Validate required fields
    if (!userId || !shippingAddress) {
      return res.status(400).json({ 
        message: 'User ID and shipping address are required' 
      });
    }

    // Wait for Razorpay to be initialized before proceeding
    const razorpay = await razorpayPromise;
    console.log('✅ Razorpay instance ready for order creation');

    // Fetch cart items for the user with nested populate
    const cartItems = await CartItems.find({ userId }).populate({
      path: 'productId',
      populate: {
        path: 'admin',
        model: 'Admin'
      }
    });

    console.log("📦 Cart items found:", cartItems.length);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let totalMRP = 0;
    let totalDiscount = 0;
    const CONVENIENCE_FEE = 99;

    // Prepare order items and calculate totals
    const orderItems = cartItems.map(item => {
      const product = item.productId;
      
      if (!product) {
        throw new Error(`Product not found for cart item: ${item._id}`);
      }

      // Calculate product total
      const itemMRP = product.originalPrice * item.quantity;
      const itemDiscount = (product.originalPrice - product.price) * item.quantity;
      
      totalMRP += itemMRP;
      totalDiscount += itemDiscount;
      
      return {
        productId: product._id,
        adminId: product.admin ? product.admin._id : null, // Handle case where admin might not exist
        quantity: item.quantity,
        price: product.price,
        originalPrice: product.originalPrice,
        name: product.name,
        image: product.image
      };
    });

    const finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEE;

    // Validate final amount
    if (finalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid order amount' });
    }

    console.log(`💰 Order totals - MRP: ${totalMRP}, Discount: ${totalDiscount}, Final: ${finalAmount}`);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise and ensure integer
      currency: 'INR',
      receipt: `order_${Date.now()}_${userId}`,
      notes: {
        userId: userId.toString(),
        itemsCount: orderItems.length.toString()
      }
    });

    console.log(`📱 Razorpay order created: ${razorpayOrder.id}`);

    // Create order in the database (with pending status)
    const order = new Order({
      userId,
      items: orderItems,
      totalMRP,
      totalDiscount,
      totalAmount: finalAmount,
      shippingAddress,
      convenienceFee: CONVENIENCE_FEE,
      paymentDetails: {
        orderId: razorpayOrder.id,
        status: 'pending',
        amount: finalAmount
      }
    });

    await order.save();
    console.log(`💾 Order saved to database: ${order._id}`);

    // Return order details for frontend
    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        items: orderItems.map(item => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price
        })),
        totalMRP,
        totalDiscount,
        totalAmount: finalAmount,
        convenienceFee: CONVENIENCE_FEE,
        shippingAddress
      },
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      },
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    
    // Handle specific error cases
    if (error.message.includes('key_id') || error.message.includes('RAZORPAY')) {
      return res.status(500).json({ 
        message: 'Payment service configuration error', 
        error: 'Payment gateway not properly configured' 
      });
    }
    
    if (error.message.includes('Product not found')) {
      return res.status(400).json({ 
        message: 'Invalid cart items', 
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    
    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ 
        message: 'Missing payment verification details' 
      });
    }

    console.log(`🔍 Verifying payment for order: ${razorpayOrderId}`);

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    if (generatedSignature !== razorpaySignature) {
      console.error('❌ Invalid payment signature');
      return res.status(400).json({ 
        message: 'Invalid payment signature',
        details: 'Payment verification failed' 
      });
    }

    console.log('✅ Payment signature verified');

    // Find and update order
    const order = await Order.findOne({ 
      'paymentDetails.orderId': razorpayOrderId 
    });

    if (!order) {
      console.error(`❌ Order not found for Razorpay ID: ${razorpayOrderId}`);
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    // Check if payment was already processed
    if (order.paymentDetails.status === 'completed') {
      console.log('⚠️ Payment already processed for order:', order._id);
      return res.json({ 
        success: true, 
        message: 'Payment was already verified', 
        orderId: order._id 
      });
    }

    // Update order payment details
    order.paymentDetails.paymentId = razorpayPaymentId;
    order.paymentDetails.signature = razorpaySignature;
    order.paymentDetails.status = 'completed';
    order.paymentDetails.paidAt = new Date();
    order.status = 'processing';
    
    await order.save();
    console.log(`✅ Order ${order._id} payment marked as completed`);

    // Update product quantities (subtract purchased quantities)
    const bulkOperations = order.items.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity } }
      }
    }));

    if (bulkOperations.length > 0) {
      await Products.bulkWrite(bulkOperations);
      console.log(`📦 Updated quantities for ${bulkOperations.length} products`);
    }

    // Clear user's cart
    const deleteResult = await CartItems.deleteMany({ userId: order.userId });
    console.log(`🛒 Cleared ${deleteResult.deletedCount} items from user's cart`);

    res.json({ 
      success: true, 
      message: 'Payment verified and order placed successfully', 
      orderId: order._id,
      orderStatus: order.status
    });
    
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    
    if (error.message.includes('RAZORPAY_KEY_SECRET')) {
      return res.status(500).json({ 
        message: 'Payment service configuration error',
        error: 'Payment gateway not properly configured'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to verify payment', 
      error: error.message 
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID is required' 
      });
    }

    console.log(`📋 Fetching orders for user: ${userId}`);

    const orders = await Order.find({ userId })
      .select('items.name items.image items.quantity totalAmount shippingAddress paymentDetails.status createdAt')
      .sort({ createdAt: -1 });

    const cleanOrders = orders.map(order => ({
      id: order._id,
      items: order.items.map(item => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.paymentDetails.status,
      orderedAt: order.createdAt,
    }));

    console.log(`✅ Found ${cleanOrders.length} orders for user ${userId}`);

    res.json({
      success: true,
      orders: cleanOrders,
      count: cleanOrders.length
    });

  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
};

// Additional utility method to check payment status
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .select('paymentDetails.status status totalAmount items.name');

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      orderId: order._id,
      paymentStatus: order.paymentDetails.status,
      orderStatus: order.status,
      totalAmount: order.totalAmount,
      items: order.items.map(item => item.name)
    });

  } catch (error) {
    console.error('❌ Error fetching order status:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order status', 
      error: error.message 
    });
  }
};