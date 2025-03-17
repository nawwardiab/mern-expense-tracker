import React from "react";
import { useNavigate } from "react-router-dom";

const ExpenseItem = ({ expense }) => {
const navigate =useNavigate()

  // Function to navigate to the ExpenseDetail page
  const handleNavigate = () => {
    navigate(`/expense/${expense.id}`, { state: { expense } });
  };
  
  return (
    <div
      className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
      onClick={handleNavigate}
    >
      {/* Expense Icon & Details */}
      <div className="flex items-center gap-4">
        <div className="bg-black text-white p-3 rounded-full">
          {/* Example: Food & Drink Icon */}
          🍽️
        </div>
        <div>
          <h3 className="font-bold text-lg">{expense.name}</h3>
          <p className="text-gray-500">{expense.category}</p>
        </div>
      </div>

      {/* Expense Amount - Styled Dynamically */}
      <span
        className={`text-lg font-bold ${
          expense.amount < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {expense.amount < 0 ? `-$${Math.abs(expense.amount)}` : `$${expense.amount}`}
      </span>
    </div>
  );
};

export default ExpenseItem;