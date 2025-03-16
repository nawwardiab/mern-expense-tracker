import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaPlus, FaEnvelope, FaDollarSign, FaCheckCircle } from "react-icons/fa";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    location: "",
    currency: "",
    profilePicture: "",
  });

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    const storedEmail = localStorage.getItem("email");
    if (storedFullName || storedEmail) {
      setFormData((prev) => ({
        ...prev,
        fullName: storedFullName || "",
        email: storedEmail || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    navigate("/homepage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Onboarding Data:", formData);
    navigate("/homepage");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-contain bg-center bg-no-repeat p-6"
      style={{ backgroundImage: "url('/onboarding.png')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center relative">
        {/* Navigation Buttons */}
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 text-gray-600 hover:text-black flex items-center">
          <FaArrowLeft className="mr-2" /> Home
        </button>
        <button onClick={handleSkip} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          Skip Setup
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-8 h-2 rounded-full ${step >= num ? "bg-black" : "bg-gray-300"}`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Step {step} of 4</h2>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
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

          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold">Profile Details</h3>
              {/* Profile Picture Upload */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={formData.profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                />
                <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
                  <FaPlus />
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={handleProfilePicture} />
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

          {step === 3 && (
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
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="text-lg font-semibold">Review & Complete</h3>
              <p className="text-gray-600">Make sure everything looks good before continuing.</p>
              <ul className="text-left text-gray-800 mt-4">
                <li><FaCheckCircle className="text-green-500 inline-block mr-2" /> Name: {formData.fullName}</li>
                <li><FaCheckCircle className="text-green-500 inline-block mr-2" /> Email: {formData.email}</li>
                <li><FaCheckCircle className="text-green-500 inline-block mr-2" /> Username: {formData.username}</li>
                <li><FaCheckCircle className="text-green-500 inline-block mr-2" /> Location: {formData.location}</li>
                <li><FaCheckCircle className="text-green-500 inline-block mr-2" /> Currency: {formData.currency}</li>
              </ul>
            </>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-6 py-3 border rounded-md hover:bg-gray-200 transition">
                Back
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={handleNext} className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition">
                Continue
              </button>
            ) : (
              <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                Finish Setup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
