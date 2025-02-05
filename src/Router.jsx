
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/cart.jsx"
import authLoader from "./unit/authLoader";
import Logout from "./pages/Logout";
import Profile from "./pages/UserProfile";
import Sellerprofile from "./pages/SellerProfile";
import SellerAddproduct from "./pages/sellerAddproduct"
import ForgotPassword from "./pages/forgotPassword";
import Changepassword from "./pages/changePassword";
import ProductDetails from "./components/ProductDetails";
import Order from "./components/order";
import DashBoard from "./components/DashBoard";
import { createBrowserRouter } from "react-router-dom";  // Keep only this one
//check
const routes = createBrowserRouter(
  {
    path: "/",
    element: <App />,
    loader: authLoader,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "changePassword",
        element: <Changepassword />,
      },
      {
        path: "me",
        element: <Profile />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/profile",
        element: <Sellerprofile />,
      },
      {
        path: "/getallorders",
        element: <Order />,
      },
      {
        path: "/seller/addProduct",
        element: <SellerAddproduct />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
    
    ],
    hydrateFallbackElement: <p>Loading... </p>,
  },
);


  
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    V7_skipActionErrorRevalidation: true,
  },
});


export default router;
