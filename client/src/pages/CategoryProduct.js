import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Product_Category from "../helpers/Product_Category";
import { addItem } from "../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";

function CategoryProduct() {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL +
            `/api/get-products?category=${category}`,
          { signal: controller.signal }
        );
        const result = await response.json();
        let products = result?.data || [];

        // Apply sorting
        if (sortBy) {
          products = products.sort((a, b) => {
            if (sortBy === "lowToHigh") return a.price - b.price;
            if (sortBy === "highToLow") return b.price - a.price;
            return 0;
          });
        }

        // Apply category filters
        if (selectedCategories.length > 0) {
          products = products.filter((product) =>
            selectedCategories.includes(product.category)
          );
        }

        setData(products);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [category, sortBy, selectedCategories]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const { checked, id } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((cat) => cat !== id)
    );
  };

  // Add to cart handler
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
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/addtocart",
        {
          method: "POST",
          credentials: "include", // Ensures cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }), // Send necessary data
        }
      );
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* Left Side */}
        <div className="w-1/4 p-2">
          <div className="bg-gray-100 p-2 rounded mb-4">
            <h3 className="font-semibold text-lg mb-2 border-b border-gray-300 pb-1">
              Sort By
            </h3>
            <form className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="lowToHigh"
                  onChange={handleSortChange}
                />
                <label>Price - Low to High</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="highToLow"
                  onChange={handleSortChange}
                />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <h3 className="font-semibold text-lg mb-2 border-b border-gray-300 pb-1">
              Filter by Category
            </h3>
            <form className="flex flex-col gap-2 overflow-y-scroll max-h-60">
              {Product_Category.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="category"
                    id={item.value}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={item.value}>{item.label}</label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-3/4 p-2">
          <div className="bg-gray-100 p-2 rounded">
            <h3 className="font-semibold text-lg mb-2">Products</h3>
            {loading ? (
              <div className="text-center p-5">Loading...</div>
            ) : data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded shadow p-4 bg-white flex flex-col"
                  >
                    <Link
                      to={"/product/" + product?._id}
                      className="bg-slate-300 p-2 min-h-[120px] flex justify-center items-center"
                    >
                      <img
                        src={product.imageFiles[0]} // Displaying the first image
                        alt={product.productName}
                        className="w-full h-full object-contain rounded-sm hover:scale-110 transition-all"
                        style={{
                          backgroundColor: "transparent",
                          mixBlendMode: "multiply",
                        }}
                      />
                    </Link>
                    <h4 className="text-lg font-semibold mt-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-600 font-bold">
                        ₹{product.price}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <button
                      className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5">No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProduct;
