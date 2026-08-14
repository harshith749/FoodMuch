const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoute=require("./routes/productRoute");


const path=require("path");






dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => { 
  console.log("Error connecting to MongoDB:", err);
});

app.use(bodyParser.json());
app.use("/vendor",vendorRoutes);
app.use("/firm",firmRoutes);
app.use('/product',productRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



const PORT = 4000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/home' , (req, res) => {
  res.send("Welcome to the home page");
});

