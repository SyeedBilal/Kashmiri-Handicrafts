const Admin = require("../../models/adminModel");
const bcrypt = require("bcrypt");
const {sendOtpEmail} = require("../../config/jwtUtlis");


exports.adminSignup = async (req, res) => {

  const generateOtp=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
  
  }

const {name,email,password,confirmPassword}=req.body;
console.log("Signup data",req.body);

const isAlreadyExist=await Admin.findOne({email});
if(isAlreadyExist){
  return res.status(400).json({error:"Admin already exists",success:false});

}
const otp=generateOtp();

  const otpExpiry=new Date(Date.now() + 10*60*1000);

const hashPassword=await bcrypt.hash(password,12);

const admin=new Admin({
  name,
  email,
  password:hashPassword,
  otp,
  otpExpiry,
  isverified:false
})

try{
  await admin.save();
  res.status(200).json({message:"Admin Registered Successfully",success:true});

   const emailResult=await sendOtpEmail(email,otp);

   if(!emailResult.success){
    return res.status(500).json({error:"Error sending email",success:false});
  }
  
  res.status(200).json({
    message: "OTP sent to your email. Please verify to complete registration.",
    success: true,
    adminId: admin._id,
    email:admin.email,
  });
}
catch(err){
  console.log("error in adminSignup",err);
  res.status(500).json({error:"Internal Server Error"});
}
}




exports.verifyOtp=async(req,res)=>{

  console.log("Verify OTP",req.body);
  const {otp,email}=req.body;

  try{
    const admin=await Admin.findOne({email});

    if(!admin){
      return res.status(400).json({error:"Admin not found",success:false});

    }

    if(admin.otp !==otp){
      return res.status(400).json({error:"Invalid OTP",success:false});
    }

    if(admin.otpExpiry < Date.now()){
      return res.status(400).json({error:"OTP expired",success:false});
    }

 admin.isverified=true;
 admin.otp=null;
 admin.otpExpiry=null;
await admin.save();


res.status(200).json({
  message: "Email verified successfully. Registration complete.",
  success: true,
  user: {
    id: admin._id,
    name: admin.name,
    email: admin.email
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

  try {
    // Find the user with the given email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found", success: false });
    }


    if (admin.isverified) {
      return res.status(400).json({ error: "Admin is already verified", success: false });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Update Admin with new OTP
    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

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


exports.adminLogin = async (req, res) => {

console.log("Login data",req.body);


const {email,password}=req.body;

try{
  const admin=await Admin.findOne({email});
  if(!admin){
    return res.status(400).json({error:"Invalid Credentials",success:false});
  }
  if (!admin.isverified) {
    return res.status(400).json({ error: "Admin is not verified", success: false });
  }

  const isMatch=await bcrypt.compare(password,admin.password);
  if(!isMatch){
    return res.status(400).json({error:"Invalid Credentials",success:false});
  }
  

// else generate token

const token=generateToken({id:admin._id,email:admin.email,role:'admin'});

res.cookie("token", token, {
  httpOnly: true,
  secure: true,          
  sameSite: 'none',       
  maxAge: 3 * 60 * 60 * 1000
});


res.status(200).json({
  success:true,
  message:"Admin Logged in Successfully",
  admin:{
    id:admin._id,
    name:admin.name,
    email:admin.email
  }
})

}
catch(err){
  console.log("error in adminLogin",err);
  res.status(500).json({error:"Internal Server Error"});
}
}

exports.adminLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Admin logged out successfully", success: true });
  } catch (err) {
    console.log("error in adminLogout", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};