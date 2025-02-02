import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instance from "../service/instance";
import axios from "axios";
import { selectUser } from "../Redux/Features/auth/userSlice";
import { toast } from "react-toastify";

const Order = () => {
  const { user } = useSelector(selectUser);
  const userId = user?.user?._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError("User not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await instance.get(`/getallorders?userId=${userId}`);
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentSubmit = async () => {
    try {
       const { data } = await axios.post(
    "http://localhost:3000/auth/createrazorpayorder",
        {
          amount: 56378,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log("Razorpay Order Created:", data);
      const options = {
        key: "rzp_test_l9AEPH2OgMir0D", // Use env variable in production
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        handler: async function (response) {
          toast.success("Payment Success:", response);
          try {
            const verifyRes = await axios.post(
              "http://localhost:3000/auth/verify-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            console.log("Payment Verified:", verifyRes.data);
            toast.success("Payment Successful!");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed! Please try again.");
          }
        },
       
        theme: {
          color: "#3399cc",
        },
      };
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay SDK is not loaded!");
        alert("Payment failed! Please refresh and try again.");
      }
      setShowModal(false);
      setName("");
      setAddress("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment failed! Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-lg text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 mb-6 border rounded-lg shadow-md"
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
              <span
                className={`px-4 py-2 rounded-full font-semibold text-white ${
                  order.status === "Pending"
                    ? "bg-yellow-400"
                    : order.status === "Shipped"
                    ? "bg-blue-500"
                    : order.status === "Delivered"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-lg mb-4">
              Total Price: <strong>Rs: {order.totalPrice}</strong>
            </p>

            {order.status === "Pending" && (
              <button
                className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                Make Payment
              </button>
            )}
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Enter Payment Details
            </h2>

            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <label className="block text-sm font-medium">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
            />

            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handlePaymentSubmit}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
