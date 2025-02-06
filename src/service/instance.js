import axios from "axios";
import e from "cors";
const baseURL = "http://localhost:3000/auth";
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
