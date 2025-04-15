import { useState, useEffect, useContext } from "react";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { ExpenseContext } from "../contexts/ExpenseContext.jsx";
import { getAllExpenses } from "../api/expenseApi.js";
import DashboardChat from "../components/Chart.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import TransactionList from "../components/TransactionList.jsx";
import SummaryCardsHumphrey from "../components/SummaryCardsHumphrey.jsx";

const HomePage = () => {
  const { userState } = useContext(AuthContext);
  const { expenseDispatch, expenseState } = useContext(ExpenseContext);
  const { expenses, isModalOpen, selectedExpense } = expenseState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        {/* <SummaryCardsHumphrey /> */}
        <DashboardChat />
      </div>

      {/* Right Sidebar - Transaction Summary */}
      <div className="flex flex-col mt-8 lg:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Transaction Summary
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-[700px] sm:h-[600px] h-[400px]">
          <div className="h-full overflow-y-auto p-3 sm:p-4 bg-gray-50 scrollbar-hide">
            <TransactionList />
          </div>
        </div>
      </div>

      {/* Expense Details Modal */}
      {isModalOpen && selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => expenseDispatch({ type: "CLOSE_MODAL" })}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default HomePage;
