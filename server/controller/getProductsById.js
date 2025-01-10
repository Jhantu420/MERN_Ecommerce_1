const Product = require("../models/uploadProduct");

const getProductByIdController = (req, res) => {
  const { id } = req.params; // Extract product ID from request params
  Product.findById(id)
  .then((product) => {
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
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

module.exports = getProductByIdController;
