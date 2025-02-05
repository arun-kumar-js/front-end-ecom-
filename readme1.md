const handlePaymentSubmit = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/auth/createrazorpayorder",
      {
        amount: totalPrice * 100, // Razorpay needs the amount in paisa
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

          // Empty cart in frontend
          setCartItems([]);

          // Remove cart items from backend
          await instance.delete(`/clearcart`, { data: { userId } });

          setShowModal(false);
          setName("");
          setAddress("");
          setPhoneNumber("");
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed! Please try again.");
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
      toast.error("Payment failed! Please refresh and try again.");
    }
  } catch (error) {
    console.error("Payment initiation failed:", error);
    toast.error("Payment failed! Please try again.");
  }
};