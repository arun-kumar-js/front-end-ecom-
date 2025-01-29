import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Ensure correct import
import { selectUser } from "../Redux/Features/auth/userSlice";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
    //console.log(user.user.role)

  return (
    <div className="min-h-screen flex flex-col">
     
      <nav className="bg-orange-300 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-indigo-500">Eekart</h1>
            <Link to="/" className="text-lg font-bold hover:underline text-red-500">
              Home
            </Link>
          </div>

          {/* Middle Section: Dynamic Links */}
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="hover:underline bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition duration-200"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="hover:underline bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-300 transition duration-200"
                >
                  Login
                </Link>
              </>
            )}
            {user && user.user.role === "user" && (
              <>
                <Link
                  to="/cart"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  🛒 Cart
                </Link>
                <Link
                  to="/order"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  Your Orders
                </Link>
                <Link
                  to="/profile"
                  className="hover:underline  bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  ☃︎{user.user.name}
                </Link>
              </>
            )}
            {user && user.user.role === "seller" && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/seller/addProduct"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  Upload Product
                </Link>
                <Link
                  to="/products"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400transition duration-200"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="hover:underline bg-stone-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition duration-200"
                >
                  {user.user.name}
                </Link>
              </>
            )}
          </div>

          {/* Right Section: Logout Button */}
          <div>
            {user && (
              <button
                className="bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition duration-200"
                onClick={() => navigate("/logout", { replace: true })}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
