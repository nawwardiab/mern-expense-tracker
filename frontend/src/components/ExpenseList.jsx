import React, { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import ExpenseDetail from "./modal/ExpenseDetail";
import ExpenseItem from "./reusable/ExpenseItem";

const ExpenseList = ({ search, category, occurrence }) => {
  // 1) Pull out context for global state/dispatch if needed
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { selectedExpense, expenses } = expenseState;

  // Derived states: the filtered list and the total
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // 2) Local state for controlling the detail modal visibility
  const [showDetail, setShowDetail] = useState(false);

  console.log("🚀 ~ expenses:", expenses);
  useEffect(() => {
    let filtered = expenses;
    console.log("🚀 ~ useEffect ~ filtered:", filtered);

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

    if (filtered.length > 0) {
      // Calculate the total for the filtered list
      const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
      expenseDispatch({ type: "SET_TOTAL_FILTERED_EXPENSES", payload: total });
    }
  }, [expenses, search, category, occurrence]);

  // 3) When the user clicks an expense item, select it in global context
  const handleSelectExpense = (expense) => {
    expenseDispatch({ type: "SET_SELECTED_EXPENSE", payload: expense });
    setShowDetail(true);
  };

  // 4) If no expenses, show a fallback
  if (filteredExpenses.length === 0) {
    return <p className="text-gray-500">No expenses found.</p>;
  }
  console.log("🚀 ~ ExpenseList ~ filteredExpenses:", filteredExpenses);

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Expense List
      </h2>

      {/* 5) Render a list of ExpenseItem components */}
      <div className="flex flex-col gap-4">
        {filteredExpenses.map((exp) => (
          <ExpenseItem
            key={exp._id}
            expense={exp}
            onClick={() => handleSelectExpense(exp)}
          />
        ))}
      </div>

      {/* 6) Show the detail modal if the user selected an expense */}
      {showDetail && selectedExpense && (
        <ExpenseDetail
          expense={selectedExpense}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default ExpenseList;
