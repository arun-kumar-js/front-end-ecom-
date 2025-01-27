import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../Features/auth/RegisterSlice";
import loginReducer from "../Features/auth/loginSlice";
import userReducer from "../Features/auth/userSlice"; // Import the user reducer 
import productUploadReducer from "../Features/auth/productUploadSlice"; // Import the product upload reducer 

const store = configureStore({
  reducer: {
    register: registerReducer, // Register reducer for registration
    login: loginReducer, // Login reducer for authentication
    user: userReducer, // User reducer for user-related data
    productUpload: productUploadReducer, // Product upload reducer
  },
});

export default store;
