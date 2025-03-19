import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExpenseList from "../components/ExpenseList";
import { FaFilter, FaWallet } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { setAxiosDefaults } from "../utils/axiosConfig";
import { AuthContext } from "../contexts/AuthContext";

// Apply Axios default settings
setAxiosDefaults();

const ExpenseManager = () => {

  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalFilteredExpenses, setTotalFilteredExpenses] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


  useEffect(() => {
    fetchExpenses();
  }, []);

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

  useEffect(() => {
    let filtered = expenses;
    if (search) {
      filtered = filtered.filter((expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }
    if (occurrence) {
      filtered = filtered.filter((expense) => expense.recurringFrequency === occurrence.toLowerCase());
    }
    setFilteredExpenses(filtered);
    updateTotalSpent(filtered);
  }, [search, category, occurrence, expenses]);

  const updateTotalSpent = (filteredData) => {
    const total = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalFilteredExpenses(total);
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currencyCode] || currencyCode; // Default: return the currency code if not found
  };


  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
        Manage your expenses
      </h1>

      {/* Search Input */}
      <div className="relative flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex gap-4 my-6 items-center relative ">
        <input
          type="text"
          placeholder="Search expenses..."
          className="border p-3 flex-1 rounded-lg shadow-md pr-12 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TbListSearch className="absolute right-4 text-gray-500 text-4xl" />
      </div>
      </div>

      {/* Filters Section */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 mt-3">
          {["Fixed", "Group Expenses", "Food&Drinks", "Entertainment", "Subscriptions", "Others"].map((cat) => (
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

      {/* Occurrence Filters */}
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

      {/* Expenses & Total Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List (Takes full width on mobile, 2/3 on larger screens) */}
        <div className="lg:col-span-2">
          <ExpenseList expenses={filteredExpenses} />
        </div>

        {/* Total Spent Summary (Takes full width on mobile, 1/3 on larger screens) */}
        <div className="flex justify-center w-full">
          <div className="p-5 bg-blue-50 rounded-xl shadow-lg flex flex-col items-center text-center w-full max-w-md">
            <FaWallet className="text-blue-600 text-5xl mb-3 mt-10" />
            <h2 className="text-xl font-semibold mt-4">Total Spent</h2>

             {/* ✅ Show correct currency symbol dynamically */}
             <p className="text-3xl font-bold text-gray-800 mt-2">
              {getCurrencySymbol(user?.currency)}{totalFilteredExpenses.toFixed(2)}
            </p>

            <p className="text-sm text-gray-600 mt-2">Filtered expenses total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;

