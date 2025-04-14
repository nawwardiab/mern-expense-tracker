import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import {
  updateProfile,
  updatePassword,
  updateNotificationSettings,
} from "../api/authApi";

import NotificationToggle from "../components/NotificationToggle";

const SettingPage = () => {
  const { userState, userDispatch, notificationState, notificationDispatch } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    location: "",
   
    income: "",
    paymentMethod: "",
    username: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
const [isOnboarded, setIsOnboarded] = useState(userState.isOnboarded);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("https://picsum.photos/100");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Function to format labels (convert camelCase to readable format)
  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  // Clear message on component mount
  useEffect(() => {
    userDispatch({ type: "CLEAR_MESSAGE" });
  }, [userDispatch]);
  useEffect(() => {
    if (userState.user) {
      const user = userState.user;
      setFormData({
        fullname: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        location: user.location || "",
      
        income: user.income || "",
        paymentMethod: user.paymentMethod || "",

      });

      if (user.profilePicture) {
        setPreview(user.profilePicture);
      }
    }
  }, [userState.user]);

  // 🔄 Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📸 Handle image upload & preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //  Save profile updates
  const handleSaveProfile = async () => {
    userDispatch({ type: "UPDATE_PROFILE_REQUEST" });

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    form.append("isOnboarded", isOnboarded);
    if (profilePicture) {
      form.append("profilePic", profilePicture);
    }

    try {
      const updatedUser = await updateProfile(form, userDispatch);
      userDispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: updatedUser });

      if (updatedUser.profilePicture) {
        setPreview(updatedUser.profilePicture);
      }

      setTimeout(() => userDispatch({ type: "CLEAR_MESSAGE" }), 3000);
    } catch (error) {
      userDispatch({ type: "ERROR", payload: "Profile update failed." });
      setTimeout(() => userDispatch({ type: "CLEAR_MESSAGE" }), 3000);
    }
  };

  // 🔑 Handle password update
  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      userDispatch({ type: "ERROR", payload: "Passwords do not match." });
      return;
    }

    userDispatch({ type: "UPDATE_PASSWORD_REQUEST" });

    try {
      const successMessage = await updatePassword(
        passwords.currentPassword,
        passwords.newPassword,
        userDispatch
      );
      userDispatch({
        type: "UPDATE_PASSWORD_SUCCESS",
        payload: successMessage,
      });

      setTimeout(() => userDispatch({ type: "CLEAR_MESSAGE" }), 3000);
    } catch (error) {
      userDispatch({ type: "ERROR", payload: "Password update failed." });
      setTimeout(() => userDispatch({ type: "CLEAR_MESSAGE" }), 3000);
    }
  };
  const handleToggleOnboarding = () => {
    const newStatus = !isOnboarded;
    setIsOnboarded(newStatus);

    // ✅ Dispatch onboarding status update
    userDispatch({
      type: "UPDATE_ONBOARDING_STATUS",
      payload: newStatus,
    });

    // Show success message
    setMessage({ type: "success", text: `Onboarding status updated to ${newStatus ? 'Completed' : 'Incomplete'}` });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // 🔔 Handle notification toggle
  const handleToggle = async (type) => {
    const updatedSettings = {
      ...notificationState.notificationSettings,
      [type]: !notificationState.notificationSettings[type],
    };

    try {
      const updatedNotifications = await updateNotificationSettings(
        updatedSettings,
        notificationDispatch
      );
      notificationDispatch({
        type: "UPDATE_NOTIFICATIONS_SUCCESS",
        payload: updatedNotifications,
      });
      setMessage({ type: "success", text: "Notification settings updated!" });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (error) {
      setMessage({ type: "error", text: "Failed to update notifications." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };
  return (
    <div className=" min-h-screen flex flex-col items-center p-4 md:p-6 ">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-3xl flex flex-col gap-6">

        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="relative w-24 h-24">
            <img
              src={
                preview ||
                userState.user?.profilePicture ||
                "https://picsum.photos/100"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-300"
              onError={() => setPreview("https://picsum.photos/100")}
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer"
            >
              <FaCamera className="text-white text-sm" />
            </label>
            <input
              id="profilePic"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={userState.loading}
            className={`bg-black text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all ${userState.loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {userState.loading ? "Saving..." : "Save Updates"}
          </button>
        </div>

        {/* Success/Error Message */}
        {userState.message && (
          <div
            className={`p-3 rounded mt-4 ${userState.messageType === "success" ? "bg-green-600" : "bg-red-600"
              } text-white text-center`}
          >
            {userState.message}
          </div>
        )}

        {/* User Information */}
        <div className=" p-4 md:p-6 rounded-lg ">
          {Object.keys(formData).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                {formatLabel(field)}
              </label>
              <input
                type={field === "dateOfBirth" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
              />
            </div>
          ))}
        </div>
        <div className="w-full h-1 bg-gray-400 mx-auto mb-4"></div>
        {/* Onboarding Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center py-2">
            <span> Skip Onboarding</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isOnboarded}
                onChange={handleToggleOnboarding}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-black after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-400 mx-auto mb-4"></div>
        {/* Password Update */}
        <div className=" p-4 md:p-6 rounded-lg ">
          <h2 className="text-lg font-semibold">Security</h2>
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="password"
                  name={field}
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [field]: e.target.value })
                  }
                  className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                />
              </div>
            )
          )}
          <button
            onClick={handlePasswordUpdate}
            disabled={userState.loading}
            className={`bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-600 cursor-pointer transition-all ${userState.loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {userState.loading ? "Updating..." : "Update Password"}
          </button>

          {userState.loading && (
            <div className="text-center text-sm text-gray-500 mt-2">
              Updating, please wait...
            </div>
          )}
        </div>

        {/* Notifications Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Notifications Settings</h2>
          <NotificationToggle
            label="Expense alerts and notifications"
            settingKey="expenseAlerts"
          />
          <NotificationToggle
            label="Community updates and announcements"
            settingKey="communityUpdates"
          />
          <NotificationToggle
            label="Payment reminders and alerts"
            settingKey="paymentReminders"
          />
          <NotificationToggle
            label="New feature announcements"
            settingKey="featureAnnouncements"
          />
        </div>
      </div>
    </div>
  );

};

export default SettingPage;
