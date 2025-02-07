import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/Features/auth/userSlice";
import instance from "../service/instance";
import { toast } from "react-toastify";
import ReactStarRatings from "react-star-ratings"; // Import the star rating component

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the route
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // Add state for rating

  // Fetch product details
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
      console
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (review.trim() === "") {
      toast.error("Please provide a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await instance.post(
        "/product/review",
        {
          productId: id,
          review,
          rating, // Send rating along with the review
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Review submitted successfully!");
      setReview("");
      setRating(0); // Reset the rating after submission
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Product not found.");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in to submit a review.");
      } else {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  //get review from dataabse
const [reviews, setReviews] = useState([]);
//const [error, setError] = useState(null); // Add error state

useEffect(() => {
  const fetchReviews = async () => {
    try {
      const response = await instance.get(`/product/reviews/${id}`); // Must match backend route
      setReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews.");
    }
  };

  fetchReviews();
}, [id]);
  console.log(reviews);


  

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
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Reviews
              </h2>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="mt-4 p-4 border rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl font-semibold pr-4"> 
                        {review.userId?.name || "Anonymous"} {/* User's name */}
                      </span>
                      <ReactStarRatings
                        rating={review.rating || 0} // Display star rating
                        starRatedColor="green"
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="3px"
                      />
                    </div>
                    <p className="mt-2 text-gray-600">{review.review}</p>{" "}
                    {/* Review text */}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No reviews yet.</p>
              )}
            </div>

            {/* Review Section */}
            {user && product.seller !== user.user._id && (
              <div className="p-6 border-t">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Leave a Review
                </h2>
                <div className="flex flex-col items-center mt-4">
                  <div className="flex mb-4">
                    {/* Star Rating */}
                    <ReactStarRatings
                      rating={rating} // Set the current rating
                      starRatedColor="yellow" // Set the color of the rated stars
                      changeRating={(newRating) => setRating(newRating)} // Update rating state when clicked
                      numberOfStars={5} // Number of stars
                      name="rating" // Name for the input (optional)
                      starDimension="30px" // Set the size of the stars
                      starSpacing="5px" // Spacing between stars
                    />
                  </div>
                  <textarea
                    className="mt-4 p-2 border rounded w-full"
                    rows="3"
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleReviewSubmit}
                    className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
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