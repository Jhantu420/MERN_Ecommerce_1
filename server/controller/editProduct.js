


const Product = require("../models/uploadProduct");

const editProductController = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from request params
        const updates = req.body;  // Get the fields to update from request body

        // console.log("Product ID:", id);             // Log product ID
        // console.log("Update Data:", updates);       // Log the update data

        // Find the product by ID and update only the provided fields
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updates },                      // Use `$set` to update only specified fields
            { new: true, runValidators: true }      // Return updated product and validate updates
        );

        if (!updatedProduct) {
            // console.log("Product not found");      // Log if product is not found
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // console.log("Updated Product:", updatedProduct); // Log the updated product
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.log("Failed to update product:", error.message); // Log error message
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
};

module.exports = editProductController;
