import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import instance from "../service/instance";

const SellerDashboard = () => {
  const { user } = useSelector(selectUser);
  const sellerId = user?.user?._id;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      if (!sellerId) {
        setError("Seller not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/getproduct?sellerId=${sellerId}`
        );
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sellerId]);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setUpdatedProduct(product);
  };

  const handleCloseModal = () => {
    setEditProduct(null);
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/seller/updateProduct",
        updatedProduct,
        { withCredentials: true }
      );

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );

      alert(response.data.message || "Product updated successfully!");

      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  // delete product by using product id
  const handleDeleteProduct = async (productId) => {
    try {
      await instance.delete(`/seller/deleteProduct`, {
        data: { user, productId },
      });

      setProducts((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-xl font-bold mt-2">Rs. {product.price}</p>
              <div className="flex mt-4 justify-between">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <label className="block mb-2">Product Name:</label>
            <input
              type="text"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              value={updatedProduct.price}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, price: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              value={updatedProduct.description}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block mb-2">Image URL:</label>
            <input
              type="text"
              value={updatedProduct.image}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, image: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
