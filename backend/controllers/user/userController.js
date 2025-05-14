const User=require('../../models/userModel');
const { check, validationResult } = require("express-validator");
const bcrypt=require('bcrypt');
const {sendOtpEmail}=require('../../utils/nodemailer');
const crypto=require('crypto');



exports.registerUser=async(req,res)=>{


console.log("Registed User",req.body);
const {name,email,password}=req.body;

const generateOtp=()=>{
  return Math.floor(100000 + Math.random() * 900000).toString();

}

try{
  
  const alreadyExist=await User.findOne({email});
  if(alreadyExist){
    return res.status(400).json({error:"User already exists",success:false});
    
  }
  
  const hashPassword=await bcrypt.hash(password,12);

  const otp=generateOtp();

  const otpExpiry=new Date(Date.now() + 10*60*1000);  // 10 minutes expiry

  
  const user=new User({
    name,
    email,
    password:hashPassword,
    otp,
    otpExpiry,
    isverified:false

  });

  await user.save();

  const emailResult=await sendOtpEmail(email,otp);


if(!emailResult.success){
  return res.status(500).json({error:"Error sending email",success:false});
}

res.status(200).json({
  message: "OTP sent to your email. Please verify to complete registration.",
  success: true,
  userId: user._id,
  email:user.email,
});
} catch (err) {
console.log("Error in registerUser", err);
res.status(500).json({ error: "Internal Server Error", success: false });
}
};

// Verify OTP
exports.verifyOtp=async(req,res)=>{

  console.log("Verify OTP",req.body);
  const {otp,email}=req.body;

  try{
    const user=await User.findOne({email});

    if(!user){
      return res.status(400).json({error:"User not found",success:false});

    }

    if(user.otp !==otp){
      return res.status(400).json({error:"Invalid OTP",success:false});
    }

    if(user.otpExpiry < Date.now()){
      return res.status(400).json({error:"OTP expired",success:false});
    }

 user.isverified=true;
 user.otp=null;
 user.otpExpiry=null;
await user.save();

req.session.isAuth=true;
req.session.user={
  id: user._id,
  name: user.name,
  email: user.email,
  role: 'user'
}

res.status(200).json({
  message: "Email verified successfully. Registration complete.",
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  }
    catch(err){
      console.log("Error in verifyOtp",err);
      return res.status(500).json({error:"Internal Server Error"});
    }
}

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  const generateOtp=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
  
  }
  try {
    // Find the user with the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }


    if (user.isverified) {
      return res.status(400).json({ error: "User is already verified", success: false });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const emailResult = await sendOtpEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({ error: "Failed to send OTP email", success: false });
    }

    res.status(200).json({
      message: "New OTP sent to your email",
      success: true
    });
  } catch (err) {
    console.log("Error in resendOTP", err);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};


exports.loginUser=async (req,res)=>{

// validation already done in the route

  console.log('Login User',req.body);

  const {email,password}=req.body;

  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors:errors.array(),success:false});
  }

  try{
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Invalid Credentials",success:false});
    }

    if (!user.isverified) {
      return res.status(400).json({ error: "User is not verified", success: false });
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({error:"Invalid Credentials",success:false});
    }


    const userData={
      username:user.username,
      userId:user._id,
      email:user.email
    }
    // ⚠️ Don't store full Mongoose object
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user'
    };
    req.session.isAuth = true;

    req.session.save((err)=>{
      if(err){
        console.log("error in saving session",err);
        return res.status(500).json({error:"Internal Server Error"});
      }
      res.status(200).json({message:"Login Successful",success:true,userData});
      console.log("Session saved successfully");
    })
    
    

 
  }
  catch(err){
    console.log("error in loginUser",err);
    res.status(500).json({error:"Internal Server Error"});
  }
}

exports.logoutUser = (req, res) => {

  console.log("At logout User ",req.session);
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to logout"
        });
      }
      
      // Clear the session cookie
      res.clearCookie("connect.sid", {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });

      console.log("Session destroyed successfully");

      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};