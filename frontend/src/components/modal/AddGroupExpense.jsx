import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

const categories = [
  "Fixed",
  "Group Expenses",
  "Food&Drinks",
  "Entertainment",
  "Subscriptions",
  "Others",
];

const occurrences = ["Weekly", "Monthly", "Yearly"];

const AddGroupExpense = ({ isOpen, onClose, onGroupAdded }) => {
  const { user } = useContext(AuthContext);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([user?._id]);
  const [group, setGroup] = useState({ name: "", description: "" });
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    currency: user?.currency || "€",
    isRecurring: false,
    recurringFrequency: "monthly",
    transactionDate: "",
    startDate: "",
    notificationsEnabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.currency) {
      setExpense((prev) => ({ ...prev, currency: user.currency }));
    }
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/users", { withCredentials: true });
        console.log("🟢 Users fetched from backend:", data);
        if (Array.isArray(data)) { // ✅ Ensure data is an array
          setUsers(data.filter(u => u._id !== user?._id));
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  if (!isOpen) return null;

  // Normalize Input for Dropdown Selections
  const normalizeInput = (input, list) => {
    return list.find((item) => item.toLowerCase() === input.toLowerCase()) || input;
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers((prev) => {
      let updatedMembers = prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];

      // ✅ Always ensure current user is in the list
      if (!updatedMembers.includes(user?._id)) {
        updatedMembers.push(user._id);
      }

      console.log("🟢 Updated selected members:", updatedMembers);

      return updatedMembers.includes(user?._id) ? updatedMembers : [...updatedMembers, user._id];
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (["startDate", "transactionDate"].includes(name)) {
      setExpense((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "category") {
      formattedValue = normalizeInput(value, categories);
      setFilteredCategories(categories.filter((cat) => cat.toLowerCase().includes(value.toLowerCase())));
    }

    if (name === "recurringFrequency") {
      formattedValue = normalizeInput(value, occurrences);
    }

    setExpense((prev) => ({ ...prev, [name]: formattedValue }));
  };


  // Handle Group Input Changes
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroup((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Recurring Expense
  const handleToggleRecurring = () => {
    setExpense((prev) => ({
      ...prev,
      isRecurring: !prev.isRecurring,
      transactionDate: !prev.isRecurring ? "" : prev.transactionDate,
      startDate: prev.isRecurring ? prev.startDate : "",
      endDate: prev.isRecurring ? prev.endDate : "",
      recurringFrequency: prev.isRecurring ? prev.recurringFrequency : "monthly",
    }));
  };

  // Toggle Notifications
  const handleToggleNotifications = () => {
    setExpense((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log("🟢 Final selected members before submitting:", selectedMembers);

    if (!user?._id) {
      console.error("❌ No authenticated user found.");
      setMessage({ type: "error", text: "You must be logged in to create a group." });
      setLoading(false);
      return;
    }

    console.log("🟢 Authenticated User ID:", user?._id);
    console.log("🟢 Sending Group Data:", {
      name: group.name,
      description: group.description,
      members: selectedMembers.map((memberId) => ({ userId: memberId, role: "member" })),
      totalAmount: expense.amount,
    });

    const payload = {
      name: group.name,
      description: group.description,
      members: selectedMembers.map((memberId) => ({ userId: memberId, role: "member" })),
      totalAmount: expense.amount || 0, // Ensure a default value
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/groups/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessage({ type: "success", text: "Group created successfully!" });

      if (onGroupAdded) {
        onGroupAdded(response.data);
      }

      setTimeout(() => {
        setMessage(null);
        onClose();
        setLoading(false); // ✅ Move this inside setTimeout to avoid syntax errors
      }, 1500);

    } catch (error) { // ✅ Ensure the catch block starts correctly
      console.error("❌ Error creating group:", error.response?.data || error.message);
      setMessage({ type: "error", text: "Failed to create group." });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-lg z-[100]">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg mt-16 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
          <FaTimes className="text-2xl" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Group & Expense</h2>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-2 p-2 text-sm rounded ${message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {message.text}
          </div>
        )}

        {/* Form Start */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold">Group Name</label>
            <input
              type="text"
              name="name"
              value={group.name}
              onChange={handleGroupChange}
              required
              placeholder="Enter group name"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              name="description"
              value={group.description}
              onChange={handleGroupChange}
              placeholder="Short description"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold">Total Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
              placeholder="e.g., 100"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Category Selection */}
          <div className="relative">
            <label className="block text-sm font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={expense.category}
              onChange={(e) => {
                const value = e.target.value;
                setExpense((prev) => ({ ...prev, category: value }));

                // Filter categories dynamically
                setFilteredCategories(
                  categories.filter((cat) =>
                    cat.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
              placeholder="Start typing..."
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            {
              filteredCategories.length > 0 && (
                <ul className="absolute left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50 border">
                  {filteredCategories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setExpense((prev) => ({ ...prev, category: cat }));
                        setFilteredCategories([]);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200">
                      {cat}
                    </li>
                  ))}
                </ul>
              )
            }
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Start Date</label>

              <input
                type="date"
                name="startDate"
                value={expense.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          {/* User Count */}
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Members in Group: {selectedMembers.length}
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold">Add Members</label>
            <div className="max-h-40 overflow-y-auto border p-2 rounded">
              {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p> // ✅ Debugging empty users
              ) : (
                users.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-2 border-b">
                    <span>{u.fullName || u.email}</span>
                    <button
                      type="button"
                      onClick={() => handleMemberToggle(u._id)}
                      className={`px-4 py-1 rounded ${selectedMembers.includes(u._id) ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                    >
                      {selectedMembers.includes(u._id) ? "Remove" : "Add"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Expense Alerts & Notifications Toggle */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-semibold text-gray-700">
              Expense Alerts and Notifications
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={expense.notificationsEnabled}
                onChange={handleToggleNotifications}
              />
              <div
                className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-5 
         after:absolute after:top-0.5 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all"
              ></div>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 transition">
            {loading ? "Saving..." : "Create Group & Expense"}
          </button>
        </form>
      </div >
    </div >
  );
};

export default AddGroupExpense;
