const mongoose=require('mongoose')

const productsSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',  // 👈 Important: Reference to Admin collection
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL path to the image
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports= mongoose.model('Products', productsSchema);