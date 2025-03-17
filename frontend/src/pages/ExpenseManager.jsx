import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("/expenses", {
        params: { search, category, dateFrom, dateTo },
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">Manage your expenses</h1>

      {/* Search & Filter Button */}
      <div className="flex gap-4 my-6">
        <input
          type="text"
          placeholder="Search expenses"
          className="border p-3 flex-1 rounded-lg shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchExpenses}
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md"
        >
          Filter
        </button>
      </div>

      {/* Popular Categories */}
      <div className="my-6">
        <h2 className="font-semibold text-lg">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-3">
          {["Fixed", "Group Expenses", "Food&Drinks", "Entertainment", "Subscriptions", "Others"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md ${category === cat ? "bg-black text-white" : "border"
                }`}
              onClick={() => setCategory(cat)}
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
              className="px-4 py-2 border rounded-lg shadow-md"
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="my-8">
        <h2 className="font-semibold text-lg">Expense List</h2>
        <div className="border rounded-lg shadow-md">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense._id} className="flex justify-between p-4 border-b">
                <span className="text-lg">{expense.title}</span>
                <span className="font-bold text-lg">${expense.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-center p-4">No expenses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
