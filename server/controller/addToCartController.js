const CartProduct = require("../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req?.body; // Extract the productId from the request body
    // console.log("user details",req.user)
    const currentUserId = req.user.id; // Get the current user (assumes middleware sets req.user)
    // console.log("This is",currentUserId);
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }
    if (!currentUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Login please...." });
    }

    // Assuming you have a Cart model or database utility to interact with your data
    const payload = {
      productId,
      userId: currentUserId, // Ensure the user ID is properly passed
      quantity: 1, // Default quantity for adding a product
    };

    // Add logic to interact with your database
    // E.g., if using MongoDB:
    // Check if the product is already in the cart
    const existingCartItem = await CartProduct.findOne({
      productId,
      userId: currentUserId,
    });

    if (existingCartItem) {
      // If product already exists in the cart, Show the message
      return res.json({
        message: "product is already exist in the cart",
        success: false,
        error: true,
      });
    } else {
      // Create a new cart item if it doesn't exist
      const newCartItem = new CartProduct(payload);
      await newCartItem.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add product to cart" });
  }
};

module.exports = addToCartController;
