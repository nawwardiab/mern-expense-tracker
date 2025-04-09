/**
 * ExpenseDetail.jsx
 *
 * Renders a modal with details for a single expense.
 * Allows editing fields and saving changes (updateExpense),
 * or deleting the expense (deleteExpense).
 * After each successful operation, it dispatches an action
 * to the ExpenseContext reducer, keeping the store in sync.
 */

import React, { useContext, useState,useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// We import the context just to get expenseDispatch.
// We also import the API functions for updating & deleting expenses.
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { updateExpense, deleteExpense } from "../../api/expenseApi";

const ExpenseDetail = ({ expense, onClose }) => {
  
  // We only need dispatch from the context to update global state after an API call.
  const { expenseDispatch,expenseState } = useContext(ExpenseContext);
  const { notificationState, notificationDispatch } = useContext(AuthContext);

  const { selectedExpense, isModalOpen } = expenseState;

  // Local states for editing logic, form data, and UI feedback.
  const [editedExpense, setEditedExpense] = useState(expense);
  const [isEditing, setIsEditing] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
 
 
  useEffect(() => {
    if (selectedExpense) {
      setEditedExpense(selectedExpense); // Update local state when a new expense is selected
    }
  }, [selectedExpense]);

  if (!isModalOpen || !selectedExpense) return null;

  /**
   * Toggles whether a specific field is editable (readOnly = false).
   * We track "edit" states in an object where each field is a boolean.
   */
  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /**
   * Handles changes to the local editedExpense object.
   * This only modifies local state, not the backend or context
   * until the user clicks "Save Expense."
   */
  const handleChange = (e) => {
    setEditedExpense({
      ...editedExpense,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Example function to update the category to a new value
   * (could be triggered by a button in the UI).
   */
  const handleCategoryChange = (newCategory) => {
    setEditedExpense((prev) => ({ ...prev, category: newCategory }));
  };

  /**
   * Saves the edited expense data to the server,
   * then dispatches an UPDATE_EXPENSE action to the context.
   */
  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // 1) Call the API to update the expense
      //    (the function is imported from expenseApi.js)
      const response = await updateExpense(expense._id, editedExpense);

      // 2) On success, show a success message
      setMessage({ type: "success", text: "Expense updated successfully!" });

      // 3) Update the expense in global context
      //    Our backend might return { success, data }
      //    so we access response.data for the updated doc
      if (response?.data) {
        expenseDispatch({ type: "UPDATE_EXPENSE", payload: response.data });
      }
    } catch (error) {
      console.error("Failed to update expense:", error);
      setMessage({
        type: "error",
        text: "Failed to update expense. Please try again.",
      });
    }

    setLoading(false);
  };

  /**
   * Deletes the expense from the server,
   * then dispatches a DELETE_EXPENSE action to the context.
   */
  const handleDelete = async () => {
    // Validate we have an expense ID to delete
    if (!expense?._id) {
      setMessage({ type: "error", text: "Invalid expense ID" });
      return;
    }

    // Confirm with the user to avoid accidental deletions
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1) Call the API to delete the expense
      await deleteExpense(expense._id);

      // 2) Show a success message
      setMessage({ type: "success", text: "Expense deleted successfully!" });

      // 3) Remove the expense from global context
      expenseDispatch({ type: "DELETE_EXPENSE", payload: expense._id });

      // 4) Optionally close the modal after a short delay
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
  //Handle Notification Toggle
  const handleToggleNotification = () => {
    notificationDispatch({
      type: "TOGGLE_NOTIFICATION",
      payload: "expenseAlerts",
    });
  };
  const closeModal = () => {
    expenseDispatch({ type: "CLOSE_MODAL" });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-lg z-[100]">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-md shadow-lg mt-16">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-xl font-bold">{expense.title} Details</h2>
          <FaTimes
            className="cursor-pointer text-2xl text-gray-600 hover:text-red-500"
            onClick={closeModal}
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

        {/* Title Editing */}
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
              className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
              onClick={() => toggleEdit("title")}
            />
          </div>
        </div>

        {/* Amount Editing */}
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
              className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
              onClick={() => toggleEdit("amount")}
            />
          </div>
        </div>

        {/* Category Editing */}
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

        {/* Recurring Frequency Editing */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Regularity</label>
          <div className="flex items-center">
            {isEditing.recurringFrequency ? (
              <select
                name="recurringFrequency"
                value={editedExpense.recurringFrequency || "one-time"}
                onChange={handleChange}
                className="w-48 bg-black text-white px-3 py-1 rounded-lg"
              >
                <option value="one-time">One-Time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            ) : (
              <span className="w-48 bg-black text-white px-3 py-1 rounded-lg">
                {editedExpense.recurringFrequency}
              </span>
            )}
            <MdEdit
              className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
              onClick={() => toggleEdit("recurringFrequency")}
            />
          </div>
        </div>

        {/* Transaction Dates */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">
            Transaction Date
          </label>

          {editedExpense.recurringFrequency !== "one-time" ? (
            // If recurring, we show start/end date fields
            <div className="flex items-center gap-4">
              {/* Start Date */}
              <div className="flex items-center">
                <label className="block text-xs mr-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={
                    editedExpense.startDate
                      ? editedExpense.startDate.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                  readOnly={!isEditing.startDate}
                />
                <MdEdit
                  className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
                  onClick={() => toggleEdit("startDate")}
                />
              </div>

              {/* End Date */}
              <div className="flex items-center">
                <label className="block text-xs mr-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={
                    editedExpense.endDate
                      ? editedExpense.endDate.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                  readOnly={!isEditing.endDate}
                />
                <MdEdit
                  className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
                  onClick={() => toggleEdit("endDate")}
                />
              </div>
            </div>
          ) : (
            // One-time expense: just a single transactionDate
            <div className="flex items-center">
              <input
                type="date"
                name="transactionDate"
                value={
                  editedExpense.transactionDate
                    ? editedExpense.transactionDate.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2 rounded-xl border border-gray-400 bg-gray-100"
                readOnly={!isEditing.transactionDate}
              />
              <MdEdit
                className="ml-2 cursor-pointer text-2xl text-gray-600 hover:text-black"
                onClick={() => toggleEdit("transactionDate")}
              />
            </div>
          )}
        </div>

        {/* Notifications Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <span className="block text-sm font-semibold">
            Expense alerts and notifications
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationState.notificationSettings.expenseAlerts}
              onChange={handleToggleNotification}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-black after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>

        {/* Save & Delete Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white p-2 rounded"
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-400"
          >
            {loading ? "Deleting..." : "Delete Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
