import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import instance from "../service/instance";
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
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image selection and convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        dispatch(setImage(base64Image));
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        description,
        price,
        image, // Base64 string
      };

      // Replace `/seller/addProduct` with your backend API URL
      const response = await instance.post("/seller/addProduct", {
        name: name,
        description: description,
        price: price,
        image: imagePreview,
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
        toast.success("Product uploaded successfully");
        // Clear the form
        dispatch(setName(""));
        dispatch(setDescription(""));
        dispatch(setPrice(""));
        dispatch(setImage(null));
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => dispatch(setName(e.target.value))}
              placeholder="Enter product name"
              required
              className="w-full p-3 border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              placeholder="Enter product description"
              required
              className="w-full p-3 border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => dispatch(setPrice(e.target.value))}
              placeholder="Enter product price"
              required
              className="w-full p-3 border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full p-3"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-full rounded-lg shadow-lg"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerUploadProduct;
