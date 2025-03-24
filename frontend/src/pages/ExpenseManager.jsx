// src/pages/ExpenseManager.jsx (example path)
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { ExpenseContext } from "../contexts/ExpenseContext";
import ExpenseList from "../components/ExpenseList";
import { FaWallet } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";

const ExpenseManager = () => {
  // 1) Get the global “expenses” and a way to set them
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { expenses } = expenseState;
  // Reducer to set expenses
  const setExpenses = (expenses) => {
    expenseDispatch({ type: "GET_EXPENSES", payload: expenses });
  };

  // 2) Local states for filtering
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");

  // 3) Local derived states: “filteredExpenses,” “totalFiltered”
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalFilteredExpenses, setTotalFilteredExpenses] = useState(0);

  // 4) Fetch expenses from the server once
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/expenses", {
          withCredentials: true,
        });
        // Save the array in global state
        setExpenses(data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [setExpenses]);

  // 5) Whenever “expenses” or filter states change, compute the filtered array
  useEffect(() => {
    let filtered = expenses;

    // Search by title
    if (search) {
      filtered = filtered.filter((expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }

    // Occurrence filter
    if (occurrence) {
      filtered = filtered.filter(
        (expense) => expense.recurringFrequency === occurrence.toLowerCase()
      );
    }

    setFilteredExpenses(filtered);

    // Calculate total of the filtered list
    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalFilteredExpenses(total);
  }, [expenses, search, category, occurrence]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
        Manage your expenses
      </h1>

      {/* =========== Search Input (Local) =========== */}
      <div className="relative flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search expenses..."
          className="border p-3 flex-1 rounded-lg shadow-md pr-12 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TbListSearch className="absolute right-4 text-gray-500 text-3xl sm:text-4xl" />
      </div>

      {/* =========== Categories (Local) =========== */}
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

      {/* =========== Occurrence Filters (Local) =========== */}
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

        {/* Right: Summary */}
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
