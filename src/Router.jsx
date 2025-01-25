import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },  
    
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
    
      },
    ],
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
