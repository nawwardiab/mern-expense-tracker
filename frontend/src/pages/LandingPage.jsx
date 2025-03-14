import { useNavigate } from "react-router-dom";
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
   

      {/* Hero Section */}
      <header className="bg-gray-100 py-38 text-center">
        <h1 className="text-4xl font-bold">TRACK$</h1>
        <p className="text-xl text-gray-600 mt-2">Managing Expenses Like a Pro</p>
        <div className="mt-70 space-x-20">
          <button onClick={handleGoToSignUp} className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
            Sign Up
          </button>
          <button onClick={handleGoToLogin} className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
            Log In
          </button>
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
      <Footer />
    </div>
  );
};

export default LandingPage;

