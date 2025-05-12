const verifyToken=require('../config/jwtUtlis').verifyToken;

exports.protectAdmin=async (req,res,next)=>{



const token=req.cookies.token;

console.log("token in proctectAdmin",token);
if(!token){
  return res.status(401).json({error:"Unauthorized",success:false});
}

try{
  const decoded=verifyToken(token);
  if(decoded.role !== 'admin'){
    return res.status(401).json({error:"user cannot access admin endPoints",success:false});
  }
  req.admin=decoded; // attach admin data to req
  next();
}
catch(err){
  console.log("error in protectAdmin",err);
  return res.status(500).json({error:"Internal Server Error"});
}
}