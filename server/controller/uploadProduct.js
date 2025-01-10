const Product = require("../models/uploadProduct");

async function uploadProductController(req, res) {
    try {
        const { productName, brandName, description, category, imageFiles, price, selling } = req.body;
    
        const product = new Product({
          productName,
          brandName,
          description,
          category,
          imageFiles,
          price,
          selling,
        });
    
        await product.save();
    
        res.status(201).json({
          message: "Product uploaded successfully",
          product,
        });
      } catch (error) {
          res.status(500).json({
              message: "Failed to upload product",
              error: error.message
          })
      }
}

module.exports = uploadProductController














