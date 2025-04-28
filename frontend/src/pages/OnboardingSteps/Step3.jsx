import { FaMapMarkerAlt, FaDollarSign, FaMoneyBillWave } from "react-icons/fa";

function OnboardingStep3({ formData, handleChange }) {
  return (
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
  );
}

export default OnboardingStep3;
