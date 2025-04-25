import React, { useState, useEffect, useContext } from "react";
import { GroupContext } from "../contexts/GroupContext";
import AddGroupExpenseModal from "./modal/AddGroupExpenseModal";
import {
  addGroupExpense,
  editGroupExpense,
  deleteGroupExpense,
} from "../api/groupApi";
import PaymentList from "./PaymentList";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseTable = () => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group expenses on load
  //   useEffect(() => {
  //     fetchGroupExpenses(selectedGroup._id, groupDispatch); // This should update GroupContext
  //   }, []);

  const expenses = selectedGroup?.expenses || [];
  console.log("🚀 ~ ExpenseTable ~ selectedGroup:", selectedGroup);
  //   console.log("🚀 ~ ExpenseTable ~ expenses:", expenses);

  //   if (loading)
  //     return <p className="text-center text-gray-500">Loading expenses...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsAddExpenseModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId, amount) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteGroupExpense(selectedGroup._id, expenseId);
        groupDispatch({
          type: "DELETE_GROUP_EXPENSE",
          payload: { expenseId, amount },
        });
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Expense List</h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses recorded yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Title
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {expense.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  €{Number(expense.amount).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(expense.transactionDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="text-indigo-600 hover:text-indigo-800 mr-3"
                    title="Edit expense"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteExpense(expense._id, expense.amount)
                    }
                    className="text-red-500 hover:text-red-700"
                    title="Delete expense"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => {
          setEditingExpense(null);
          setIsAddExpenseModalOpen(true);
        }}
        className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
      >
        + Add More Group Expenses
      </button>

      {isAddExpenseModalOpen && (
        <AddGroupExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          groupId={selectedGroup?._id}
          expense={editingExpense}
        />
      )}
    </div>
  );
};

export default ExpenseTable;
