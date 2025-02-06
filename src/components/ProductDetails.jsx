import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import React from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useSelector(selectUser);
  const userId = user?.user?._id;
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    console.log("orderId", orderId);
    try {
      await axios.delete(`http://localhost:3000/auth/order/${orderId}`, {
        withCredentials: true,
      });

      // Remove order from UI
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/getorder/${userId}`,
          { withCredentials: true }
        );

        let orderData = response.data.orders || [];

        // Fetch product details for each product in each order
        const updatedOrders = await Promise.all(
          orderData.map(async (order) => {
            const productsWithDetails = await Promise.all(
              order.products.map(async (product) => {
                try {
                  const productRes = await axios.get(
                    `http://localhost:3000/auth/product/${product.productId}`,
                    { withCredentials: true }
                  );
                  return { ...product, name: productRes.data.name }; // Add product name
                } catch (err) {
                  console.error("Error fetching product:", err);
                  return { ...product, name: "Unknown Product" }; // Fallback name
                }
              })
            );

            return { ...order, products: productsWithDetails };
          })
        );

        setOrders(updatedOrders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg">Loading orders...</p>
    );
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="mb-8 border rounded-lg shadow-md p-4 bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Order ID: {order._id}
              </h3>

              <table className="w-full border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-left">Product ID</th>
                    <th className="p-4 text-left">Product Name</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.length > 0 ? (
                    order.products.map((product, pIndex) => (
                      <tr
                        key={product._id}
                        className={
                          pIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }
                      >
                        <td className="p-4">{product.productId}</td>
                        <td className="p-4">{product.name}</td>
                        <td className="p-4">{product.quantity}</td>
                        <td className="p-4 font-semibold text-green-600">
                          {pIndex === 0 ? `₹${order.totalPrice}` : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center" colSpan="4">
                        No Products
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Bottom section for User Name, Address, Phone, and Order Status */}
              <div className="mt-4 p-4 border-t bg-gray-50 rounded-b-lg">
                <p className="text-lg font-medium text-gray-700">
                  <span className="font-semibold">Name:</span> {order.name}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Phone:</span>{" "}
                  {order.phoneNumber}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  <span className="font-semibold text-gray-700">
                    Order Status:
                  </span>{" "}
                  {order.status}
                </p>
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
