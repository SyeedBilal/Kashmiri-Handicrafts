const CartItems=require('../models/cartModel');
const mongoose = require("mongoose");

exports.addToCart=async (req,res)=>{


  const {productId,quantity,userId}=req.body;
  console.log("productId",req.body);
  
  const alreadyExists=await CartItems.findOne({productId,userId});

  if(alreadyExists){
    console.log("alreadyExists",alreadyExists);
    alreadyExists.quantity+=quantity;
    await alreadyExists.save();
    return res.status(200).json(alreadyExists);
  }

  try{
    const cartItem=await CartItems.create({
      productId,
      quantity,
      userId
    });
    console.log("cartItem",cartItem);
    res.status(200).json(cartItem);
  }
  catch(err){
    console.log("error in addToCart",err);
    res.status(500).json({error:"Internal Server Error"});
  }


}

exports.getCartItems=async (req,res)=>{

// fetch userId from session for secure authentication (already done in the route using sessionCheck middleware)
  const userId=req.session.user.id

  console.log("userId at getCartItems",userId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "User not authenticated"
    });
  }

  try{
    const cartItems=await CartItems.find({userId}).populate('productId');
    console.log("cartItems",cartItems);
    res.status(200).json(cartItems);
  }
  catch(err){
    console.log("error in getCartItems",err);
    res.status(500).json({error:"Internal Server Error at getCartItems"});
  }
}
exports.removeFromCart=async (req,res)=>{
  
  let {userId,productId}=req.body;
console.log(productId,userId);
console.log("productId:", productId, typeof productId);
console.log("userId:", userId, typeof userId);

 
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      error: "UserId and productId are required"
    });
  }

  try{
  
    const cartItem=await CartItems.findOneAndDelete({userId,productId});
    console.log("cartItem",cartItem);
    res.status(200).json(cartItem);
  }
  catch(err){
    console.log("error in removeFromCart",err);
    res.status(500).json({error:"Internal Server Error"});
  }
}


//   yet to implement
// exports.updateCart=async (req,res)=>{
//   const {userId,productId,quantity}=req.body;
//   try{
//     const cartItem=await CartItems.findOneAndUpdate({userId,productId},{quantity});
//     console.log("cartItem",cartItem);
//     res.status(200).json(cartItem);
//   }
//   catch(err){
//     console.log("error in updateCart",err);
//     res.status(500).json({error:"Internal Server Error"});
//   }
// }