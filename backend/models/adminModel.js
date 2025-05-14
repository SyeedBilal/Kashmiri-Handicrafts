// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'   // Default role is 'admin'
  },
  isverified:{
    type:Boolean,
    default:false
  },
  otp:{
    type:String,
    default:null
  },
  otpExpiry:{
    type:Date,
    default:null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports=mongoose.model('Admin', adminSchema);
