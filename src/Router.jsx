import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import authLoader from "./unit/authLoader";
import Logout from "./pages/Logout";
import Profile from "./pages/UserProfile";
import Sellerprofile from "./pages/SellerProfile";
import SellerAddproduct from  "./pages/sellerAddproduct"
const routes = [
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
        path: "me",
        element: <Profile />,
      },
      {
        path: "cart",
        element: <div>cart</div>,
      },
      {
        path: "seller/profile",
        element: <Sellerprofile />,
      },
      {
        path: "seller/addproduct",
        element: <SellerAddproduct/>,
      },
    ],
    hydrateFallbackElement: <p>Loading... </p>,
  },
];


  
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
