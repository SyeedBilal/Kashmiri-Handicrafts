const Admin = require("../../models/adminModel");
const bcrypt = require("bcrypt");
const {generateToken} = require("../../config/jwtUtlis");


exports.adminSignup = async (req, res) => {


const {name,email,password,confirmPassword}=req.body;
console.log("Signup data",req.body);

const isAlreadyExist=await Admin.findOne({email});
if(isAlreadyExist){
  return res.status(400).json({error:"Admin already exists",success:false});

}

const hashPassword=await bcrypt.hash(password,12);
const admin=new Admin({
  name,
  email,
  password:hashPassword
})

try{
  await admin.save();
  res.status(200).json({message:"Admin Registered Successfully",success:true});
}
catch(err){
  console.log("error in adminSignup",err);
  res.status(500).json({error:"Internal Server Error"});
}
}


exports.adminLogin = async (req, res) => {

console.log("Login data",req.body);


const {email,password}=req.body;

try{
  const admin=await Admin.findOne({email});
  if(!admin){
    return res.status(400).json({error:"Invalid Credentials",success:false});
  }

  const isMatch=await bcrypt.compare(password,admin.password);
  if(!isMatch){
    return res.status(400).json({error:"Invalid Credentials",success:false});
  }
  

// else generate token

const token=generateToken({id:admin._id,email:admin.email,role:'admin'});

// save token in httpOnly cookie
res.cookie("token",token,{
  httpOnly:true,
  secure:process.env.NODE_ENV === 'production', // Set to be true in deployment , true works only in https 
  samesite:'strict',   // set strict to prevent CSRF attacks
  maxAge:3*60*60*1000 // 3 hours
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