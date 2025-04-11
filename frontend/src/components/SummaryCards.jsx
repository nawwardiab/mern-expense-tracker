import React, { useEffect, useState, useContext } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { getAllExpenses } from "../api/expenseApi";

const SummaryCards = () => {
  const { expenseDispatch, expenseState } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      await getAllExpenses(expenseDispatch); // Fetches all expenses from the backend and updates context state
      calculateSummary(expenses); // Calculate totals after fetching expenses
    };

    fetchExpenses();
  }, [expenseDispatch, expenses]);

  const calculateSummary = (expenses) => {
    let income = 0;
    let expensesTotal = 0;

    expenses.forEach(expense => {
      if (expense.amount > 0) {
        income += expense.amount;
      } else {
        expensesTotal += Math.abs(expense.amount); // Convert negative values to positive
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expensesTotal);
    setCurrentBalance(income - expensesTotal);
  };

  return (
    <section className="grid gap-4 mb-6">
      {/* Balance Card */}
      <div className="bg-gray-300 rounded-xl p-6">
        <p className="text-lg font-semibold mb-1">Current Balance</p>
        <h2 className="text-4xl font-bold">${currentBalance.toFixed(2)}</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium">All Transactions</p>
          <p className="text-lg font-semibold">{expenses.length}</p>
        </div>
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium">Total Income</p>
          <p className="text-lg font-semibold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-sm font-medium">Total Expenses</p>
          <p className="text-lg font-semibold">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards
