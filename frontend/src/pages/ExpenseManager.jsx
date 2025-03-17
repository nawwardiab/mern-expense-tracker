import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseList from "../components/ExpenseList";
import { FaFilter } from "react-icons/fa"; // ✅ Import Filter Icon
import { setAxiosDefaults } from "../utils/axiosConfig";

// Apply Axios default settings
setAxiosDefaults();

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]); // Stores all expenses
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Stores filtered results
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occurrence, setOccurrence] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 🔹 Fetch ALL expenses once when component loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to Fetch Expenses from Backend (NO FILTERS)
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("/expenses", { withCredentials: true }); // ✅ Fetch all expenses
      setExpenses(data.data); // ✅ Store all expenses in state
      setFilteredExpenses(data.data); // ✅ Initially set filtered list to show all
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error);
    }
  };

  // 🔹 Function to Filter Expenses in the Frontend
  useEffect(() => {
    let filtered = expenses;

    // ✅ Apply Search Filter (Case-Insensitive)
    if (search) {
      filtered = filtered.filter((expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✅ Apply Category Filter
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }

    // ✅ Apply Occurrence Filter
    if (occurrence) {
      filtered = filtered.filter((expense) => expense.recurringFrequency === occurrence.toLowerCase());
    }

    setFilteredExpenses(filtered); // ✅ Update filtered state
  }, [search, category, occurrence, expenses]); // ✅ Runs when filters change

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">Manage your expenses</h1>

      {/* Search & Filter Button */}
      <div className="flex gap-4 my-6 items-center">
        <input
          type="text"
          placeholder="Search expenses"
          className="border p-3 flex-1 rounded-lg shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // ✅ Filters dynamically
        />
        <button
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
          onClick={fetchExpenses} // ✅ Apply Filters
        >
          <FaFilter className="text-white text-lg" /> {/* ✅ Filter Icon */}
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
              onClick={() => setCategory(category === cat ? "" : cat)} // ✅ Toggle selection
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
              onClick={() => setOccurrence(occurrence === occ ? "" : occ)} // ✅ Toggle selection
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List Component */}
      <ExpenseList expenses={filteredExpenses} /> {/* ✅ Uses filtered data */}
    </div>
  );
};

export default ExpenseManager;
