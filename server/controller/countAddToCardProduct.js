const CartProduct = require("../models/cartProduct");

const getAddToCartProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartData = await CartProduct.find({ userId: userId }); // Use findOne for a single result

    if (!cartData) {
      return res.status(404).json({
        data: null,
        message: "Cart not found for the user",
        error: true,
        success: false,
      });
    }

    res.json({
      data: cartData,
      message: "Cart fetched successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = getAddToCartProduct;
