import React, { useContext, useState } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import ExpenseDetail from "./modal/ExpenseDetail";
import ExpenseItem from "./reusable/ExpenseItem";

const ExpenseList = ({ expenses }) => {
  // 1) Pull out context for global state/dispatch if needed
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { selectedExpense } = expenseState;

  // 2) Local state for controlling the detail modal visibility
  const [showDetail, setShowDetail] = useState(false);

  // 3) When the user clicks an expense item, select it in global context
  const handleSelectExpense = (expense) => {
    expenseDispatch({ type: "SET_SELECTED_EXPENSE", payload: expense });
    setShowDetail(true);
  };

  // 4) If no expenses, show a fallback
  if (!expenses.length) {
    return <p className="text-gray-500">No expenses found.</p>;
  }

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Expense List
      </h2>

      {/* 5) Render a list of ExpenseItem components */}
      <div className="flex flex-col gap-4">
        {expenses.map((exp) => (
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
