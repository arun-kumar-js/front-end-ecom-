import React, { useEffect, useState } from "react";
import instance from "../service/instance";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Just passing the userId to the endpoint
        const response = await instance.get(`/getcart?userId=${userId}`);
        console.log("Fetched Cart Data:", response.data); // Log to inspect the response format
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(error);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  if (error) {
    return <div>Error fetching cart data</div>;
  }

  if (cartItems.length === 0) {
    return <div>No items in cart</div>;
  }

  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.product.id}>
          <h1>{item.product.name}</h1>
          <h1>{item.product.price}</h1>
        </div>
      ))}
    </div>
  );
};

export default Cart;
