import React from "react";
import { mockExpenses } from "../components/reusable/mockExpenses.jsx";
import ExpenseItem from "../components/reusable/ExpenseItem.jsx";

const HomePage = () => {
  return (
    <div>
      <h1 className=" flex justify-center text-7xl text-blue-800">HomePage</h1>;
      <div className="space-y-4">
        {mockExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
