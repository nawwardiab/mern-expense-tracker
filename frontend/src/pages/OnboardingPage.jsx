import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserProfile from "../hooks/useUserProfile";
import OnboardingStep1 from "./OnboardingSteps/Step1";
import OnboardingStep2 from "./OnboardingSteps/Step2";
import OnboardingStep3 from "./OnboardingSteps/Step3";
import OnboardingStep4 from "./OnboardingSteps/Step4";
const Onboarding = () => {
  const navigate = useNavigate();
  // 1) Load the user's profile once here
  const { profile, loading, error } = useUserProfile();
  // 2) Local state for multi-step form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    location: "",
    income: "",
    currency: "",
    profilePicture: "",
    isOnboarded: false,
  });
  // 3) When `profile` is loaded, populate our form data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        email: profile.email || "",
        username: profile.username || "",
        location: profile.location || "",
        income: profile.income || "",
        currency: profile.currency || "",
        profilePicture: profile.profilePicture || "",
        isOnboarded: profile.isOnboarded || false,
      }));
    }
  }, [profile]);
  // 4) If user is already onboarded, skip
  useEffect(() => {
    if (formData.isOnboarded) {
      navigate("/homepage");
    }
  }, [formData.isOnboarded, navigate]);
  // 5) Optionally handle loading/error states
  if (loading) {
    return <div className="p-8 text-center">Loading your profile...</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading user data: {error.message}
      </div>
    );
  }
  // 6) Single change handler for multi-step form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 7) Handle profile picture upload (if you want it separate)
  const handleProfilePictureChange = async (file) => {
    if (!file) return;
    try {
      const imageData = new FormData();
      imageData.append("profilePicture", file);
      const response = await axios.patch("/users/profile", imageData);
      if (response.status === 200) {
        // Suppose the server returns { profilePicture: "/uploads/..." }
        const updatedPicturePath =
          response.data.profilePicture || response.data.filePath;
        setFormData((prev) => ({
          ...prev,
          profilePicture: updatedPicturePath,
        }));
      } else {
        console.error("Profile picture upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  // 8) Step navigation
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  // 9) Final submit (Finish button)
  const handleSubmit = async () => {
    const updatedData = { ...formData, isOnboarded: true };
    try {
      await axios.patch("/users/onboarding", updatedData);
      navigate("/homepage");
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  };
  // 10) Render the UI with step indicators, skip/home buttons, etc.
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
          Home
        </button>
        <button
          onClick={() => navigate("/homepage")}
          className="absolute top-4 right-4 text-gray-600 hover:text-black font-bold"
        >
          Skip
        </button>
        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-8 h-2 rounded-full ${step >= num ? "bg-black" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-6">Step {step} of 4</h2>
        {step === 1 && (
          <OnboardingStep1 formData={formData} handleChange={handleChange} />
        )}
        {step === 2 && (
          <OnboardingStep2
            formData={formData}
            handleChange={handleChange}
            onProfilePicChange={handleProfilePictureChange}
          />
        )}
        {step === 3 && (
          <OnboardingStep3 formData={formData} handleChange={handleChange} />
        )}
        {step === 4 && <OnboardingStep4 formData={formData} />}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border rounded-md"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-black text-white rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-md"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Onboarding;