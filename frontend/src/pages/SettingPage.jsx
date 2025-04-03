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
    currency: "",
    income: "",
    paymentMethod: "",
    username: "",
  });
  /*const [notifications, setNotifications] = useState({
    expenseAlerts: false,
    communityUpdates: false,
    paymentReminders: false,
    featureAnnouncements: false,
  });*/

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("https://picsum.photos/100");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    expenseAlerts: false,
    communityUpdates: false,
    paymentReminders: false,
    featureAnnouncements: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Prefill form when user data is available
  useEffect(() => {
    if (userState.user) {
      const user = userState.user;
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        location: user.location || "",
        currency: user.currency || "",
        income: user.income || "",
        paymentMethod: user.paymentMethod || "",
        username: user.username || "",
      });
      if (user.profilePicture) {
        setPreview(user.profilePicture); // Display the latest profile picture URL
      } else {
        setPreview("https://picsum.photos/100");
      }
    }

    if (notificationState.notificationSettings) {
      setNotifications(notificationState.notificationSettings);
    }
  }, [userState.user, notificationState.notificationSettings]);

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

  // ✅ Save profile updates
  const handleSaveProfile = async () => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    if (profilePicture) {
      form.append("profilePic", profilePicture);
      console.log("✅ Adding Profile Image to FormData: ", profilePicture.name);
    }

    try {
      const updatedUser = await updateProfile(form, userDispatch);

      // ✅ Ensure the backend returns the **full URL** of the profile picture
      if (updatedUser.profilePicture) {
        const fullUrl = updatedUser.profilePicture;
        setPreview(fullUrl); // Make sure this URL is accessible
        console.log("✅ Updated Profile Picture URL: ", fullUrl);
      }

      userDispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: updatedUser });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Profile update failed." });
    }
  };

  // 🔑 Handle password update
  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

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
      setMessage({ type: "success", text: successMessage });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Password update failed." });
    }
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
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update notifications." });
    }
  };
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4 md:p-6 shadow-md">
      <div className="p-6 rounded-lg w-full max-w-3xl flex flex-col gap-6">
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
              onError={() => setPreview("https://picsum.photos/100")} // Fallback image
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
            className={`bg-black text-sm text-white px-4 py-2 rounded-xl ${
              userState.loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {userState.loading ? "Saving..." : "Save Updates"}
          </button>
        </div>
        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`p-3 rounded ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white text-center`}
          >
            {message.text}
          </div>
        )}
        {/* User Information */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          {Object.keys(formData).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-semibold capitalize">
                {field}
              </label>
              <input
                type={field === "dateOfBirth" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-xl"
              />
            </div>
          ))}
        </div>
        {/* Password Update */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Security</h2>
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-semibold">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="password"
                  name={field}
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [field]: e.target.value })
                  }
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            )
          )}
          <button
            onClick={handlePasswordUpdate}
            disabled={userState.loading}
            className={`bg-black text-sm text-white px-4 py-2 rounded-xl mt-4 ${
              userState.loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {userState.loading ? "Updating..." : "Update Password"}
          </button>

          {userState.loading && (
            <div className="text-center text-sm text-gray-500">
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
