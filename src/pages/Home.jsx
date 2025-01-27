import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Ensure correct import
import { selectUser } from "../Redux/Features/auth/userSlice";


const Home = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center">
        {user && (
          <>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Welcome to eKart
            </h1>
            <p className="text-lg text-gray-700">
              Your one-stop solution for all your shopping needs!!
            </p>
            <h2 className="text-red-700  text-2xl p-2 c">
              🛍️ Please login for shopping 🛒
            </h2>
          </>
        )}
        {
          !user && (
            <>
              <h1 className="text-4xl font-bold text-blue-600 mb-4">
                Welcome to eKart
              </h1>
              <p className="text-lg text-gray-700">
                Your one-stop solution for all your shopping needs!!
              </p>
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md inline-block mt-4"
              >
                Login
              </Link>
            </>     
          )
        }
      </div>
    </div>
  );
};

export default Home;
