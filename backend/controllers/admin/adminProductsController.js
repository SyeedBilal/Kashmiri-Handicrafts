const Product = require('../../models/productModel');
const mongoose = require('mongoose');
const Order = require('../../models/bookings');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, quantity, category, discountPercentage } = req.body;
    const currentAdmin = req.params.adminId;

    console.log("Admin ID:", currentAdmin);
  

    // Validate adminId format
    if (!mongoose.Types.ObjectId.isValid(currentAdmin)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid admin ID format'
      });
    }

    const image = req.file.path;

    // Validate required fields
    if (!name || !description || !price || !originalPrice || !quantity || !category || !discountPercentage) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Create new product
    const newProduct = new Product({
      name,  
      admin: currentAdmin,  // MongoDB will handle the conversion
      description,
      price,
      originalPrice,
      quantity,
      discountPercentage,
      category,
      image,
      imagePublicId: req.file.filename, // getting this from multer along with the image(req.file.path) 
    });

    await newProduct.save();
    res.status(201).json({ 
      success: true,
      message: 'Product added successfully', 
      product: newProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

exports.getAdminProducts = async (req, res) => {

  const currentAdmin = req.params.adminId;
  // console.log("Admin id at getAdminProducts:", currentAdmin);
  try {
    const products = await Product.find({ admin: currentAdmin});
    res.status(200).json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

exports.deleteProduct = async (req, res) => {


  const productId = req.params.productId;

  console.log("Product id at deleteProduct:", productId);

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    //  using Cloudinary for image storage, delete the image from Cloudinary
    
    if (deletedProduct.imagePublicId) {
      await cloudinary.uploader.destroy(deletedProduct.imagePublicId);
    }

    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

exports.updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const {
    name,
    description,
    price,
    originalPrice,
    quantity,
    category,
    discountPercentage,
  } = req.body;

  console.log("Request body at updateProduct:", req.body);
  console.log("Product id at updateProduct:", productId);

  // const image = req.file ? `/uploads/${req.file.filename}` : null;

  const image = req.file.path;   // Used Cloudniary for image upload

  // Build the update object dynamically
  const updateFields = {
    name,
    description,
    price,
    originalPrice,
    quantity,
    category,
    discountPercentage,
  };

  // Only add image if a new file was uploaded
  if (image) {
    updateFields.image = image;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


// Can you aggreate query which is very powerful and can be used to get the data in a single query

exports.getAdminProductsAnaytics = async (req, res) => {

  const adminId = req.params.adminId;
  // console.log("Admin id at getAdminProducts:", currentAdmin);
try{



  const allOrders = await Order.find({ 'items.adminId': adminId });

let totalRevenue = 0;
let totalProductsSold = 0;
const orderIds = new Set();
const customerIds = new Set();
const detailedOrders = [];

for (const order of allOrders) {
  const { shippingAddress, paymentDetails, status, createdAt, userId } = order;

  orderIds.add(order._id.toString());
  customerIds.add(userId.toString());

  for (const item of order.items) {
    if (item.adminId.toString() === adminId.toString()) {
      totalRevenue += item.price * item.quantity;
      totalProductsSold += item.quantity;

      detailedOrders.push({
        orderId: order._id,
        customerId: userId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        shippingAddress,
        paymentDetails,
        orderStatus: status,
        createdAt
      });
    }
  }
}

const totalOrdersCount = orderIds.size;
const totalCustomersCount = customerIds.size;

const stats = {
  totalRevenue,
  totalOrdersCount,
  totalCustomersCount,
  totalProductsSold,
  recentOrders:detailedOrders
};



res.status(200).json({
  success: true,
  message: 'Admin analytics fetched successfully',
  stats
})
}
catch(e){
  console.log(e);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: e.message 
  });

}

}



exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  console.log("Order id at updateOrderStatus:", orderId);

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'delivered' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Order status updated successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}