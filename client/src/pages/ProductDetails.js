import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { useParams } from "react-router-dom";

import VarticalCardProduct from "../components/VarticalCardProduct";
import AddToCart from "../helpers/AddToCart";

function ProductDetails() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    price: "",
    description: "",
    imageFiles: [],
    selling: "",
  });
  const [activeImage, setActiveImage] = useState(null);
  const [zoom, setZoom] = useState({ visible: false, x: 0, y: 0 });

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/get-products/${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          const productData = response.data;
          setData({
            productName: productData.productName || "",
            brandName: productData.brandName || "",
            category: productData.category || "",
            price: productData.price || "",
            selling: productData.selling || "",
            description: productData.description || "",
            imageFiles: productData.imageFiles || [],
          });
          setActiveImage(productData.imageFiles[0] || null);
        } else {
          console.error("Failed to fetch product details.");
        }
      })
      .catch((error) => console.error("Error fetching product:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Percentage X
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Percentage Y
    setZoom({ visible: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoom({ visible: false, x: 0, y: 0 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 flex flex-col md:flex-row gap-6 md:gap-24">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row md:w-auto gap-9">
          <div className="flex md:flex-col gap-4 overflow-x-auto">
            {data.imageFiles.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg shadow cursor-pointer ${
                  activeImage === image ? "ring-2 ring-red-500" : ""
                }`}
                onClick={() => setActiveImage(image)}
              />
            ))}
          </div>
          <div
            className="w-full h-full relative flex justify-center items-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={data.productName}
                className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] bg-gray-200 flex justify-center items-center rounded-lg shadow">
                <p>No Image Available</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details or Zoom Display */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 relative">
          {zoom.visible ? (
            <div
              className="absolute inset-0 w-full h-full z-20"
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundSize: "200%",
                backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                backgroundRepeat: "no-repeat",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            ></div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                {data.productName}
              </h1>
              <p className="text-lg">
                <strong>Brand:</strong> {data.brandName}
              </p>
              <p className="text-lg">
                <strong>Category:</strong> {data.category}
              </p>
              <p className="text-gray-700 text-md">
                <strong>Description:</strong> {data.description}
              </p>
              <div className="flex text-red-400 items-center gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>
              <p className="text-2xl space-x-4 text-red-600 font-bold mt-2">
                <strong>Price:</strong> ₹{data.selling}{" "}
                <span className="line-through text-gray-500">
                  ₹{data.price}
                </span>
              </p>

              <div className="flex space-x-5">
                <button className="px-10 py-2 border-2 border-red-500 hover:text-white text-red-600 rounded-lg shadow hover:bg-red-500 transition duration-300">
                  Buy
                </button>
                <button
                  className="bg-red-600 text-white text-xs font-semibold px-3 py-2 mt-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={(e) => {
                    AddToCart(e, id);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <VarticalCardProduct
        category={data.category}
        heading={"Top's" + " " + data.brandName}
      />
    </>
  );
}

export default ProductDetails;
