import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

function OnboardingStep4({ isOnboarded }) {
  return (
    <div className="text-center p-6 bg-gray-100 border border-gray-300 rounded-lg mt-6">
      {isOnboarded ? (
        <>
          <h3 className="text-xl font-semibold text-green-600 flex items-center justify-center gap-2">
            <FaInfoCircle /> All Set!
          </h3>
          <p className="mt-2 text-gray-700">You're ready to start using the app 🎉</p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-indigo-600 flex items-center justify-center gap-2">
            <FaInfoCircle /> Almost There!
          </h3>
          <p className="mt-2 text-gray-700">
            You’ve completed the basics. You can finish setting up your profile anytime from{" "}
            <Link to="/settings" className="text-indigo-600 underline hover:text-purple-900">
              Settings
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

export default OnboardingStep4;
