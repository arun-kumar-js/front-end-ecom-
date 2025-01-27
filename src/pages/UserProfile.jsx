import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../Redux/Features/auth/userSlice";

const Profile = () => {
  const navigate = useNavigate();
  const userState = useSelector(selectUser);
  const user = userState?.user; // Safely access user

  // Redirect to login if user is not available
  useEffect(() => {
    if (!user) {
      navigate("/Home", { replace: true });
    }
  }, [user, navigate]); // Runs when `user` or `navigate` changes

  // If user is not defined, return null while navigating
  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold mt-10">
        Welcome to Your Profile
      </h1>
      <div className="flex justify-center mt-10">
        <div className="w-1/3">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">User Details</h2>
            <p className="mt-2">Name: {user.user.name}</p>
            <p className="mt-2">Email: {user.user.email}</p>
            <p className="mt-2">Role: {user.user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
