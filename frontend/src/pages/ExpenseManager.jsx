import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseList from "../components/ExpenseList";
import { FaFilter, FaWallet } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
import { setAxiosDefaults } from "../utils/axiosConfig";

// Apply Axios default settings
setAxiosDefaults();

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalFilteredExpenses, setTotalFilteredExpenses] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch ALL expenses once when component loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to Fetch Expenses from Backend (NO FILTERS)
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("/expenses", { withCredentials: true });
      setExpenses(data.data);
      setFilteredExpenses(data.data);
      updateTotalSpent(data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error);
    }
  };

  // Function to Filter Expenses in the Frontend
  useEffect(() => {
    let filtered = expenses;

    // Apply Search Filter (Case-Insensitive)
    if (search) {
      filtered = filtered.filter((expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Apply Category Filter
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }
    // Apply Occurrence Filter
    if (occurrence) {
      filtered = filtered.filter((expense) => expense.recurringFrequency === occurrence.toLowerCase());
    }

    setFilteredExpenses(filtered);
    updateTotalSpent(filtered);
  }, [search, category, occurrence, expenses]);

  // Function to Calculate Total Expenses
  const updateTotalSpent = (filteredData) => {
    const total = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalFilteredExpenses(total);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Manage your expenses</h1>

      <div className="flex gap-4 my-6 items-center">
        <input
          type="text"
          placeholder="Search expenses"
          className="border p-3 flex-1 rounded-lg shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
          onClick={fetchExpenses}
        >
          <FaFilter className="text-white text-lg" />
          Apply
        </button>
      </div>

      {/* Popular Categories */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-3">
          {["Fixed", "Group Expenses", "Food&Drinks", "Entertainment", "Subscriptions", "Others"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md ${category === cat ? "bg-black text-white" : "border"}`}
              onClick={() => setCategory(category === cat ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Occurrence Filters */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Occurrence</h2>
        <div className="grid grid-cols-4 gap-4 mt-3">
          {["Weekly", "Monthly", "Yearly", "One-Time"].map((occ) => (
            <button
              key={occ}
              className={`px-4 py-2 rounded-lg shadow-md ${occurrence === occ ? "bg-black text-white" : "border"}`}
              onClick={() => setOccurrence(occurrence === occ ? "" : occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses & Total Summary Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expense List (Takes 2/3 of space) */}
        <div className="md:col-span-2">
          <ExpenseList expenses={filteredExpenses} />
        </div>

        {/* Total Spent Summary (Takes 1/3 of space) */}
        <div className="flex justify-center w-full">
          <div className="p-6 bg-blue-50 rounded-xl shadow-lg flex flex-col items-center text-center w-full max-w-md">
            <FaWallet className="text-blue-600 text-5xl mb-3 mt-10" />
            <h2 className="text-xl font-semibold mt-4">Total Spent</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">€{totalFilteredExpenses.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">Filtered expenses total</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ExpenseManager;
