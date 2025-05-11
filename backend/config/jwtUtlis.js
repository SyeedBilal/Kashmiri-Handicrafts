const jwt=require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET=process.env.JWT_SECRET;

exports.generateToken=(payload)=>{


  // generate token with payload and secret key
return jwt.sign(payload,JWT_SECRET,{
  expiresIn:'3h'
});

}

exports.verifyToken=(token)=>{
  return jwt.verify(token, JWT_SECRET);
}