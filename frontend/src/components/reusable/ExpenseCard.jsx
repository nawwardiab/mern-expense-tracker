import React, { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";

const ExpenseCard = ({ expense, onClose }) => {
  const [editedExpense, setEditedExpense] = useState(expense);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-start justify-start bg-gray-200 bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded-lg w-full max-w-3/4 shadow-lg ml-16 mt-16">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Expense</h2>
          <FaTimes className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Expense Name */}
        <div className="mt-4">
          <label className="block text-sm mb-2">Expense Name</label>
          <div className="flex items-center">
            <input
              type="text"
              name="name"
              value={editedExpense.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-200"
              readOnly={!isEditing}
            />
            <FaEdit
              className="ml-2 cursor-pointer text-gray-600"
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4">
          <label className="block text-sm mb-2">Total Amount</label>
          <div className="flex items-center">
            <input
              type="number"
              name="amount"
              value={editedExpense.amount}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-200"
              readOnly={!isEditing}
            />
            <FaEdit
              className="ml-2 cursor-pointer text-gray-600"
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="mt-4">
          <label className="block text-sm font-semibold">Category</label>
          <div className="flex gap-2">
            {editedExpense.categories.map((cat, index) => (
              <span key={index} className="bg-black text-white px-3 py-1 rounded-lg">
                {cat}
              </span>
            ))}
            <button className="bg-gray-300 px-3 py-1 rounded-lg">+ Add</button>
          </div>
        </div>

        {/* Toggle Switch for Notifications */}
        <div className="mt-4 flex justify-between items-center">
          <span>Enable Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-black after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>

        {/* Save Button */}
        <button className="mt-4 w-full bg-black text-white p-2 rounded">
          Save Expense
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
