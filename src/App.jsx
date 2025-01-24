import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Logout from "./components/logout";
import ForgotPassword from "./components/forgetPassword";
import ChangePassword from "./components/changePassword";
import Error from "./components/error";

export const App = () => {
  const routes = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/forgetPassword",
      element: <ForgotPassword />,
    },
    {
      path: "/changePassword",
      element: <ChangePassword />,
    },
    {
      path: "/error",
      element: <Error />,
    },
  ];

  const router = createBrowserRouter(routes, {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
      v7_skipActionStatusRevalidation: true,
      v7_partialHydration: true,
      v7_startTransition: true,
    },
  });

  return <RouterProvider router={router} />;
};

export default App;
