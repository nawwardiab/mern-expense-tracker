// 📁 components/modal/AddGroupExpenseModal.jsx
import React, { useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { addGroupExpense, fetchGroupExpenses } from "../../api/groupApi";

const AddGroupExpenseModal = ({ isOpen, onClose, groupId }) => {
  const { userState } = useContext(AuthContext);
  const { groupDispatch, groupState } = useContext(GroupContext);
  const { selectedGroup } = groupState;
  const { expenseDispatch } = useContext(ExpenseContext);
  const { user } = userState;

  const [form, setForm] = useState({
    title: "",
    amount: "",
    transactionDate: "",
    category: "Group Expenses",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const expenseData = {
      ...form,
      userId: user._id,
      groupId: selectedGroup._id,
    };

    try {
      await addGroupExpense(selectedGroup._id, expenseData, groupDispatch);
      setMessage({ type: "success", text: "Expense added to group!" });
      setTimeout(() => {
        setForm({
          title: "",
          amount: "",
          transactionDate: "",
          category: "Group Expenses",
        });
        setMessage(null);
        onClose();
        setLoading(false);
      }, 1500);
      await fetchGroupExpenses(selectedGroup._id, groupDispatch);
    } catch (err) {
      console.error("Failed to add group expense:", err);
      setMessage({ type: "error", text: "Error adding expense." });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Add Group Expense</h2>

        {message && (
          <div
            className={`mb-3 p-2 rounded text-sm ${
              message.type === "success"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="date"
            name="transactionDate"
            placeholder="Transaction Date"
            value={form.transactionDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Food&Drinks">Food & Drinks</option>
            <option value="Tickets">Tickets</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Subscriptions">Subscriptions</option>
          </select> */}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupExpenseModal;
