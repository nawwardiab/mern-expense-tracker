import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { updateNotificationSettings } from "../api/authApi";

const NotificationToggle = ({ label, settingKey }) => {
  const { notificationState, notificationDispatch } = useContext(AuthContext);
  const notificationsEnabled = notificationState.notificationSettings[settingKey] || false;

  const handleToggle = async () => {
    console.log("🟢 Toggle clicked for:", settingKey);

    // Update the state locally BEFORE making the API call
    const updatedSettings = {
      ...notificationState.notificationSettings,
      [settingKey]: !notificationsEnabled
    };

    // Dispatching the local update to update the UI immediately
    notificationDispatch({ type: "UPDATE_NOTIFICATIONS_SUCCESS", payload: updatedSettings });

    try {
      console.log("📡 Attempting to save notification settings...", updatedSettings);
      await updateNotificationSettings(updatedSettings, notificationDispatch);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  };

  return (
    <div className="mt-4 flex justify-between items-center">
      <span className="block text-sm font-semibold">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={notificationsEnabled}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 rounded-lg peer peer-checked:after:translate-x-5 peer-checked:bg-black after:absolute after:top-1 after:left-1 after:bg-white after:rounded-lg after:h-4 after:w-4 after:transition-all"></div>
      </label>
    </div>
  );
};

export default NotificationToggle;


