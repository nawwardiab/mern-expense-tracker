import { useState, useContext, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

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
  const { user } = useContext(AuthContext);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    occurrence: "monthly",
    transactionDate: "", // Used for one-time expenses
    startDate: "",
    endDate: "",
    notificationsEnabled: false, // Toggle for notifications
    isRecurring: false, // Toggle for recurring expense
    recurringFrequency: "monthly",
    currency: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.currency) {
      setExpense((prev) => ({ ...prev, currency: user.currency }));
    }
  }, [user]);

  if (!isOpen) return null; // Prevent rendering if modal is closed

  // Normalize input: Match even if user types lowercase
  const normalizeInput = (input, list) => {
    const found = list.find(
      (item) => item.toLowerCase() === input.toLowerCase()
    );
    return found || input; // Return correct case if found, else return original input
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (
      name === "startDate" ||
      name === "endDate" ||
      name === "transactionDate"
    ) {
      setExpense((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (name === "category") {
      formattedValue = normalizeInput(value, categories);
      const filtered = categories.filter(
        (cat) => cat.toLowerCase().includes(value.toLowerCase()) // Match partially
      );
      setFilteredCategories(filtered);
    } else if (name === "occurrence") {
      formattedValue = normalizeInput(value, occurrences);
    }

    setExpense((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // Select Category from Suggestions
  const handleCategorySelect = (selectedCategory) => {
    setExpense((prev) => ({ ...prev, category: selectedCategory }));
    setFilteredCategories([]); // Hide suggestions
  };

  const handleToggleRecurring = () => {
    setExpense((prev) => ({
      ...prev,
      isRecurring: !prev.isRecurring,
      transactionDate: !prev.isRecurring ? "" : prev.transactionDate, // Reset only if switching to recurring
      startDate: prev.isRecurring ? prev.startDate : "",
      endDate: prev.isRecurring ? prev.endDate : "",
      recurringFrequency: prev.isRecurring
        ? prev.recurringFrequency
        : "monthly",
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

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    // Convert occurrence to match the expected enum values in the schema
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
          } // Recurring expense
        : { transactionDate: formatDate(expense.transactionDate) }), // One-time expense
    };

    //console.log("Sending this data to backend:", formattedExpense);

    try {
      await axios.post("http://localhost:8000/expenses/add", formattedExpense, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setMessage({ type: "success", text: "Expense added successfully!" });
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add expense. Try again." });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-lg z-[100]">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-3/4 shadow-lg mt-16 relative">
        {/* Close Button */}
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
            className={`mt-2 p-2 text-sm rounded ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Expense Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Expense Name
            </label>
            <input
              type="text"
              name="title"
              value={expense.title}
              onChange={handleChange}
              required
              placeholder="e.g., Dinner at restaurant"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Total Amount
            </label>

            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
              placeholder="e.g., 100"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span className="text-gray-600 text-lg mr-2">
              {expense.currency || "€"}
            </span>
          </div>

          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>

            {categories.includes(expense.category) ? (
              // Selected category displayed as a button
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
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            )}

            {/* Category Suggestions Dropdown */}
            {filteredCategories.length > 0 && (
              <ul className="absolute left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50 border">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setExpense((prev) => ({ ...prev, category: cat }));
                      setFilteredCategories([]);
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
            <span className="text-sm font-semibold text-gray-700">
              Recurring Expense
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={expense.isRecurring}
                onChange={handleToggleRecurring}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-5 after:absolute after:top-0.5 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all"></div>
            </label>
          </div>

          {/* Recurrence Frequency Selection */}
          {expense.isRecurring ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Recurrence Frequency
                </label>
                <div className="flex gap-4 mt-2">
                  {["Weekly", "Monthly", "Yearly"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        expense.recurringFrequency === option.toLowerCase()
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
                  <label className="block text-sm font-semibold text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={expense.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={expense.endDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-5 
         after:absolute after:top-0.5 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all"
              ></div>
            </label>
          </div>

          {/* Add Expense Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
