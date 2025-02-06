import axios from "axios";

// Assuming JWT token is stored in localStorage (you can modify this as per your setup)
const token = localStorage.getItem("jwtToken");  // Modify this based on where you store your JWT token

const baseURL = [
  "http://localhost:3000/auth",
  "https://project-be-lkrg.onrender.com/",
];

const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor to add JWT token to each request if available
instance.interceptors.request.use(
  (config) => {
    if (token) {
      // Add the token to the Authorization header if token exists
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;