import { FaCheckCircle } from "react-icons/fa";

function OnboardingStep4({ formData }) {
  return (
    <>
      <h3 className="text-lg font-semibold">Review &amp; Complete</h3>
      <ul className="text-left text-gray-800 mt-4 border p-4 rounded-md bg-gray-100">
        {Object.entries(formData).map(([key, value]) => (
          <li key={key} className="mb-2">
            <FaCheckCircle className="text-green-500 inline-block mr-2" />
            <strong className="capitalize">{key}:</strong> {value || "Not set"}
          </li>
        ))}
      </ul>
    </>
  );
}

export default OnboardingStep4;
