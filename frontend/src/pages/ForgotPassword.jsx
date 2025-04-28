import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { updatePassword } from "../api/authApi";
import { AuthContext } from "../contexts/AuthContext";
const ForgotPassword = () => {
  const { userDispatch } = useContext(AuthContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await updatePassword(formData.password, formData.confirmPassword, userDispatch);


      navigate("/login");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image Section */}
      <div className="w-1/2 bg-white flex items-center justify-center relative">
        <div className="absolute top-4 left-4 flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-black hover:text-gray-500 transition text-lg flex items-center"
          >
            <FaHome className="mr-1" /> Home
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-black hover:text-gray-500 transition text-lg flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Back
          </button>
        </div>
        <img
          src="/forgotpassword.png"
          alt="Reset Password"
          className="w-full h-full object-contain object-center"
        />
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Reset Password
          </h2>

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

          <form className="space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
