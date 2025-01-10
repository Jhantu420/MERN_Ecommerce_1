const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
});

const addToCartModel = mongoose.model("addToCart", productSchema);

module.exports = addToCartModel;