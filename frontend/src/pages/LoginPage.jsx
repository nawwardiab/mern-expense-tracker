import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access login function

  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password); // Call authentication function
      setLoading(false);
      navigate("/homepage"); // Redirect after successful login
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image Section */}
      <div className="w-1/2 bg-white flex items-center justify-center">
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

          {/* Show error message */}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
             
            >
              Continue
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
              <FaEnvelope className="mr-2 text-blue-500" /> Sign up with a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
