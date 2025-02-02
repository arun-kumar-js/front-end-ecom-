import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import instance from "../service/instance";
import { toast } from "react-toastify";
import ReactStars from "react-stars";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the route
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await instance.get(`/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (rating === 0 || review.trim() === "") {
      toast.error("Please provide a rating and review.");
      return;
    }

    try {
      await instance.post("/product/review", {
        productId: id,
        rating,
        review,
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="container mx-auto">
        {loading && <p className="text-center text-lg">Loading product...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {product && (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-auto h-64 object-cover mx-auto pt-5"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                {product.name}
              </h1>
              <p className="text-gray-700 text-lg mt-4 text-center">
                Rs: {product.price}
              </p>
              <p className="text-gray-600 mt-2 text-center">
                {product.description}
              </p>
            </div>

            {/* Review & Rating Section */}
            {user && product.seller !== user.user._id && (
              <div className="p-6 border-t">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Leave a Review
                </h2>
                <div className="flex flex-col items-center mt-4">
                  <ReactStars
                    count={5}
                    value={rating}
                    size={30}
                    color2={"#ffd700"}
                    onChange={(newRating) => setRating(newRating)}
                  />
                  <textarea
                    className="mt-4 p-2 border rounded w-full"
                    rows="3"
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleReviewSubmit}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            <div className="p-6 border-t text-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
