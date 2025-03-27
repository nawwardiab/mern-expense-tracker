/**
 * ExpenseManager.jsx
 *
 * A page component that displays and manages a list of expenses.
 * It fetches all expenses from the server on mount using a dedicated API function
 * (getAllExpenses) and then dispatches the results to the ExpenseContext.
 * The user can filter by search, category, or occurrence.
 * The filtered list is rendered in ExpenseList, and a summary (total) is shown.
 */

import React, { useEffect, useContext, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";

import { ExpenseContext } from "../contexts/ExpenseContext";
import { getAllExpenses } from "../api/expenseApi"; // <-- new import
import ExpenseList from "../components/ExpenseList";

const ExpenseManager = () => {
  // 1) Pull global expense state & dispatch from context
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  // 2) Local filters for the UI
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");

  // 3) Derived states: the filtered list and the total
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalFilteredExpenses, setTotalFilteredExpenses] = useState(0);

  /**
   * 4) On mount, fetch all expenses from the server.
   * We call the `getAllExpenses` API function and dispatch
   * a GET_EXPENSES action to the context.
   */
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await getAllExpenses(expenseDispatch);
        // Typically: response = { success: true, data: [...] }

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

  /**
   * 5) Whenever expenses or our filter states change,
   * we derive a filtered list and calculate the total cost of those filtered items.
   */
  useEffect(() => {
    let filtered = expenses;

    // Search by title
    if (search) {
      filtered = filtered.filter((exp) =>
        exp.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((exp) => exp.category === category);
    }

    // Occurrence filter (note: we compare to .toLowerCase())
    if (occurrence) {
      filtered = filtered.filter(
        (exp) => exp.recurringFrequency === occurrence.toLowerCase()
      );
    }

    // Update local state
    setFilteredExpenses(filtered);

    // Calculate the total for the filtered list
    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalFilteredExpenses(total);
  }, [expenses, search, category, occurrence]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
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
        {/* Search icon displayed on the right */}
        <TbListSearch className="absolute right-4 text-gray-500 text-3xl sm:text-4xl" />
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
              className={`px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base ${
                category === cat ? "bg-black text-white" : "border"
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
              className={`px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base ${
                occurrence === occ ? "bg-black text-white" : "border"
              }`}
              onClick={() => setOccurrence(occurrence === occ ? "" : occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* =========== Expense List + Summary =========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Expense List */}
        <div className="lg:col-span-2">
          <ExpenseList expenses={filteredExpenses} />
        </div>

        {/* Right: Summary of the filtered list */}
        <div className="flex justify-center w-full">
          <div className="p-5 bg-blue-50 rounded-xl shadow-lg flex flex-col items-center text-center w-full max-w-md">
            <FaWallet className="text-blue-600 text-4xl sm:text-5xl mb-3 mt-6 sm:mt-10" />
            <h2 className="text-lg sm:text-xl font-semibold mt-4">
              Total Spent
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              €{totalFilteredExpenses.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Filtered expenses total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
