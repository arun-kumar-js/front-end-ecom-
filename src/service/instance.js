import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://project-be-qvrk.onrender.com/auth"
    : "http://localhost:3000/auth";

const instance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Retrieve token from localStorage
const getToken = () => localStorage.getItem("token");

// Attach JWT token in headers for each request
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
