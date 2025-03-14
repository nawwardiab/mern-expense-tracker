import { FaGoogle, FaApple, FaEnvelope, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


  
    const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMessage("");

      try {
        const res = await fetch("http://localhost:8000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
        if (res.ok) {
          setSuccessMessage("Login successful!");
            setTimeout(() => navigate("/homepage"), 2000);
        } else {
            setErrorMessage(data.error || "Login failed");
        }
      } catch (error) {
        setErrorMessage("Email and/or password is wrong. Please try again.");
      }
    };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image Section */}
      
      <div className="w-1/2 bg-white flex items-center justify-center">
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

            {/* Error Message */}
            {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
              <span>❌</span> {errorMessage}
            </div>
          )}


            {/* Success Message */}
            {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
              <span>✅</span> {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                <div className="text-left mt-1">
                <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
                  Forgot your password?
                </a>
              </div>
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

            <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate("/signup")}>
              <FaEnvelope className="mr-2 text-blue-500" /> Sign up with a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;