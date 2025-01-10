const Product = require("../models/uploadProduct");
const searchProductsController = async (req, res) => {
  try {
    // Extract the search query from request parameters
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required." });
    }

    // console.log(query);
    // Create a case-insensitive regex for the search query
    const regex = new RegExp(query, "i","g");

    // Fetch products that match the query in name or description
    const products = await Product.find({
      $or: [{ productName: { $regex: regex } }, { description: { $regex: regex } }, { category: { $regex: regex } }, { brandName: { $regex: regex } }],
    });

    if (!products.length) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No products found." });
    }

    // Return the matching products
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error searching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to search products", error });
  }
};

module.exports = searchProductsController;
