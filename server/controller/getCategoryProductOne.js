const ProductModel = require("../models/uploadProduct");

const getCategoryProductOne = async (req, res) => {
  try {
    const productCategory = await ProductModel.distinct("category");

    // array to store one product from each category

    const productByCategory = [];

    for (const category of productCategory) {
      let product = await ProductModel.findOne({ category });
      if (product) {
        productByCategory.push(product);
      }
    }

    res.status(200).json({
      success: true,
      message: "Product category fetched successfully",
      data: productByCategory,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = getCategoryProductOne;
