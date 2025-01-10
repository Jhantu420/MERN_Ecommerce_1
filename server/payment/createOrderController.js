const Razorpay = require("razorpay");
const crypto = require("crypto");

const createOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const { amount } = req.body; // Amount in INR

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Convert to smallest currency unit
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Random receipt ID
    };

    const order = await instance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = createOrderController;
