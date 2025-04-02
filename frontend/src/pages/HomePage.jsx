import { useState, useEffect, useContext } from "react";
import ExpenseItem from "../components/reusable/ExpenseItem.jsx";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { ExpenseContext } from "../contexts/ExpenseContext.jsx";
import { getAllExpenses } from "../api/expenseApi.js";
import WeeklySpendingChart from "../components/Chart.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import TransactionList from "../components/TransactionList.jsx";

const HomePage = () => {
  const { userState } = useContext(AuthContext);
  const { expenseDispatch, expenseState } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Function to fetch expenses from the server

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getAllExpenses(expenseDispatch);
      } catch (err) {
        setError("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseDispatch]);

  const handleRefresh = () => {
    getAllExpenses(expenseDispatch);
  };

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left & Center content */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>

        <SummaryCards />

        <WeeklySpendingChart />
      </div>

      {/* Right Sidebar */}
      <TransactionList />

      <div className="space-y-4">
        {loading && (
          <p className="text-center text-gray-500">Loading expenses...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && expenses.length === 0 && (
          <p className="text-center text-gray-500">No expenses found.</p>
        )}
        {!loading &&
          !error &&
          expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              // currencySymbol={getCurrencySymbol(user?.currency)}
              onClick={() => setSelectedExpense(expense)}
            />
          ))}
      </div>
      {/* {loading && (
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
      </div> */}

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
