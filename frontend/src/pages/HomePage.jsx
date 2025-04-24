import { useState, useEffect, useContext } from "react";
import ExpenseDetails from "../components/modal/ExpenseDetail.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { ExpenseContext } from "../contexts/ExpenseContext.jsx";
import { GroupContext } from "../contexts/GroupContext.jsx";
import { getAllExpenses } from "../api/expenseApi.js";
import { fetchUserGroups } from "../api/groupApi.js";
import DashboardChat from "../components/Chart.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import GroupSummaryCard from "../components/GroupSummaryCard.jsx";
import GroupExpenseAccordion from "../components/GroupExpenseAccordion.jsx";
import FilteredTransactionList from "../components/FilteredTransactionList.jsx";

const HomePage = () => {
  const { userState } = useContext(AuthContext);
  const { expenseDispatch, expenseState } = useContext(ExpenseContext);
  const { groupDispatch } = useContext(GroupContext);
  const { isModalOpen, selectedExpense } = expenseState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions"); // "transactions" or "groups"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getAllExpenses(expenseDispatch);
        await fetchUserGroups(groupDispatch);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseDispatch, groupDispatch]);

  const handleRefresh = () => {
    getAllExpenses(expenseDispatch);
    fetchUserGroups(groupDispatch);
  };

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left & Center content */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First three cards from SummaryCards */}
          <div className="md:col-span-2">
            <SummaryCards />
          </div>

          {/* Replace Net Savings with Group Summary Card */}
          <div className="md:col-span-1">
            <GroupSummaryCard />
          </div>
        </div>

        <DashboardChat />
      </div>

      {/* Right Sidebar - Transaction Summary with Tabs */}
      <div className="flex flex-col mt-8 lg:mt-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Summary</h1>

          {/* Tab Selector */}
          <div className="flex rounded-md overflow-hidden border">
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === "transactions"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === "groups"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-[700px] sm:h-[600px] h-[400px]">
          <div className="h-full overflow-y-auto p-3 sm:p-4 bg-gray-50 scrollbar-hide">
            {activeTab === "transactions" ? (
              <FilteredTransactionList />
            ) : (
              <GroupExpenseAccordion />
            )}
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
