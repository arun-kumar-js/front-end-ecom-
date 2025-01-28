import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../service/instance";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the route
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <p className="text-gray-700 text-lg mt-4 text-center">Rs: {product.price}</p>
              <p className="text-gray-600 mt-2 text-center">{product.description}</p>
            </div>
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
