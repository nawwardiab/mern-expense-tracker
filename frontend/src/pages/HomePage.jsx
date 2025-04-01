import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExpenseItem from "../components/reusable/ExpenseItem.jsx";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { ExpenseContext } from "../contexts/ExpenseContext.jsx";
import { getAllExpenses } from "../api/expenseApi.js";

const HomePage = () => {
  const { userState } = useContext(AuthContext);

  const { expenseDispatch, expenseState } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null); // ✅ Ensure we store the full expense object

  // Function to fetch expenses from the server

  // Fetch expenses when the component mounts
  useEffect(() => {
    getAllExpenses(expenseDispatch);
  }, []);

  // Refresh the expenses list after modal actions (update/delete)
  const handleRefresh = () => {
    getAllExpenses(expenseDispatch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      {loading && (
        <p className="text-center text-gray-500">Loading expenses...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p className="text-center text-gray-500">No expenses found.</p>
      )}

      <div className="space-y-4">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onClick={() => {
              setSelectedExpense(expense); // ✅ Fix: Pass the entire expense object
            }}
          />
        ))}
      </div>

      {/* Expense Details Modal */}
      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => {
            setSelectedExpense(null);
          }}
          onRefresh={handleRefresh} // Pass the refresh function to the modal
        />
      )}
    </div>
  );
};

export default HomePage;
