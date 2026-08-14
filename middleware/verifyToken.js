
const Vendor=require('../models/Vendor');

const jwt=require('jsonwebtoken');

const dotenv=require('dotenv');

dotenv.config();

const secretKey=process.env.WhatIsYourName;

const verifyToken = async (req,res,next)=>{
    console.log("🔥 verifyToken middleware called");

    const token=req.headers.token
    console.log(token)

    if(!token){
        return res.status(401).json({message:"Access denied"});
    }

    try{
        const decoded=jwt.verify(token,secretKey);
        
        console.log("JWT decoded:", decoded);
        console.log("Vendor ID from JWT:", decoded.vendorId);

        const vendor = await Vendor.findById(decoded.vendorId);

        console.log("Vendor from DB:", vendor);


        if(!vendor){
            return res.status(401).json({message:"Invalid token"});
        } 
        

        req.vendorIds=vendor._id;
        next();
    }
    catch(error){
        console.error("Error verifying token:",error);
        res.status(500).json({message:"Internal server error"});    
    }
}

module.exports=verifyToken;