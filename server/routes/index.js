const express = require("express");
const router = express.Router();

const userSignUpController = require("../controller/userSignUp.js");
const userLoginController = require("../controller/userSignIn.js");
const userDetailsController = require("../controller/userDetails.js");
const userLogoutController = require("../controller/userLogout.js");
const authToken = require("../controller/middleware/authToken.js");
const uploadProductPermission = require("../controller/middleware/uploadProductPermission.js"); // Admin permission middleware
const allUsers = require("../controller/allUsers.js");
const EditUser = require("../controller/EditUser.js");
const uploadProductController = require("../controller/uploadProduct.js");
const editProductController = require("../controller/editProduct.js"); // New controller for editing products
const getProductController = require("../controller/getProducts.js");
const getProductByIdController = require("../controller/getProductsById.js");
const deleteProductByIdController = require("../controller/deleteProductById.js");
const getCategoryProductOne = require("../controller/getCategoryProductOne.js");
const getCategoryWiseProduct = require("../controller/getCategoryWiseProduct.js");
const addToCartController = require("../controller/addToCartController.js");
const countAddToCardProduct = require("../controller/CountAddToCardProduct.js");
const DeleteUser = require("../controller/DeleteUser.js");
const getCartProductRelatedUserController = require("../controller/getCartProductRelatedUserController.js");
const deleteCartProductController = require("../controller/deleteCartProductController.js");
const orderController  = require("../controller/orderController");
const searchProductsController = require("../controller/searchProductController.js");
const verifyPaymentController = require("../payment/verifyPaymentController .js");
const createOrderController = require("../payment/createOrderController.js");
const getOrderController = require("../controller/getOrderDetails.js");

// Route to handle user signup
router.post("/signup", userSignUpController);

// Route to handle user login
router.post("/login", userLoginController);

// Route to fetch user details (protected, requires authentication)
router.get("/user-details", authToken, userDetailsController);

// Route to handle user logout
router.post("/logout", userLogoutController);

// Route to get all users (for admin view, consider adding auth + permission later if sensitive)
router.get("/all-users", allUsers);

// Route to delete all users
router.delete("/delete-user/:id", DeleteUser);

// Route to edit user details
router.put("/edit-user/:id", EditUser);

// Route to upload product (admin only)
router.post(
  "/upload-product",
  // authToken,
  // uploadProductPermission,
  uploadProductController
);

// Route to edit product (admin only)
router.put(
  "/edit-product/:id",
  // authToken,
  // uploadProductPermission,
  editProductController
);

// Route to get all products
router.get("/get-products", getProductController);

// To get spefic product by id
router.get("/get-products/:id", getProductByIdController);

// To Delete spefic product by id
router.delete("/delete-product/:id", deleteProductByIdController);

// get the product wise category

router.get("/get-procuctCategory", getCategoryProductOne); /// Find 1st product of each category

// get the product based on category
router.get("/category-product", getCategoryWiseProduct);

// user add to cart
router.post("/addtocart",authToken, addToCartController)

// count add to card product
router.get("/countAddToCardProduct",authToken,countAddToCardProduct)

// get CartProduct Related with User Product ID
router.get("/getCartProductRelatedUserController",authToken, getCartProductRelatedUserController)

// delete CartProduct Related with User id & Product ID
router.delete("/deleteCartProductController",authToken, deleteCartProductController )

// search the products
router.get("/searchProductsController",searchProductsController)

// Razorpay Payment Route
router.post("/create-order", createOrderController);

// Razorpay Payment Verify Controller
router.post("/verify-payment", verifyPaymentController)


// Save the order to the database
router.post("/store-order", orderController.storeOrder)

// Get order details
router.get("/get-orderDetails",authToken, getOrderController)

module.exports = router;
