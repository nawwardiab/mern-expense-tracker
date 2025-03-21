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

      {/* Expenses Section . if you are allowing users to log multiple expenses within a group.*/}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Expenses</h2>
        {expenses.length > 0 ? (
          <ExpenseTable expenses={expenses} />
        ) : (
          <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-b pb-4 text-center">
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Total Cost</h2>
          <p className="text-xl font-bold text-gray-900">
            {group?.totalAmount || 0} €
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Members</h2>
          <p className="text-xl font-bold text-gray-900">{group?.members?.length || "—"}</p>
        </div>
        {/* <div>
          <h2 className="text-sm font-semibold text-gray-600">Split Per Person</h2>
          <p className="text-xl font-bold text-gray-900">
            {group?.members?.length > 0
              ? `${(expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0) / group.members.length).toFixed(2)} €`
              : "—"}
          </p>
        </div>*/}
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
