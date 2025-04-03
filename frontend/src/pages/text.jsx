import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

const SettingPage = () => {
// Profile picture state
const [profileImage, setProfileImage] = useState(null);
const [preview, setPreview] = useState(null);

// Toggle switch states
const [notifications, setNotifications] = useState({
expenseAlerts: false,
communityUpdates: false,
paymentReminders: false,
featureAnnouncements: false,
});

// Handle image upload & preview
const handleImageUpload = (e) => {
const file = e.target.files[0];
if (file) {
setProfileImage(file);
setPreview(URL.createObjectURL(file)); // Preview before upload
}
};

// Handle toggle switches
const handleToggle = (type) => {
setNotifications((prev) => ({
...prev,
[type]: !prev[type],
}));
};

return (
<div className="bg-gray-200 min-h-screen flex flex-col items-center p-4 md:p-6 shadow-md">
{/* Container to Align Upload & Form */}
<div className="p-6 rounded-lg w-full max-w-3xl flex flex-col gap-6">
{/* Profile Picture Upload */}
<div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
<div className="relative w-24 h-24">
<img
src={preview || "https://picsum.photos/100"}
alt="Profile"
className="w-24 h-24 rounded-full border-4 border-gray-300"
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
<div className="flex flex-col md:flex-row gap-2">
<button className="bg-black text-sm text-white px-4 py-2 rounded-xl">
Upload Picture
</button>
<button className="bg-black text-sm text-white px-4 py-2 rounded-xl">
Save Updates
</button>
</div>
</div>

{/* Form Fields */}
<div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
<div className="mb-4">
<label className="block text-sm font-semibold">Full Name</label>
<input type="text" className="w-full p-2 border rounded-xl" />
</div>
<div className="mb-4">
<label className="block text-sm font-semibold">Email</label>
<input type="email" className="w-full p-2 border rounded-xl" />
</div>
<div className="mb-4">
<label className="block text-sm font-semibold">Date of Birth</label>
<input type="date" className="w-full p-2 border rounded-xl" />
</div>
<div className="mb-6">
<label className="block text-sm font-semibold">Address</label>
<textarea className="w-full p-2 border rounded-xl"></textarea>
</div>

{/* Security */}
<h2 className="text-lg font-semibold mb-2">Security</h2>
<div className="mb-4">
<label className="block text-sm font-semibold">
Current Password
</label>
<input type="password" className="w-full p-2 border rounded-xl" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-semibold">New Password</label>
<input type="password" className="w-full p-2 border rounded-xl" />
</div>
<div>
<label className="block text-sm font-semibold">
Confirm Password
</label>
<input type="password" className="w-full p-2 border rounded-xl" />
</div>
</div>
<button className="bg-black text-sm text-white px-4 py-2 rounded-xl mt-4">
Update Password
</button>

{/* Group Notifications */}
<h2 className="text-lg font-semibold mt-6">Group Notifications</h2>
{[
{ key: "expenseAlerts", label: "Expense alerts and notifications" },
{
key: "communityUpdates",
label: "Community updates and announcements",
},
{ key: "paymentReminders", label: "Payment reminders and alerts" },
{ key: "featureAnnouncements", label: "New feature announcements" },
].map((item) => (
<div
key={item.key}
className="flex justify-between items-center py-2"
>
<span>{item.label}</span>
<label className="relative inline-flex items-center cursor-pointer">
<input
type="checkbox"
checked={notifications[item.key]}
onChange={() => handleToggle(item.key)}
className="sr-only peer"
/>
<div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-black after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
</label>
</div>
))}

{/* Billing */}
<h2 className="text-lg font-semibold mt-6">Billing</h2>
<div className="flex justify-between items-center mt-2">
<span>Manage payment methods</span>
<button className="bg-black text-sm text-white px-4 py-2 rounded-xl">
Modify
</button>
</div>
</div>
</div>
</div>
);
};

export default SettingPage;

