import React, { useEffect, useState } from "react";
import instance from "../service/instance";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";

const Cart = () => {
  const { user } = useSelector(selectUser);
  const userId = user?.user?._id; // Ensure userId is retrieved safely

  const [cartItems, setCartItems] = useState([]); // Default to an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return; // Avoid running fetch if userId is missing

      try {
        const response = await instance.get(`/getcart?userId=${userId}`);
        console.log("Fetched Cart Data:", response.data); // Log API response

        // ✅ Extract products array from response
        const products = response.data?.cart?.products || [];
        setCartItems(products);
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart items.");
      }
    };

    fetchCart();
  }, [userId]);

  // ✅ Log cartItems only when it updates
  useEffect(() => {
    console.log("Updated Cart Items:", cartItems);
  }, [cartItems]);

  if (error) {
    return <div>Error fetching cart data</div>;
  }

  if (cartItems.length === 0) {
    return <div>No items in cart</div>;
  }

  
   return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Your Cart</h2>

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
              <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1 truncate">{item.description}</p>
              <h4 className="text-xl font-semibold text-blue-600 mt-2">₹{item.price}</h4>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Buy Now
                </button>
                <button className="text-red-500 hover:text-red-700 transition">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Cart;
