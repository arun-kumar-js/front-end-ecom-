import React, { useEffect, useState } from "react";
import instance from "../service/instance";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import { toast } from "react-toastify";

const Cart = () => {
  const { user } = useSelector(selectUser);
  const userId = user?.user?._id;

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch cart items
useEffect(() => {
  const fetchCart = async () => {
    if (!userId) return;

    try {
      const response = await instance.get(`/getcart?userId=${userId}`);
      const products = response.data?.cart?.products || [];

      // Ensure all products have valid price and quantity values
      const sanitizedProducts = products.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));

      setCartItems(sanitizedProducts);
    } catch (err) {
      toast.error("Error fetching cart data:", err);
      setError("Failed to load cart items.");
    }
  };

  fetchCart();
}, [userId]);

  // ✅ Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1; // Ensure minimum quantity is 1
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // ✅ Remove item from cart
  const handleRemoveCart = async (productId) => {
    try {
      await instance.delete(`/removecart`, {
        data: { userId, productId },
      });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item.");
    }
  };

  // ✅ Buy now button functionality
  const handleOrder = async () => {
    try {
      if (!userId || cartItems.length === 0) {
        toast.error("No items to order or user not found.");
        return;
      }

      // 🔹 Calculate total price properly (send as number, not string)
      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ); // This is a number, not a string

      const formattedcartItems = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity > 0 ? item.quantity : 1,
      }));
      
      // Send the data to the backend
      const response = await instance.post(`/order`, {
        userId,
        cartItems: formattedcartItems,
        totalPrice, // Send totalPrice as a number
        products: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        })),
      });

      console.log("Order placed:", response.data);
      toast.success("Order placed successfully!");

      // Clear cart data from server
      await instance.delete(`/clearcart`, {
        data: { userId },
      });

      setCartItems([]); // Clear cart after order
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Error placing order. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-6">No items in order</div>
    );
  }
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
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-52 object-cover"
            />

            {/* Product Details */}
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

              {/* Quantity Controls */}
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

              {/* Actions */}
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
        <div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleOrder}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
