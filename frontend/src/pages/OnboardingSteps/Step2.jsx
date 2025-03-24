import { FaCamera, FaUser } from "react-icons/fa";

function OnboardingStep2({ formData, handleChange, onProfilePicChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onProfilePicChange(file);
  };

  return (
    <>
      <h3 className="text-lg font-semibold">Profile Picture &amp; Username</h3>
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
          onChange={handleFileChange}
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
  );
}

export default OnboardingStep2;
