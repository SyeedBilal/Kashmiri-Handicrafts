const mongoose=require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
  address: [addressSchema],
}, { timestamps: true });

module.exports=mongoose.model('User', userSchema);