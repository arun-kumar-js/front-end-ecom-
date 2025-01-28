import { useNavigate } from "react-router-dom";
import { useState } from "react";
import instance from "../service/instance";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Separate error message state
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email entered:", email); // Debug log
    setMessage("");
    setErrorMessage("");

    try {
      const response = await instance.post("/reset", { email });
      console.log("API Response:", response.data); // Debug log
      setMessage("Code sent successfully");
      setTimeout(() => {
        navigate("/changePassword");
      }, 9000);
    } catch (error) {
      console.error("API Error:", error.response || error.message); // Debug log
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#011627] w-full min-h-screen flex justify-center items-center">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Get Code
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-500 text-center">{message}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="text-center text-white mt-4">
          <button
            className="text-blue-700 font-bold"
            onClick={handleNavigateLogin}
          >
            Remember Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
