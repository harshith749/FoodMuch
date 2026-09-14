const Firm=require("../models/Firm");
const Vendor=require("../models/Vendor");
const multer=require("multer");
const path=require("path");

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

const addFirm=async (req,res)=>{
    try{
    const {firmName,area,category,region,offer}=req.body

    const image = req.file? req.file.filename : undefined;

    const vendor =await Vendor.findById(req.vendorIds);
    

    if(!vendor){
        return res.status(404).json({message:"Vendor not founded"});
    }

    const firm =new Firm({firmName,area,category,region,offer,image,vendor:vendor._id});

    const savedFirm= await firm.save();


    vendor.firm.push(savedFirm);
    await vendor.save();

    res.status(201).json({ message: "Firm added successfully", firm });
    }catch(error){
        console.error("Error adding firm:", error);
        res.status(500).json({ message: "Internal server errorsss" });
    }
}

const deleteFirmById=async (req,res)=>{
    try{
        const FirmId=req.params.FirmId
        console.log(FirmId)

        const deletedFirm=await Firm.findByIdAndDelete(FirmId);

        if(!deletedFirm){
            return res.status(404).json({msg:"Firm not found"})
        }

        res.status(200).json({msg:"Firm deleted successfully"})
    }catch(error){  
       console.error("Error fetching product by ID:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports={addFirm:[upload.single("image"),addFirm],deleteFirmById};