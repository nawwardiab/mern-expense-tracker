import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExpenseItem from "../components/reusable/ExpenseItem.jsx";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";

const HomePage = () => {

  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null); // ✅ Ensure we store the full expense object

  // Function to fetch expenses from the server
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

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Refresh the expenses list after modal actions (update/delete)
  const handleRefresh = () => {
    fetchExpenses();
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currencyCode] || currencyCode; 
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      {loading && <p className="text-center text-gray-500">Loading expenses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p className="text-center text-gray-500">No expenses found.</p>
      )}

      <div className="space-y-4">
        {expenses.map((expense) => (
          <ExpenseItem 
            key={expense._id} 
            expense={expense} 
            currencySymbol={getCurrencySymbol(user?.currency)}
            onClick={() => {
              console.log("Clicked:", expense); // ✅ Debugging log
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
            console.log("Closing modal");
            setSelectedExpense(null);
          }} 
          onRefresh={handleRefresh}  // Pass the refresh function to the modal
        />
      )}
    </div>
  );
};

export default HomePage;








