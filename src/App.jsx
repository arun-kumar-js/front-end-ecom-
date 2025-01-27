import Layout from "./wrapers/Layout";
import { Outlet, useLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, clearUser } from "./Redux/Features/auth/userSlice"; // Adjust the import path based on your project structure

const App = () => {
  const user = useLoaderData(); // Call the function to get the loader data
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }
  }, [user, dispatch]); // Add dispatch to the dependency array

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
