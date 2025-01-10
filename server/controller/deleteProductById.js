const Product = require("../models/uploadProduct");

const deleteProductByIdController = (req, res) => {
  const { id } = req.params; // Extract product ID from request params
  Product.findByIdAndDelete(id)
  .then((deletedProduct) => {
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  });
};

module.exports = deleteProductByIdController;
