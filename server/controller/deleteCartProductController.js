const CartProduct = require("../models/cartProduct");

const deleteCartProductController = async (req, res) => {
  try {
    const { productId } = req.body; // Product ID to remove from req.body
    const currentUserId = req.user.id; // Get the logged-in user's ID from `req.user`

    if (!currentUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You must be logged in to modify your cart." });
    }

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Remove the cart item for the current user and product ID
    const result = await CartProduct.deleteOne({ userId: currentUserId, productId });

    if (result.deletedCount > 0) {
      res.status(200).json({ success: true, message: "Item removed from cart." });
    } else {
      res.status(404).json({ success: false, message: "Item not found in cart." });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: false, message: "Failed to remove item", error });
  }
};

module.exports = deleteCartProductController;
