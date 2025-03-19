import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import axios from "axios";

const ExpenseDetails = ({ expense, onClose }) => {
  const [editedExpense, setEditedExpense] = useState(expense);
  const [isEditing, setIsEditing] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!expense) {
    console.log("ExpenseDetails received: null");
    return <p className="text-center text-red-500">Expense not found.</p>;
  }
 

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.patch(
        `http://localhost:8000/expenses/${expense._id}`,
        editedExpense,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage({ type: "success", text: "Expense updated successfully!" });
    } catch (error) {
      console.error("Failed to update expense:", error);
      setMessage({
        type: "error",
        text: "Failed to update expense. Please try again.",
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!expense?._id) {
      setMessage({ type: "error", text: "Invalid expense ID" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    setLoading(true);
    setMessage(null);

    try {
      await axios.delete(`http://localhost:8000/expenses/${expense._id}`, {
        withCredentials: true, // Ensure authentication
      });

      setMessage({ type: "success", text: "Expense deleted successfully!" });

      // Close modal after showing success message
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      setMessage({
        type: "error",
        text: "Failed to delete expense. Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-80 backdrop-blur-lg">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-3/4 shadow-lg  mt-16">
        {/* Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-xl font-bold">{expense.title} Expenses</h2>
          <FaTimes
            className="cursor-pointer text-2xl text-gray-600 hover:border-gray-300 hover:text-red-500"
            onClick={onClose}
          />
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mt-2 p-2 text-sm rounded ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Expense Name */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">
            Expense Name
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="title"
              value={editedExpense.title || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
              readOnly={!isEditing.title}
            />
            <MdEdit
              className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
              onClick={() => toggleEdit("title")}
            />
          </div>
        </div>

        {/* Amount */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">
            Total Amount
          </label>
          <div className="flex items-center">
            <input
              type="number"
              name="amount"
              value={editedExpense.amount || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
              readOnly={!isEditing.amount}
            />
            <MdEdit
              className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
              onClick={() => toggleEdit("amount")}
            />
          </div>
        </div>

        {/* Category */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Category</label>
          <div className="flex gap-2">
            <span className="bg-black text-white px-3 py-1 rounded-lg">
              {editedExpense.category}
            </span>
            <button
              onClick={() => handleCategoryChange("New Category")}
              className="bg-black text-white px-3 py-1 rounded-lg"
            >
              Add +
            </button>
          </div>
        </div>

        {/* Regularity */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Regularity</label>
          <div className="flex items-center">
            <input
              type="text"
              name="regularity"
              value={editedExpense.recurringFrequency || ""}
              onChange={handleChange}
              className=" w-48 bg-black text-white px-3 py-1 rounded-lg"
              readOnly={!isEditing.recurringFrequency}
            />
            <MdEdit
          className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
              onClick={() => toggleEdit("regularity")}
            />
          </div>
        </div>

        {/* Transaction Date */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">
            Transaction Date
          </label>
          {editedExpense.recurringFrequency !== "one-time" ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <label className="block text-xs mr-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={editedExpense.transactionDate ? editedExpense.transactionDate.split("T")[0] : ""}

                  onChange={handleChange}
                  className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                  readOnly={!isEditing.transactionDate}
                />
                <MdEdit
                className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
                  onClick={() => toggleEdit("startDate")}
                />
              </div>

              <div className="flex items-center">
                <label className="block text-xs mr-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={editedExpense.endDate ? editedExpense.endDate.split("T")[0] : ""}

                  onChange={handleChange}
                  className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                  readOnly={!isEditing.endDate}
                />
                <MdEdit
                 className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
                  onClick={() => toggleEdit("endDate")}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                type="date"
                name="transactionDate"
                value={editedExpense.transactionDate?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                readOnly={!isEditing.transactionDate}
              />
              <MdEdit
               className="ml-2 cursor-pointer text-2xl text-gray-600 hover:border gray-300 hover:text-black"
                onClick={() => toggleEdit("transactionDate")}
              />
            </div>
          )}
        </div>
        {/* Toggle Switch for Notifications */}
        <div className="mt-4 flex justify-between items-center">
          <span className="block text-sm font-semibold">
            Expense alerts and notifications
          </span>
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
        <div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 w-full bg-black text-white p-2 rounded"
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="mt-4 w-48 bg-red-500 text-white p-2 rounded hover:bg-red-300"
          >
            {loading ? "Deleting..." : "Delete Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
