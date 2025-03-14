import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const LandingPage = () => {
    const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  }

  const handleGoToSignUp = () => {
    navigate("/signup");
  }

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />

      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center text-center h-screen overflow-hidden">
  {/* Background Video */}
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/videohero.mp4" type="video/mp4" />
  </video>

  {/* Dark Overlay for Text Visibility */}
  <div className="absolute inset-0 flex flex-col justify-center items-center px-6 bg-black opacity-60">
    {/* Title - Slightly Higher for Balance */}
    <h1 className="text-6xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
      TRACK$
    </h1>
    <p className="text-2xl text-gray-200 font-light mb-8">
      Managing Expenses Like a Pro
    </p>

    {/* Buttons - Positioned Near Bottom */}
    <div className="absolute bottom-20 flex space-x-20">
      <button
        onClick={handleGoToSignUp}
        className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
      >
        Sign Up
      </button>
      <button
        onClick={handleGoToLogin}
        className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
      >
        Log In
      </button>
    </div>
  </div>
</header>




      {/* Services Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Expense Tracking</h3>
            <p className="text-gray-600 mt-2">Track your daily expenses with ease.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Budget Planning</h3>
            <p className="text-gray-600 mt-2">Set financial goals and stay on track.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Reports & Insights</h3>
            <p className="text-gray-600 mt-2">Generate detailed spending reports.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-green-500 text-2xl font-bold">€0</p>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ Basic Expense Tracking</li>
              <li>✔ Limited Reports</li>
              <li>✔ Community Support</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-blue-500 text-2xl font-bold">€50</p>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ Advanced Expense Tracking</li>
              <li>✔ Budget Planning Tools</li>
              <li>✔ Priority Support</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <p className="text-purple-500 text-2xl font-bold">€1000</p>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ Custom Financial Insights</li>
              <li>✔ Multi-user Access</li>
              <li>✔ Dedicated Support</li>
            </ul>
          </div>

        </div>
      </section>


      {/* Contact Form */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <form className="max-w-lg mx-auto space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-md" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-md" />
          <textarea placeholder="Your Message" className="w-full p-3 border border-gray-300 rounded-md h-32"></textarea>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
            Send Message
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;

