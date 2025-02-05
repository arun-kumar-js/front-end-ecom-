import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instance from "../service/instance";
import axios from "axios";
import { selectUser } from "../Redux/Features/auth/userSlice";
import { toast } from "react-toastify";


const Cart = () => {
  const { user } = useSelector(selectUser);
  const userId = user?.user?._id;
  const [, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await instance.get(`/getcart?userId=${userId}`);
        const products = response.data?.cart?.products || [];
        setCartItems(
          products.map((item) => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          }))
        );
      } catch (err) {
        toast.error("Error fetching cart data.");
      }
    };
    fetchCart();
  }, [userId]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCart = async (productId) => {
    try {
      await instance.delete(`/removecart`, { data: { userId, productId } });
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async () => {
    if (!userId) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    if (!name || !address || !phoneNumber) {
      toast.error("Please fill all the details!");
      return;
    }

    try {
      const response = await instance.post(
        `/createorder`,
        {
          userId,
          name,
          address,
          phoneNumber,
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            productName: item.name,
            
          })),
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Order Created:", response.data);
      toast.success("Order placed successfully!");

      // Clear cart after successful order creation
      await instance.delete(`/clearcart`, { data: { userId } });
      setCartItems([]);
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Order creation failed! Please try again."
      );
    }
  };

  const handleOrderSubmitAndPayment = async () => {
    try {
      // Close the modal immediately
      setShowModal(false);

      // Step 1: Run Payment First
      const paymentSuccess = await handlePaymentSubmit();

      if (paymentSuccess) {
        console.log("Payment successful. Proceeding to order submission...");
        await handleOrderSubmit(); // Step 2: Run Order only after payment success
      } else {
        console.error("Payment failed. Order will not proceed.");
      }
    } catch (error) {
      console.error("Error during payment or order submission:", error);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/createrazorpayorder",
        { amount: totalPrice * 1 },
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      console.log("Razorpay Order Created:", data);

      return new Promise((resolve, reject) => {
        const options = {
          key: "rzp_test_l9AEPH2OgMir0D", // Replace with your Razorpay key
          amount: data.amount,
          currency: "INR",
          order_id: data.orderId,
          handler: async function (response) {
            toast.success("Payment Success");
            try {
              const verifyRes = await axios.post(
                "http://localhost:3000/auth/verify-payment",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );

              console.log("Payment Verified:", verifyRes.data);
              toast.success("Payment Successful!");
              resolve(true); // ✅ Payment succeeded
            } catch (error) {
              console.error("Payment verification failed:", error);
              toast.error("Payment verification failed!");
              reject(false); // ❌ Payment verification failed
            }
          },
          theme: { color: "#3399cc" },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error("Razorpay SDK is not loaded!");
          alert("Payment failed! Please refresh and try again.");
          reject(false); // ❌ Razorpay not loaded
        }
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment failed! Please try again.");
      return false; // ❌ Payment request failed
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Your Cart
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {item.description}
              </p>
              <h4 className="text-xl font-semibold text-blue-600 mt-2">
                ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
              </h4>

              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  🔽
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  🔼
                </button>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleRemoveCart(item._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xl font-bold text-gray-800 mt-6">
        Total Payment Rs: {totalPrice}
      </div>

      {cartItems.length > 0 && (
        <button
          className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition mt-4"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Proceed to Payment
        </button>
      )}

      {cartItems.length === 0 && (
        <div className="text-center text-xl font-semibold text-gray-800 mt-6">
          Your cart is empty!
        </div>
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
                onClick={handleOrderSubmitAndPayment}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentVerified && (
        <div className="mt-6 text-center text-green-600 text-xl font-semibold">
          Payment Successful!
        </div>
      )}
    </div>
  );
};

export default Cart;
