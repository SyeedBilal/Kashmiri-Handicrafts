const Order = require('../models/bookings');
const Products = require('../models/productModel');
const CartItems = require('../models/cartModel');
const User = require('../models/userModel');
const crypto = require('crypto');
const razorpay = require('../config/paymentConfig');
require('dotenv').config();

exports.createOrder=async(req,res)=>{


try {
  const { userId, shippingAddress } = req.body;
  
  // Fetch cart items for the user  (Important code here nested populate )

  //First level: populate productId → becomes a full Product document.

// Second level: within that Product, populate admin.
  const cartItems = await CartItems.find({ userId }).populate({
    path: 'productId',
    populate: {
      path: 'admin',
      model: 'Admin'
    }
  });

  // console.log("cartItems",cartItems);

  // console.log('Admins', cartItems.map(item => item.productId.admin));
  
  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  
  // Calculate totals
  let totalMRP = 0;
  let totalDiscount = 0;
  const CONVENIENCE_FEE = 99;
  
  // Prepare order items
  const orderItems = cartItems.map(item => {
    const product = item.productId;
    
    // Calculate product total
    totalMRP += product.originalPrice * item.quantity;
    totalDiscount += (product.originalPrice - product.price) * item.quantity;
    
    return {
      productId: product._id,
      adminId: product.admin._id, // Store admin ID for each product
      quantity: item.quantity,
      price: product.price,
      name: product.name,
      image: product.image
    };
  });
  
  const finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEE;
  
  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount * 100, // Convert to paise
    currency: 'INR',
    receipt: `order_${Date.now()}`
  });
  
  // Create order in the database (with pending status)
  const order = new Order({
    userId,
    items: orderItems,
    totalAmount: finalAmount,
    shippingAddress,
    convenienceFee: CONVENIENCE_FEE,
    paymentDetails: {
      orderId: razorpayOrder.id,
      status: 'pending'
    }
  });
  
  await order.save();
  
  // Return order details for frontend
  res.json({
    order: {
      id: order._id,
      items: orderItems,
      totalAmount: finalAmount,
      convenienceFee: CONVENIENCE_FEE
    },
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    },
    key: process.env.RAZORPAY_KEY_ID
  });
  
} catch (error) {
  console.error('Error creating order:', error);
  res.status(500).json({ message: 'Failed to create order', error: error.message });
}

}


exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Find and update order
    const order = await Order.findOne({ 'paymentDetails.orderId': razorpayOrderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order payment details
    order.paymentDetails.paymentId = razorpayPaymentId;
    order.paymentDetails.signature = razorpaySignature;
    order.paymentDetails.status = 'completed';
    order.status = 'processing';
    
    await order.save();
    
    // Update product quantities subtrating the quantity of each product in Products collection after order placement
    for (const item of order.items) {
      await Products.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }
      );
    }
    
    // Clear user's cart
    await CartItems.deleteMany({ userId: order.userId });
    
    res.json({ 
      success: true, 
      message: 'Payment verified and order placed successfully', 
      orderId: order._id 
    });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
    .select('items.name items.image totalAmount shippingAddress paymentDetails.status createdAt')
    .sort({ createdAt: -1 });
  
    const cleanOrders = orders.map(order => ({
      id: order._id,
      items: order.items.map(item => ({
        name: item.name,
        image: item.image,
      })),
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.paymentDetails.status,
      orderedAt: order.createdAt,
    }));
    
    res.json(cleanOrders);
    
    

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};