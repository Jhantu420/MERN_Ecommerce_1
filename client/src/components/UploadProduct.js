import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Product_Category from "../helpers/Product_Category";
import Upload_Image from "../helpers/Upload_Image";
import Display_Image from "../helpers/Display_Image";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function UploadProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [price, setPrice] = useState("");
  const [selling, setSelling] = useState("");
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    try {
      const uploadResponse = await Upload_Image(file);
      setImageFiles((prev) => [...prev, uploadResponse.url]); // Append new image URL
    } catch (error) {
      toast.error("Failed to upload image!");
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedImages);
    alert(updatedImages)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Step 1: Upload images to Cloudinary first
    const uploadedImageUrls = [];

    try {
      // Upload all images
      for (const file of imageFiles) {
        const uploadResponse = await Upload_Image(file); // Assuming Upload_Image returns the upload result with a 'url' property
        uploadedImageUrls.push(uploadResponse.url); // Collect uploaded image URLs
      }

      // Step 2: Prepare form data
      const formData = {
        productName,
        brandName,
        description,
        category,
        imageFiles: uploadedImageUrls, // Use the URLs of uploaded images
        price,
        selling,
      };

      // Step 3: Submit the form data
      const response = await axios.post(
        "http://localhost:4000/api/upload-product",
        formData
      );

      // Step 4: Handle success
      toast.success(response.data.message);
      console.log(response);
      navigate('/admin-pannel/all-products')
      resetForm();
    } catch (error) {
      // Handle any errors
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const resetForm = () => {
    setProductName("");
    setBrandName("");
    setDescription("");
    setCategory("");
    setImageFiles([]);
    setPrice("");
    setSelling("");
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md max-w-md mx-auto mb-6 overflow-y-auto max-h-[500px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-sm font-medium mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            // required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="brandName" className="block text-sm font-medium mb-2">
            Brand Name
          </label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            // required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Product Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            // required
          >
            <option value="">Select Category</option>
            {Product_Category.map((categoryOption) => (
              <option key={categoryOption.id} value={categoryOption.value}>
                {categoryOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            // required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="selling" className="block text-sm font-medium mb-2">
            Selling Price
          </label>
          <input
            type="number"
            id="selling"
            name="selling"
            value={selling}
            onChange={(e) => setSelling(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex-1 mb-4">
          <label htmlFor="imageFile" className="block text-sm font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            multiple
            onChange={handleImage}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit 
          </button>
        </div>
      </form>

      {/* Display uploaded images */}
      {imageFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Uploaded Images:</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {imageFiles.map((image, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-24 h-24 object-cover rounded-md border"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(image);
                  }}
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 hidden group-hover:block"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        {openFullScreenImage && (
          <Display_Image
            onClose={() => {
              setOpenFullScreenImage(false);
            }}
            imgUrl={fullScreenImage}
          />
        )}
      </div>
    </div>
  );
}

export default UploadProduct;
