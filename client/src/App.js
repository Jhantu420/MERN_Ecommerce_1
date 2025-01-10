import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { setUserDetails, clearUserDetails } from "./store/userSlice";
// import { addToCart } from "./store/cartSlice";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import SignUp from "./pages/SignUp";
import AdminPannel from "./pages/AdminPannel";
import AllUsers from "./pages/AllUsers";
import AllProducts from "./pages/AllProducts";
import UploadProduct from "./components/UploadProduct";
import EditProduct from "./components/EditProduct";
import PrivateRoutes from "./utils/PrivateRoutes";
import CategoryProduct from "./pages/CategoryProduct";
import ProductDetails from "./pages/ProductDetails";
import CartProduct from "./pages/CartProduct";
import { fetchCart } from "./store/cartSlice";
import SearchProduct from "./pages/SearchProduct";
import OrderList from "./pages/OrderList";

const App = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [auth, setAuth] = useState({ token: false });

  // Fetch user details and update Redux store
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/user-details",
        {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      const result = await response.json();
      if (result.success) {
        dispatch(setUserDetails(result.user)); // Update user details in Redux
      } else {
        dispatch(clearUserDetails()); // Clear user details if not authenticated
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      dispatch(clearUserDetails());
    }
  };

  useEffect(() => {
    // Fetch user on app load
    fetchUserDetails();
    // fetchCartCount();
    dispatch(fetchCart());
  }, [dispatch]);

  // Sync auth token based on user details
  useEffect(() => {
    setAuth({ token: !!userDetails });
  }, [userDetails]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Header userDetails={userDetails} auth={auth} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPass />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/category-product/:category"
          element={<CategoryProduct />}
        />
        <Route path="/category-wise-product" element={<CategoryProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/Cart_Product" element={<CartProduct />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/orderList" element={<OrderList />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoutes auth={auth} />}>
          <Route
            path="/admin-pannel"
            element={<AdminPannel userDetails={userDetails} />}
          >
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-products" element={<AllProducts />} />
          </Route>
          <Route path="/upload-product" element={<UploadProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
