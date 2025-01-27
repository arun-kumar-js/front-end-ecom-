import { useEffect } from "react";
import { toast } from "react-toastify";
import authServices from "../service/AuthServices";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearUser } from "../Redux/Features/auth/userSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      const response = await authServices.logout();

      if (response.status === 200) {
        toast.success(response.data?.message || "Logged out successfully");

        // Clear the user from Redux
        dispatch(clearUser());

        // Redirect to home page
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    logoutUser();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return <div>Logging Out...Please Wait...</div>;
};

export default Logout;
