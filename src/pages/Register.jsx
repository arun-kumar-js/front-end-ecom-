import { useSelector, useDispatch } from "react-redux";
import {
  selectName,
  selectEmail,
  selectPassword,
  selectRole,
  setEmail,
  setName,
  setPassword,
  setRole,
} from "../Redux/Features/auth/RegisterSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import authServices from "../service/AuthServices";

const Register = () => {
  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const role = useSelector(selectRole); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await authServices.register({ name, email, password,role});
      if (response.status === 201) {
        toast.success("registerd successfully");
        // clear the form
        dispatch(setName(""));
        dispatch(setEmail(""));
        dispatch(setPassword(""));
        // redirect to login page
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="max-w-xs mx-auto mt-10 bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl mb-4">Register</h2>
      <form className="space-y-3 flex flex-col" onSubmit={handleRegister}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="p-2 border border-gray-300 rounded-md"
          value={name}
          onChange={(e) => dispatch(setName(e.target.value))}
        />
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
        <select
          name="role"
          className="p-2 border border-gray-300 rounded-md"
          onChange={(e) => dispatch(setRole(e.target.value))}
        >
          <option value="">Select Role</option>
          <option value="seller">Seller</option>
          <option value="user">User</option>
          onClick={(e) => dispatch(setRole(e.target.value))}

        </select>
        <button className="bg-blue-500 text-white p-2 rounded-md">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
