import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaDollarSign,
  FaCheckCircle,
  FaCamera,
  FaMoneyBillWave,
} from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";

const Onboarding = () => {
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    location: "",
    income: "",
    currency: "",
    profilePicture: "",
  });

  const steps = Number(searchParams.get("step")) || 1; // Get step from URL

  useEffect(() => {
    if (!searchParams.get("step")) {
      setSearchParams({ step: 1 }); // Ensures step is always defined in URL
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Authentication failed:", response.statusText);
          return;
        }

        const data = await response.json();

        const userData = data.user || data.data || {};

        setFormData((prev) => ({
          ...prev,
          fullName: userData.fullName || "",
          email: userData.email || "",
          username: userData.username || "",
          location: userData.location || "",
          income: userData.income || "",
          currency: userData.currency || "",
          profilePicture: userData.profilePicture || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (formData.isOnboarded) {
      navigate("/homepage");
    }
  }, [formData.isOnboarded, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("profilePicture", file);

    try {
      const response = await fetch("http://localhost:8000/users/profile", {
        method: "PATCH",
        body: imageData,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, profilePicture: data.filePath }));
      } else {
        console.error("Profile picture upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleNext = () => {
    const nextStep = Math.min(steps + 1, 4);
    setSearchParams({ step: nextStep }); // Update step in URL
  };

  const handleBack = () => {
    const prevStep = Math.max(steps - 1, 1);
    setSearchParams({ step: prevStep });
  };

  // Submitteing the onboardin form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      fullName: formData.fullName || "",
      email: formData.email || "",
      username: formData.username || "",
      location: formData.location || "",
      income: formData.income || "",
      currency: formData.currency || "",
      profilePicture: formData.profilePicture || "",
      isOnboarded: true,
    };

    try {
      const response = await fetch("http://localhost:8000/users/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("Onboarding request failed:", data);
        return;
      }

      await checkAuth();

      navigate("/homepage");
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  // Handle Skip Button
  const handleSkip = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isOnboarded: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Skipping onboarding failed:", data);
        return;
      }

      await checkAuth();
      navigate("/homepage");
    } catch (error) {
      console.error("Skipping error:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-contain bg-center bg-no-repeat p-6"
      style={{ backgroundImage: "url('/onboarding.png')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-600 hover:text-black flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Home
        </button>

        {/* Skip Button*/}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-600 hover:text-black font-bold"
        >
          Skip
        </button>

        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-8 h-2 rounded-full ${
                steps >= num ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-6">Step {steps} of 4</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {steps === 1 && (
            <>
              <h3 className="text-lg font-semibold">Basic Info</h3>
              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </>
          )}

          {steps === 2 && (
            <>
              <h3 className="text-lg font-semibold">
                Profile Picture & Username
              </h3>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={formData.profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer"
                >
                  <FaCamera />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleProfilePicture}
                />
              </div>
              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Create a username"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </>
          )}

          {steps === 3 && (
            <>
              <h3 className="text-lg font-semibold">Preferences</h3>
              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaMapMarkerAlt className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Select your location"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaDollarSign className="text-gray-500 mr-3" />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Select your currency</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>xs

              <div className="flex items-center border p-3 rounded-md bg-gray-100">
                <FaMoneyBillWave className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="Insert your income"
                  className="w-full bg-transparent outline-none"
                />
                </div>
            </>
          )}

          {steps === 4 && (
            <>
              <h3 className="text-lg font-semibold">Review & Complete</h3>
              <ul className="text-left text-gray-800 mt-4 border p-4 rounded-md bg-gray-100">
                {Object.entries(formData).map(([key, value]) => (
                  <li key={key} className="mb-2">
                    <FaCheckCircle className="text-green-500 inline-block mr-2" />
                    <strong className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </strong>{" "}
                    {value || "Not set"}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="flex justify-between mt-6">
            {steps > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border rounded-md"
              >
                Back
              </button>
            )}
            {steps < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-black text-white rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-md"
              >
                Finish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
