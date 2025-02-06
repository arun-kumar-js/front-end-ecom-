import { toast } from "react-toastify";
import {
  selectEmail,
  selectPassword,
  setPassword,
  setEmail,
} from "../Redux/Features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import instance from "../service/instance";
import { useNavigate } from "react-router-dom";
const login = () => {
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post("/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Logged in successfully");
        localStorage.setItem("token",response.data.token)
        // clear the form
        dispatch(setEmail(""));
        dispatch(setPassword(""));

        navigate("/");
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-xs mx-auto mt-10 bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl mb-4">Login</h2>
      <form className="space-y-3 flex flex-col" onSubmit={handleLogin}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 border border-gray-300 rounded-md"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
        />
        <button className="bg-blue-500 text-white p-2  rounded-md">
          Login
        </button>
      </form>
      <button className="bg-blue-500 text-white p-2 px-20 mt-5 rounded-md">
        <a href="/forgotPassword">ForgotPassword</a>
      </button>
    </div>
  );
};

export default login;
