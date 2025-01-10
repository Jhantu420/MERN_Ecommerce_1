import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
function SearchProduct() {
  const cart = useSelector((state) => state.cart.items);
  const query = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate();
  const handleAddToCart = async (product) => {
    try {
      // Check if the product is already in the cart
      const existingCartItem = cart.find(
        (item) => item.productId === product._id
      );
      if (existingCartItem) {
        toast.info(`${product.productName} is already in the cart.`);
        return;
      }

      // Proceed with adding to cart
      const response = await fetch("http://localhost:4000/api/addtocart", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }), // Send necessary data
      });
      const result = await response.json();

      if (response.status === 401) {
        toast.error("You need to be logged in to add items to the cart.");
        navigate("/sign-in"); // Redirect to login page
        return;
      }

      if (response.ok) {
        dispatch(addItem({ productId: product._id, quantity: 1 })); // Update local cart state
        toast.success(`${product.productName} added to the cart!`);
      } else {
        toast.error(result.message || "Failed to add item to the cart.");
      }
    } catch (error) {
      console.error("Error while adding to cart:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const searchProducts = () => {
    setLoading(true);

    fetch(`http://localhost:4000/api/searchProductsController${query.search}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          toast.success("Products fetched successfully!");
        } else {
          toast.error(result.message || "Failed to fetch products.");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again later.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    searchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-2 my-4">
      {/* Loading Spinner */}
      {loading && <div className="text-center p-5">Loading products...</div>}

      {/* Products Display */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 justify-center">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-full min-w-[200px] md:min-w-[240px] max-w-[200px] md:max-w-[240px] bg-white rounded-sm shadow flex flex-col my-4"
            >
              <div className="bg-slate-300 p-2 min-h-[120px] flex justify-center items-center">
                <img
                  src={
                    product.imageFiles[0] || "https://via.placeholder.com/150"
                  }
                  alt={product.productName || "Product Image"}
                  className="w-full h-full object-contain rounded-sm hover:scale-110 transition-all"
                  style={{
                    backgroundColor: "transparent",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
              <div className="flex flex-col justify-between p-3 flex-grow">
                <h3 className="text-sm font-medium md:text-base text-ellipsis line-clamp-1">
                  {product.productName || "Unknown Product"}
                </h3>
                <p className="text-xs text-gray-600 text-ellipsis line-clamp-2">
                  {product.description || "No description available."}
                </p>
                <p className="text-xs font-bold text-gray-600 text-ellipsis line-clamp-1">
                  {product.category || "No category available"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-red-600">
                    ₹{product.selling?.toFixed(2) || "0.00"}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ₹{product.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <button
                  className="bg-red-600 text-white text-xs font-semibold px-3 py-2 mt-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Found */}
      {!loading && !products.length && (
        <div className="text-center text-gray-500 mt-4">
          No products found matching your search.
        </div>
      )}
    </div>
  );
}

export default SearchProduct;
