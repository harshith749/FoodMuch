

const Vendor =require("../models/Vendor");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const dotenv=require('dotenv');
dotenv.config();

const secretKey=process.env.WhatIsYourName;



const vendorRegister = async (req, res) => {
    const {username,email,password} = req.body;
    try{
        const vendorEmail=await Vendor.findOne({email:email});

        if(vendorEmail){
            return res.status(400).json({message:"Vendor already exists"});
        }
        const hashedPass=await bcrypt.hash(password,10);

        const newVendor= new Vendor({username,email,password:hashedPass});
        await newVendor.save();

        res.status(201).json({message:"Vendor registered successfully"});
        console.log("registered successfully");




    }catch(error){
        console.error("Error registering vendor:", error);
        res.status(500).json({message:"Internal server error"});
    }
};


const venderLogin=async (req,res)=>{
    const {email,password}=req.body;

    try{
        const vendor=await Vendor.findOne({email:email});
        if(!vendor || !await bcrypt.compare(password,vendor.password)){
          return res.status(401).json({message:"Invalid email or password"});
        }

        
        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"});


        res.status(201).json({success:"Login sucess",token})
        console.log(email)
        console.log(password)
    }
    catch(error){
        console.error("Error logging in vendor:", error);
        res.status(500).json({message:"Internal server error"});
    }
};

const getAllVendors=async (req,res)=>{
    try{
       const vendors=await Vendor.find().populate("firm");
       res.json({vendors})

    }catch(error){
          console.log("Error logging in vendor:", error);
        res.status(500).json({message:"Internal server error"});

    }
}

const getVendorById=async (req,res)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findById(vendorId).populate("firm");

        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
        }

        res.json({vendor});
    }catch(error){  
        console.log("Error fetching vendor by ID:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports={
    vendorRegister,
    venderLogin,
    getAllVendors,
    getVendorById
}
