/**
 * AddExpense.jsx
 *
 * This component renders a modal form for creating a new expense.
 * It calls the `createExpense` function from `expenseApi.js` directly,
 * and then dispatches an action to the global Expense context reducer
 * to update local state. This keeps the context "lean" and places the
 * action (i.e., the API call) in the file where it's actually used.
 */

import { useState, useContext, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
// We don't need axios in this component, because we call createExpense directly from expenseApi
// import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { createExpense } from "../../api/expenseApi";

// Default Categories & Occurrences
const categories = [
  "Fixed",
  "Group Expenses",
  "Food&Drinks",
  "Entertainment",
  "Subscriptions",
  "Others",
];
const occurrences = ["Weekly", "Monthly", "Yearly"];

const AddExpense = ({ isOpen, onClose }) => {
  /**
   * We pull in user data from AuthContext just to default
   * the currency in the new expense (if the user has a preferred currency).
   */
  const { user } = useContext(AuthContext);

  /**
   * We only need dispatch from the ExpenseContext so we can
   * update the global expense state after a successful creation.
   */
  const { expenseDispatch } = useContext(ExpenseContext);

  /**
   * Local state to track the expense form inputs and UI logic
   * (suggested categories, loading state, error/success messages, etc.)
   */
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    occurrence: "monthly",
    transactionDate: "", // For one-time expenses
    startDate: "",
    endDate: "",
    notificationsEnabled: false, // Toggle for notifications
    isRecurring: false, // Toggle for recurring expense
    recurringFrequency: "monthly",
    currency: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * If the user object includes a currency, set it
   * as the default for this expense.
   */
  useEffect(() => {
    if (user?.currency) {
      setExpense((prev) => ({ ...prev, currency: user.currency }));
    }
  }, [user]);

  /**
   * If the modal isn't open, don't render anything.
   * This prevents the modal from showing at all in the DOM.
   */
  if (!isOpen) return null;

  /**
   * A small helper that tries to match the user input to one of the
   * known items in a provided list (case-insensitive). If found,
   * it returns the canonical form; otherwise, it returns the input as-is.
   */
  const normalizeInput = (input, list) => {
    const found = list.find(
      (item) => item.toLowerCase() === input.toLowerCase()
    );
    return found || input;
  };

  /**
   * Updates the local `expense` object whenever an input changes.
   * Special handling for:
   *  - Dates: set them directly
   *  - Category: use `normalizeInput` and dynamically filter suggestions
   *  - Occurrence: same concept
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (["startDate", "endDate", "transactionDate"].includes(name)) {
      setExpense((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "category") {
      formattedValue = normalizeInput(value, categories);
      const filtered = categories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else if (name === "occurrence") {
      formattedValue = normalizeInput(value, occurrences);
    }

    setExpense((prev) => ({ ...prev, [name]: formattedValue }));
  };

  /**
   * When a user clicks one of the suggested categories, we set that
   * as the category and clear the suggestions.
   */
  const handleCategorySelect = (selectedCategory) => {
    setExpense((prev) => ({ ...prev, category: selectedCategory }));
    setFilteredCategories([]);
  };

  /**
   * Toggles whether the expense is recurring or not. If we're
   * switching from non-recurring to recurring, we clear the
   * one-time transaction date. If we're switching back, we
   * clear the start/end dates.
   */
  const handleToggleRecurring = () => {
    setExpense((prev) => ({
      ...prev,
      isRecurring: !prev.isRecurring,
      transactionDate: !prev.isRecurring ? "" : prev.transactionDate,
      startDate: prev.isRecurring ? prev.startDate : "",
      endDate: prev.isRecurring ? prev.endDate : "",
      recurringFrequency: prev.isRecurring
        ? prev.recurringFrequency
        : "monthly",
    }));
  };

  /**
   * Toggles whether notifications are enabled for this expense.
   */
  const handleToggleNotifications = () => {
    setExpense((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  /**
   * Main submit handler.
   * 1) We format the expense data properly for the backend.
   * 2) We call createExpense (imported from expenseApi.js).
   * 3) We dispatch the "ADD_EXPENSE" action to the global context
   *    so the local state is up to date.
   * 4) Show success/failure messages accordingly.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // A helper to safely convert date strings to ISO format
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    // Map local 'occurrence' field to what the backend expects
    const occurrenceMapping = {
      "One-time": "one-time",
      Weekly: "weekly",
      Monthly: "monthly",
      Yearly: "yearly",
    };

    const formattedExpense = {
      title: expense.title,
      amount: Number(expense.amount),
      category: expense.category,
      currency: expense.currency,
      notificationsEnabled: expense.notificationsEnabled,
      isRecurring: expense.isRecurring,
      recurringFrequency: expense.isRecurring
        ? occurrenceMapping[expense.occurrence] || "monthly"
        : "one-time",
      ...(expense.isRecurring
        ? {
          startDate: formatDate(expense.startDate),
          endDate: formatDate(expense.endDate),
        }
        : { transactionDate: formatDate(expense.transactionDate) }),
    };

    try {
      // 1) Call the API
      await createExpense(formattedExpense, expenseDispatch);

      // 3) Show success message
      setMessage({ type: "success", text: "Expense added successfully!" });

      // 4) Close modal after a short delay
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (error) {
      // If the API call fails, show an error message
      setMessage({ type: "error", text: "Failed to add expense. Try again." });
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-lg z-[100]">
      <div className="bg-gray-200 p-8 rounded-lg w-full max-w-[40%] shadow-lg mt-16 relative">


        {/* Close Modal Button (top-right corner) */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Enter Expense Details
        </h2>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mt-2 p-2 text-sm rounded ${message.type === "success"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Expense Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Title */}
          <div>
            <label className="block text-sm font-semibold">Expense Name</label>
            <input
              type="text"
              name="title"
              value={expense.title}
              onChange={handleChange}
              required
              placeholder="e.g., Dinner at a restaurant"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-semibold">Total Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
              placeholder="e.g., 100"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span className="text-gray-600 text-lg mr-2">
              {expense.currency || "€"}
            </span>
          </div>

          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-semibold">Category</label>
            {categories.includes(expense.category) ? (
              // If the selected category is one of the known ones, show it as a "button"
              <button
                type="button"
                onClick={() =>
                  setExpense((prev) => ({ ...prev, category: "" }))
                }
                className="w-full px-4 py-2 rounded-lg bg-black text-white text-center font-semibold"
              >
                {expense.category} ✖
              </button>
            ) : (
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
                placeholder="Start typing... (e.g., Fixed, Food&Drinks, Entertainment)"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                           focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            )}

            {/* Category Suggestions Dropdown */}
            {filteredCategories.length > 0 && (
              <ul className="absolute left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50 border">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      handleCategorySelect(cat);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recurring Expense Toggle */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-semibold">Recurring Expense</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={expense.isRecurring}
                onChange={handleToggleRecurring}
              />
              <div
                className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black
                              peer-checked:after:translate-x-5
                              after:absolute after:top-0.5 after:left-1 after:bg-white 
                              after:w-5 after:h-5 after:rounded-full after:transition-all"
              ></div>
            </label>
          </div>

          {/* If recurring, show Frequency + Start/End Dates; otherwise show transactionDate */}
          {expense.isRecurring ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">
                  Recurrence Frequency
                </label>
                <div className="flex gap-4 mt-2">
                  {["Weekly", "Monthly", "Yearly"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`px-4 py-2 rounded-lg font-semibold transition 
                        ${expense.recurringFrequency === option.toLowerCase()
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      onClick={() =>
                        setExpense((prev) => ({
                          ...prev,
                          recurringFrequency: option.toLowerCase(),
                        }))
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={expense.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                               focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={expense.endDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                               focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Transaction Date
              </label>
              <input
                type="date"
                name="transactionDate"
                value={expense.transactionDate}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100
                           focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          )}

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
                className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black 
                           peer-checked:after:translate-x-5 
                           after:absolute after:top-0.5 after:left-1 after:bg-white 
                           after:w-5 after:h-5 after:rounded-full after:transition-all"
              ></div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
          >
            {loading ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
