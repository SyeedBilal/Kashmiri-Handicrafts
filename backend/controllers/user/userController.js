const User=require('../../models/userModel');
const { check, validationResult } = require("express-validator");
const bcrypt=require('bcrypt');



exports.registerUser=async(req,res)=>{
console.log("Registed User",req.body);
const {username,email,password}=req.body;

const hashPassword=await bcrypt.hash(password,12);
try{



const user=new User({
  username,
  email,
  password:hashPassword
})

const alreadyExist=await User.findOne({email});
if(alreadyExist){
  return res.status(400).json({error:"User already exists",sucess:false});

}

await user.save();
req.session.isAuth=true;
req.session.user=user;


res.status(200).json({message:"User Registered Successfully",sucess:true});
}
catch(err){
  console.log("error in registerUser",err);
  res.status(500).json({error:"Internal Server Error"});

}
}

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