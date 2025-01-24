import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://passwordreset-be-p575.onrender.com",
        formData
      );
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/Dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const navigateToForgotPage = () => navigate("/forgetPassword");
  const navigateToRegister = () => navigate("/register");

  return (
    <div className="bg-[#011627] w-full min-h-screen flex justify-center items-center">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        <div className="text-center text-white mt-4 flex justify-around">
          <button
            onClick={navigateToForgotPage}
            className="text-blue-700 font-bold"
          >
            Forgot Password
          </button>
          <button
            onClick={navigateToRegister}
            className="text-blue-700 font-bold"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
