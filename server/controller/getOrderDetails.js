const Order = require("../models/Order");

const getOrderController = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const orderList = await Order.find({ userId: currentUserId });
    res.json({
      data: orderList,
      message: "OrderList",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        error: true,
        message: err,
    })
  }
};
module.exports = getOrderController;
