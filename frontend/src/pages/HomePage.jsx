import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExpenseItem from "../components/reusable/ExpenseItem.jsx";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import WeeklySpendingChart from "../components/Chart.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import TransactionList from "../components/TransactionList.jsx";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/expenses", { withCredentials: true });
      setExpenses(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRefresh = () => {
    fetchExpenses();
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = { USD: "$", EUR: "€", GBP: "£" };
    return symbols[currencyCode] || currencyCode;
  };

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left & Center content */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>

        <SummaryCards />

        <div>
          <WeeklySpendingChart />
        </div>

        <div className="space-y-4">
          {loading && <p className="text-center text-gray-500">Loading expenses...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && expenses.length === 0 && (
            <p className="text-center text-gray-500">No expenses found.</p>
          )}
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              currencySymbol={getCurrencySymbol(user?.currency)}
              onClick={() => setSelectedExpense(expense)}
            />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <TransactionList />

      {/* Expense Details Modal */}
      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default HomePage;
