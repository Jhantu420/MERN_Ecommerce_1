const CartProduct = require("../models/cartProduct");

const getCartProductRelatedUserController = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Get the logged-in user's ID from `req.user`

    if (!currentUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You must be logged in to view your cart." });
    }

    // Fetch the cart items for the current user
    const cartItems = await CartProduct.find({ userId: currentUserId }).populate("productId");

    if (!cartItems.length) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "Your cart is empty." });
    }

    // Return the cart items
    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch cart", error });
  }
};

module.exports = getCartProductRelatedUserController;
