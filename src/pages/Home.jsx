import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Ensure correct import
import { selectUser } from "../Redux/Features/auth/userSlice";
import instance from "../service/instance"; // Make sure instance is properly set up
import { useEffect, useState } from "react";

const Home = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  // State to hold fetched data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.products.get(); // Make sure API request is correct
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products."); // Set error message
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Render user info if available */}
        {user ? (
          <>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Welcome back, {user.name}
            </h1>
            <Link
              to="/me"
              className="bg-blue-500 text-white px-4 py-2 rounded-md inline-block mt-4"
            >
              View Profile
            </Link>
          </>
        ) : (
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
        )}

        {/* Data display */}
        <div className="mt-8">
          {loading && <p className="text-lg text-gray-700">Loading data...</p>}
          {error && <p className="text-lg text-red-500">{error}</p>}
          {data && !loading && (
            <div className="bg-white p-4 rounded-md shadow-md">
              <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;