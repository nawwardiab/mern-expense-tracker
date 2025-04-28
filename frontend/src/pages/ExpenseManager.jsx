import React, { useEffect, useContext, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { getAllExpenses } from "../api/expenseApi";
import ExpenseList from "../components/ExpenseList";
import AddExpense from "../components/modal/AddExpense";

const ExpenseManager = () => {
  // 1) Pull global expense state & dispatch from context
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { totalFilteredExpenses } = expenseState;

  // 2) Local filters for the UI
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await getAllExpenses(expenseDispatch);
        if (response?.data) {
          expenseDispatch({
            type: "GET_EXPENSES",
            payload: response.data,
          });
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    }
    fetchExpenses();
  }, [expenseDispatch]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">
        Manage your expenses
      </h1>

      {/* =========== Search Input =========== */}
      <div className="relative flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search expenses..."
          className="border p-3 flex-1 rounded-lg shadow-md pr-12 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TbListSearch className="absolute right-4 text-gray-500 text-xl sm:text-2xl top-1/2 transform -translate-y-1/2" />
      </div>

      {/* =========== Categories Filter =========== */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 mt-3">
          {[
            "Fixed",
            "Group Expenses",
            "Food&Drinks",
            "Entertainment",
            "Subscriptions",
            "Others",
          ].map((cat) => (
            <button
              key={cat}
              className={`px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base ${category === cat ? "bg-black text-white" : "border"
                }`}
              onClick={() => setCategory(category === cat ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========== Occurrence Filter =========== */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Occurrence</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3">
          {["Weekly", "Monthly", "Yearly", "One-Time"].map((occ) => (
            <button
              key={occ}
              className={`px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base ${occurrence === occ ? "bg-black text-white" : "border"
                }`}
              onClick={() => setOccurrence(occurrence === occ ? "" : occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* =========== Expense List + Summary =========== */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Expense List */}
        <div className="lg:w-2/3 w-full">
          <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent hover:scrollbar-thumb-gray-200">
            <ExpenseList
              search={search}
              category={category}
              occurrence={occurrence}
            />
          </div>
        </div>

        {/* Right: Summary of the filtered list */}
        <div className="lg:w-1/3 w-full">
          <div className="p-5 bg-indigo-50 rounded-xl shadow-lg flex flex-col items-center text-center h-full">
            <FaWallet className="text-indigo-600 text-4xl sm:text-5xl mb-3 mt-6 sm:mt-10" />
            <h2 className="text-lg sm:text-xl font-semibold mt-4">Total Spent</h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              €{totalFilteredExpenses.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Filtered expenses total
            </p>
          </div>
        </div>
      </div>

      {/* Floating Add Event Button */}
      {/* Floating Add Event Button (Visible Only on Small Devices) */}
      <FaPlus
        className="fixed bottom-16 right-6 bg-black text-4xl text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition z-50 md:hidden"
        onClick={() => setIsModalOpen(true)}
      />

      {/* AddExpense Modal */}
      {isModalOpen && (
        <AddExpense isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ExpenseManager;
