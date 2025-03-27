import React, { useState, useEffect, useContext } from "react";
import { GroupContext } from "../contexts/GroupContext";
import AddGroupExpenseModal from "./modal/AddGroupExpenseModal";
import { fetchGroupExpenses } from "../api/groupApi";

const ExpenseTable = () => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group expenses on load
  useEffect(() => {
    fetchGroupExpenses(selectedGroup._id, groupDispatch); // This should update GroupContext
  }, []);

  console.log("Selected Group:", selectedGroup);
  const expenses = selectedGroup?.expenses || [];

  if (loading)
    return <p className="text-center text-gray-500">Loading expenses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => setIsAddExpenseModalOpen(true)}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        + Add More Group Expenses
      </button>

      {isAddExpenseModalOpen && (
        <AddGroupExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          groupId={selectedGroup?._id}
        />
      )}
    </div>
  );
};

export default ExpenseTable;
