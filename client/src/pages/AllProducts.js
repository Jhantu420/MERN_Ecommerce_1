import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from the API
  const fetchProducts = () => {
    setLoading(true); // Set loading true when refetching
    fetch("http://localhost:4000/api/get-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data?.data || []); // Handle products if available
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  // Call fetchProducts when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete any product

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:4000/api/delete-product/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            toast.success("Product deleted successfully!");
            // Correctly filter out the deleted product and update the state
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== id)
            );
          } else {
            console.error("Error deleting product:", response.message);
            toast.error("Failed to delete the product. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Request failed:", error);
          toast.error("An error occurred. Please try again.");
        });
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link
          to="/upload-product"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Upload Product
        </Link>
      </div>

      {/* Products Grid */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)] mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(products) &&
            //If products is an array, the map function will execute to render the list of items.
            // If products is not an array (e.g., null, undefined, or another type), nothing is rendered, and no error occurs.
            products.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow flex flex-col justify-between"
                style={{ height: "400px" }} // Fixed height for all cards
              >
                {/* Product Image */}
                <img
                  src={item.imageFiles?.[0] || "/placeholder.png"}
                  alt={item.productName || "Product"}
                  className="w-full h-40 object-cover rounded-md"
                />

                {/* Product Details */}
                <div className="mt-2 flex-grow">
                  <h2 className="text-lg font-semibold truncate">
                    {item.productName || "Product Name Not Found"}
                  </h2>
                  <h3 className="text-md font-medium truncate">
                    {item.brandName || "Brand Unknown"}
                  </h3>
                  <p className="text-gray-600 truncate">
                    {item.category || "Category"}
                  </p>
                  <p className="text-gray-600">&#8377;{item.selling || "N/A"}</p>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {item.description || "No description available."}
                  </p>
                </div>

                {/* Edit & Delete Icons */}
                <div className="flex justify-between items-center mt-4">
                  {/* Delete Product Icon */}
                  <button
                    onClick={() => handleDeleteProduct(item._id)}
                    className="bg-red-400 hover:bg-red-700 p-2 rounded-full text-white"
                  >
                    <MdDelete />
                  </button>

                  {/* Edit Product Icon */}
                  <Link
                    to={`/edit-product/${item._id}`}
                    className="bg-green-400 hover:bg-green-700 p-2 rounded-full text-white"
                  >
                    <MdModeEdit />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default AllProducts;
