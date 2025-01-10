const ProductModel = require("../models/uploadProduct");

const getCategoryWiseProduct = async (req, res) => {
    try {
        // Use req.query to retrieve the category from the query string
        const { category } = req.query;

        // Validate if the category is provided
        if (!category) {
            return res.status(400).json({
                message: "Category is required",
                success: false,
                error: true,
            });
        }

        // Query the database for products in the specified category
        const product = await ProductModel.find({ category });

        // Respond with the retrieved data
        res.json({
            data: product,
            message: "Product",
            success: true,
            error: false,
        });
    } catch (error) {
        // Handle any errors
        res.status(400).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
};

module.exports = getCategoryWiseProduct;
