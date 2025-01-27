import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Ensure correct import
import { selectUser } from "../Redux/Features/auth/userSlice";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  // Redirect to login page if user is not logged in
 

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-indigo-500 text-white p-4 flex justify-between">
        <Link to="/" className="mr-4">
          Home
        </Link>
        <div>
          {!user && (
            <Link to="/register" className="mr-4">
              Register
            </Link>
          )}
          {!user && (
            <Link to="/login" className="mr-4">
              Login
            </Link>
          )}
          {user && user.user.role === "user" && (
            <>
              <Link to="/me" className="mr-4">
                Profile : {user.user.name}
              </Link>
              <Link to="/cart" className="mr-4">
                Cart
              </Link>
              <Link to="/candidate/applications" className="mr-4">
                Your Orders
              </Link>
            </>
          )}
          {user && user.user.role === "seller" && (
            <>
              <Link to="/seller/dashboard" className="mr-4">
                Dashboard
              </Link>

              <Link to="/seller/addProduct" className="mr-4">
                Upload Product
              </Link>
              <Link to="/seller/products" className="mr-4">
                Order
              </Link>
              <Link to="/seller/profile" className="mr-4">
                Profile : {user.user.name}
              </Link>
            </>
          )}
        </div>

        <div>
          {user && (
            <button
              className="bg-red-500 px-3 py-1 rounded"
              onClick={() => navigate("/logout", { replace: true })}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
