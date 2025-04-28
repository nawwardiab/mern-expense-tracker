import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";
import { FaMoneyBillWave, FaChartPie, FaClipboardList } from "react-icons/fa";

// import LandingPageNavbar from "../components/LandingPageNavbar";

const LandingPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleGoToLogin = () => navigate("/login");
  const handleGoToSignUp = () => navigate("/signup");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden m-0 p-0">
      {/* Navbar */}
      {/* <LandingPageNavbar /> */}
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center text-center h-screen w-full overflow-hidden m-0 p-0">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover m-0 p-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videohero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 bg-black opacity-60">
          <img
            src="/Logo_w.png"
            alt="Track$ Logo"
            className="w-60 h-auto mb-4 drop-shadow-lg"
          />
          <p className="text-2xl text-gray-200 font-light mb-8">
            Managing Expenses Like a Pro
          </p>
          <div className="flex space-x-10 absolute bottom-20">
            <button
              onClick={handleGoToSignUp}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-400 transition duration-300 cursor-pointer"
            >
              Sign Up
            </button>
            <button
              onClick={handleGoToLogin}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-400 transition duration-300 cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-900 tracking-wide">
          Our Core Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12">
          {[
            {
              title: "Expense Tracking",
              description:
                "Gain full control over your spending with real-time insights and smart categorization.",
              icon: (
                <FaMoneyBillWave className="text-6xl text-green-500 mb-6 mx-auto" />
              ), // Centered Icon
              bgColor: "bg-green-50",
            },
            {
              title: "Budget Planning",
              description:
                "Set clear financial goals, monitor your cash flow, and optimize your monthly budget.",
              icon: (
                <FaChartPie className="text-6xl text-indigo-600 mb-6 mx-auto" />
              ), // Centered Icon
              bgColor: "bg-indigo-50",
            },
            {
              title: "Reports & Insights",
              description:
                "Make informed financial decisions with AI-powered analytics and visual reports.",
              icon: (
                <FaClipboardList className="text-6xl text-indigo-600 mb-6 mx-auto" />
              ), // Centered Icon
              bgColor: "bg-purple-50",
            },
          ].map((service, index) => (
            <div
              key={index}
              className={`p-10 ${service.bgColor} border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105`}
            >
              {service.icon}
              <h3 className="text-2xl font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-10 bg-gray-50 text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-900 tracking-wide">
          Pricing Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12">
          {[
            {
              plan: "Free",
              price: "€0",
              color: "text-green-500",
              features: [
                "Basic Expense Tracking",
                "Limited Reports",
                "Community Support",
              ],
              bgColor: "bg-green-50",
            },
            {
              plan: "Pro",
              price: "€50",
              color: "text-indigo-600",
              features: [
                "Advanced Expense Tracking",
                "Budget Planning Tools",
                "Priority Support",
              ],
              bgColor: "bg-indigo-50",
            },
            {
              plan: "Enterprise",
              price: "€1000",
              color: "text-purple-500",
              features: [
                "Custom Financial Insights",
                "Multi-user Access",
                "Dedicated Support",
              ],
              bgColor: "bg-purple-50",
            },
          ].map((pricing, index) => (
            <div
              key={index}
              className={`p-10 ${pricing.bgColor} border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105`}
            >
              <h3 className="text-2xl font-semibold text-gray-900">
                {pricing.plan}
              </h3>
              <p className={`text-4xl font-extrabold ${pricing.color} mt-2`}>
                {pricing.price}
              </p>
              <ul className="mt-6 text-gray-700 space-y-3 leading-relaxed">
                {pricing.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg">✔</span> <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

        {/* State to track form submission */}
        {isSubmitted ? (
          <p className="text-green-600 text-lg font-semibold">
            Thank you! Your message has been sent successfully.
          </p>
        ) : (
          <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-md h-32"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
