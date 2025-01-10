import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import Upload_Image from "../helpers/Upload_Image";
import { useParams, useNavigate } from "react-router-dom";
import Product_Category from "../helpers/Product_Category";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    category: "",
    price: "",
    description: "",
    imageFiles: [],
    selling: "",
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  // Pre-fill form data when the product prop changes
  useEffect(() => {
    // Fetch the product details
    fetch(`http://localhost:4000/api/get-products/${id}`)
      .then((res) => res.json())
      .then((response) => {
        console.log("Fetched Response:", response); // Debug log
        const data = response.data; // Access the `data` field
        setFormData({
          productName: data.productName || "",
          brandName: data.brandName || "",
          category: data.category || "",
          price: data.price || "",
          selling: data.selling || "",
          description: data.description || "",
          imageFiles: data.imageFiles || [],
        });
        console.log('Fetched from data', formData)
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image files to the server and update the form data
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    try {
      const uploadImageCloudNary = await Upload_Image(file);

      setFormData((prevData) => ({
        ...prevData,
        imageFiles: [...prevData.imageFiles, uploadImageCloudNary.url],
      }));

      // console.log("Uploaded Image URL:", uploadImageCloudNary.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prevData) => {
      const newImageFiles = [...prevData.imageFiles];
      newImageFiles.splice(index, 1); // Remove the image at the specified index
      return { ...prevData, imageFiles: newImageFiles };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clone the formData to avoid mutating the original state
    const formDataWithoutId = { ...formData };

    // Remove the _id from the form data before submission
    delete formDataWithoutId._id;

    // Now send the form data without the _id
    // console.log("Form Data before submission:", formDataWithoutId);

    fetch(`http://localhost:4000/api/edit-product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formDataWithoutId), // Send formData without _id
    })
      .then((res) => res.json())
      .then(()=>{
        navigate("/admin-pannel/all-products");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md max-w-md mx-auto mb-6 overflow-y-auto max-h-[500px]">
      <h2 className="text-xl font-semibold mb-4 flex justify-center">
        Edit Product
      </h2>
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
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="brandName" className="block text-sm font-medium mb-2">
            Brand Name
          </label>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Product Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
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
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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
            value={formData.selling}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label
            htmlFor="imageFiles"
            className="block text-sm font-medium mb-2"
          >
            Upload Images
          </label>
          <input
            type="file"
            id="imageFiles"
            name="imageFiles"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Display uploaded images */}
        {formData.imageFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Uploaded Images:</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {formData.imageFiles.map((image, index) => (
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

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
