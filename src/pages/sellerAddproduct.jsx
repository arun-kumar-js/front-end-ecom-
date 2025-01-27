import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setDescription,
  setPrice,
  setImage,
  selectDescription,
  selectImage,
  selectName,
  selectPrice,
} from "../Redux/Features/auth/productUploadSlice";

const SellerUploadProduct = () => {
  const name = useSelector(selectName);
  const description = useSelector(selectDescription);
  const price = useSelector(selectPrice);
  const image = useSelector(selectImage);
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null); // Optional: For showing a preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result; // Contains the Base64 string
        dispatch(setImage(base64Image));
        setImagePreview(base64Image); // Optional: For showing a preview
     
      };
  
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        description,
        price,
        image, // Already a Base64 string
      };

      const response = await fetch("/seller/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Product uploaded successfully");
        // Clear the form
        dispatch(setName(""));
        dispatch(setDescription(""));
        dispatch(setPrice(""));
        dispatch(setImage(null));
        setImagePreview(null);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to upload product");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Upload Product
        </h1>
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label
              htmlFor="productname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name
            </label>
            <input
              name="productname"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => dispatch(setName(e.target.value))}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <input
              name="description"
              type="text"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price
            </label>
            <input
              name="price"
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => dispatch(setPrice(e.target.value))}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Image
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 rounded-lg shadow-lg w-full"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerUploadProduct;