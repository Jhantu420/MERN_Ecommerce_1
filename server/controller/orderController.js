// controllers/orderController.js
const Order = require("../models/Order");

exports.storeOrder = async (req, res) => {
  try {
    const { cartData, totalPrice, paymentId, orderId, user } = req.body;

    // Create a new order
    const newOrder = new Order({
      user,
      items: cartData,
      totalPrice,
      paymentId,
      orderId,
    });

    await newOrder.save();

    return res.status(201).json({ success: true, message: "Order stored successfully!" });
  } catch (error) {
    console.error("Error storing order:", error);
    return res.status(500).json({ success: false, message: "Failed to store order." });
  }
};
