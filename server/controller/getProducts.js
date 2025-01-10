const Product = require("../models/uploadProduct");

const getProductController = (req, res) => {
  Product.find()
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

module.exports = getProductController;
