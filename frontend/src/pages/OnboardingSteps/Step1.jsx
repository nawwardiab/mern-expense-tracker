import { FaUser, FaEnvelope } from "react-icons/fa";

function OnboardingStep1({ formData, handleChange }) {
  return (
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
  );
}

export default OnboardingStep1;
