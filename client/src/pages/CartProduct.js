import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeItem } from "../store/cartSlice";

const CartProduct = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/getCartProductRelatedUserController",
          {
            credentials: "include",
          }
        );
        const result = await response.json();
        if (result.success) {
          const productDetailsPromises = result.data.map(async (item) => {
            const productResponse = await fetch(
              `http://localhost:4000/api/get-products/${item.productId}`
            );
            const productResult = await productResponse.json();
            if (productResponse.ok) {
              return {
                ...item,
                productDetails: productResult.data,
              };
            } else {
              console.error(
                `Failed to fetch product details for ID: ${item.productId}`
              );
              return null;
            }
          });
          const completeCartItems = await Promise.all(productDetailsPromises);
          setCartItems(completeCartItems.filter((item) => item !== null));
        } else {
          toast.error(result.message || "Failed to fetch cart items.");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("An error occurred while fetching cart items.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Handle remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/deleteCartProductController",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productDetails._id !== productId)
        );
        dispatch(removeItem(productId));
        toast.success(result.message || "Item removed successfully.");
      } else {
        toast.error(result.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("An error occurred while removing the item.");
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.productDetails.selling * item.quantity,
    0
  );

  // Razorpay script loading
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (
        !document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () =>
          console.log("Razorpay script loaded successfully");
        script.onerror = () => console.error("Failed to load Razorpay script");
        document.body.appendChild(script);
      }
    };
    loadRazorpayScript();
  }, []);

  // Handle checkout
  const handleBuyAll = async () => {
    try {
      const cartData = cartItems.map((item) => ({
        productId: item.productDetails._id,
        quantity: item.quantity,
      }));

      // Create Razorpay Order
      const response = await fetch("http://localhost:4000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const { success, order } = await response.json();

      if (!success) {
        toast.error("Failed to create Razorpay order.");
        return;
      }

      // Razorpay Payment Options
      const options = {
        key: process.env.RAZORPAY_KEY, // Your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "Easy Commerce",
        description: "Thank you for your purchase!",
        order_id: order.id,
        handler: async function (response) {
          // Handle payment success
          const paymentResult = await fetch(
            "http://localhost:4000/api/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const result = await paymentResult.json();
          if (result.success) {
            toast.success("Payment successful!");
            setCartItems([]);
            dispatch({ type: "cart/clearCart" });
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(
          `Payment failed: ${response.error.description} (Code: ${response.error.code})`
        );
      });
      rzp.open();
    } catch (error) {
      console.error("Error during Razorpay checkout:", error);
      toast.error("An error occurred while processing payment.");
    }
  };

  // Render loading state
  if (loading)
    return <div className="text-center p-5">Loading cart items...</div>;

  // Render empty cart
  if (!cartItems.length)
    return <div className="text-center p-5">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 my-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cart Items */}
        <div className="col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productDetails._id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.productDetails.imageFiles[0]}
                  alt={item.productDetails.productName}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.productDetails.productName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.productDetails.description}
                  </p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{item.productDetails.selling}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none"
                  onClick={() => handleRemoveFromCart(item.productDetails._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </p>
            <p className="flex justify-between">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </p>
          </div>
          <button
            className="w-full bg-green-600 text-white font-bold py-3 mt-4 rounded-lg hover:bg-green-700 focus:outline-none"
            onClick={handleBuyAll}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
