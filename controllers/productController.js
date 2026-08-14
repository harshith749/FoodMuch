
const Firm = require('../models/Firm');
const Product=require('../models/product')

const multer=require("multer");

 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + Path.extname(file.originalname);
        // const uniqueName = Date.now() + "-"  + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

const addProduct=async (req,res)=>{
    try{
        const {productName,price,category,description,bestSeller}=req.body;
        const image=req.file? req.file.filename : undefined;

        const firmId=req.params.firmId;
        const firm =await Firm.findById(firmId);
        console.log(firm)

        if(!firm){
            return res.status(404).json({msg:"No firm found"})
        }

        const product= new Product({productName,price,category,image,bestSeller,description,firm:firm._id})
        const savedPro= await product.save()

        firm.products.push(savedPro);
        await firm.save();
        res.status(200).json({msg:"Product added successfully",product})

    }catch(error){
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getProductByFirm=async (req,res)=>{

    try{
    const FirmId= req.params.firmId
    const firm = await Firm.findById(FirmId);
    


    if(!firm){
        res.status(404).json({msg:"Firm not Found"})
    }
    
    const firmName=await firm.firmName
    const products= await Product.find({firm:firm._id});

    res.status(200).json({products,firmName})
    }catch(error){
        console.error("Error fetching product by ID:", error);
        res.status(500).json({message:"Internal server error"});
    }


}

const deleteById=async (req,res)=>{
    try{
        const productId=req.params.productId

        const deletedProduct=await Product.findByIdAndDelete(productId);

        if(!deletedProduct){
            return res.status(404).json({msg:"Product not found"})
        }

        res.status(200).json({msg:"Product deleted successfully"})
    }catch(error){  
       console.error("Error fetching product by ID:", error);
        res.status(500).json({message:"Internal server error"});

    }
}

module.exports={addProduct:[upload.single("image"),addProduct],getProductByFirm,deleteById}