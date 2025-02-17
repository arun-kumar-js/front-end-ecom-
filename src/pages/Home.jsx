import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import { Link, useNavigate } from "react-router-dom";
import instance from "../service/instance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactStars from "react-stars";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust this based on your preference

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await instance.get(
          `/getproduct?page=${currentPage}&limit=${itemsPerPage}`,
          {
            withCredentials: true,
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); // Fetch data when `currentPage` changes

  const handleCart = async (id) => {
    try {
      await instance.post(
        "/addcart",
        { productId: id },
        { withCredentials: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 relative">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          {user ? (
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Welcome : {user.user.name}
            </h1>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-blue-600 mb-4">
                Welcome to eKart
              </h1>
              <p className="text-lg text-gray-700">
                Your one-stop solution for all your shopping needs!
              </p>
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md inline-block mt-4"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Products Section */}
        <div className="mt-8">
          {loading && (
            <p className="text-lg text-gray-700 text-center">Loading data...</p>
          )}
          {error && <p className="text-lg text-red-500 text-center">{error}</p>}
          {data && !loading && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-3xl mx-auto pt-4 rounded-lg align-middle h-64"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-700 mt-2">Rs: {product.price}</p>
                      <p className="text-gray-500 mt-2 text-sm">
                        {product.description}
                      </p>

                      {/* Display Star Rating */}
                      {product.rating !== undefined ? (
                        <div className="mt-2 flex flex-col items-center">
                          <ReactStars
                            count={5}
                            value={product.rating}
                            size={24}
                            edit={false} // Prevents user from changing the rating
                            color2={"#ffd700"}
                          />
                          <p className="text-gray-500 text-sm">
                            ({product.rating.toFixed(1)} / 5)
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No rating yet</p>
                      )}
                    </div>

                    {/* Buttons Section */}
                    <div className="p-2 border-t flex justify-evenly">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="w-auto bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        View Details
                      </button>

                      {/* Hide "Add to Cart" for the seller */}
                      {user && product.seller !== user.user._id && (
                        <button
                          onClick={() => handleCart(product._id)}
                          className="w-auto bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition duration-200 text-center"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-white rounded-md ${
                    currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-lg font-medium">Page {currentPage}</span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
