import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseTable from "./ExpenseTable";
import AddGroupExpense from "./modal/AddGroupExpense";

const GroupDetail = ({ group }) => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (group?._id) {
      fetchExpenses();
    }
  }, [group]);

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`/groups/${group._id}/expenses`, {
        withCredentials: true,
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]); // Update list
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full">
      {/* Group Name & Description */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{group?.name || "Select a Group"}</h1>
          <p className="text-gray-600 mt-2">{group?.description || "No description available."}</p>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition-all"
        >
          + Add Expense
        </button>
      </div>

      {/* Summary Section */}
      <div className="mt-6 flex justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Total Cost</h2>
        <h2 className="text-lg font-semibold">Members</h2>
      </div>

      {/* Expenses Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Expenses</h2>
        {expenses.length > 0 ? (
          <ExpenseTable expenses={expenses} />
        ) : (
          <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <AddGroupExpense
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          groupId={group._id}
          onExpenseAdded={handleExpenseAdded} // Update list when added
        />
      )}
    </div>
  );
};

export default GroupDetail;
