const express=require('express')
const productController=require("../controllers/productController");

const router=express.Router();

router.post("/add-product/:firmId",productController.addProduct)
router.get("/get-products/:firmId",productController.getProductByFirm)



router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName
    res.headersSent('Content-Type','image/jpeg')
    res.sendFile(path.join(__dirname,'../uploads',imageName))
})

router.delete("/delete-product/:productId",productController.deleteById)


router.get("/test", (req, res) => {
    res.status(200).json({msg:"test route"})
});

module.exports=router;