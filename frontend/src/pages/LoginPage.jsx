import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";

const Login = () => {
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
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
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

            <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition">
              <FaEnvelope className="mr-2 text-blue-500" /> Sign up with a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;