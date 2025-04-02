import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { FaGoogle, FaApple, FaEnvelope, FaHome } from "react-icons/fa";

const Login = () => {
  const { userDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(
        formData.email,
        formData.password,
        userDispatch
      );

      if (loggedInUser?.isOnboarded) {
        navigate("/homepage");
      } else {
        navigate("/onboarding");
      }

      setSuccessMessage("Login successful!");
    } catch (err) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image Section */}
      <div className="w-1/2 bg-white flex items-center justify-center relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-black hover:text-gray-500 transition text-lg flex items-center"
        >
          <FaHome className="mr-2" /> Home
        </button>
        <img
          src="/login.png"
          alt="Login"
          className="w-full h-full object-contain object-center"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
              <span>❌</span> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
              <span>✅</span> {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-left mt-1">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition">
              <FaGoogle className="mr-2 text-red-500" /> Sign in with Google
            </button>

            <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition">
              <FaApple className="mr-2 text-black" /> Sign in with Apple
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition"
            >
              <FaEnvelope className="mr-2 text-blue-500" /> Sign up with a
              different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
