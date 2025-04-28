import React, { useContext, useEffect } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { AuthContext } from "../contexts/AuthContext";
import ExpenseItem from "./reusable/ExpenseItem";
import { getAllExpenses } from "../api/expenseApi";

const TransactionList = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { userState } = useContext(AuthContext);
  const { expenses } = expenseState;
  const { user } = userState;

  useEffect(() => {
    getAllExpenses(expenseDispatch);
  }, [expenseDispatch]);

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const groupedTransactions = expenses.reduce((acc, transaction) => {
    // Handle recurring expenses separately
    if (transaction.isRecurring) {
      if (!acc["Recurring Expenses"]) acc["Recurring Expenses"] = [];
      acc["Recurring Expenses"].push(transaction);
      return acc;
    }

    // Handle regular expenses as before
    const transactionDate = new Date(transaction.transactionDate);
    const transactionDateString = isNaN(transactionDate)
      ? ""
      : transactionDate.toISOString().split("T")[0];
    const isPending =
      transactionDate > today &&
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;

    if (isPending) {
      if (!acc["Pending Transactions"]) acc["Pending Transactions"] = [];
      acc["Pending Transactions"].push(transaction);
    } else if (transactionDateString === todayDateString) {
      if (!acc["Today's Transactions"]) acc["Today's Transactions"] = [];
      acc["Today's Transactions"].push(transaction);
    } else {
      if (!acc[transactionDateString]) acc[transactionDateString] = [];
      acc[transactionDateString].push(transaction);
    }
    return acc;
  }, {});

  // Add monthly income as a recurring transaction
  if (user && user.income && parseFloat(user.income) > 0) {
    const incomeAmount = parseFloat(user.income);
    const incomeTransaction = {
      _id: "monthly-income",
      title: "Monthly Income",
      amount: incomeAmount,
      category: "Income",
      isRecurring: true,
      recurringFrequency: "monthly",
      isIncome: true,
    };

    if (!groupedTransactions["Recurring Expenses"]) {
      groupedTransactions["Recurring Expenses"] = [];
    }
    groupedTransactions["Recurring Expenses"].push(incomeTransaction);
  }

  const orderedSections = [
    "Recurring Expenses",
    "Pending Transactions",
    "Today's Transactions",
    ...Object.keys(groupedTransactions)
      .filter(
        (section) =>
          section !== "Recurring Expenses" &&
          section !== "Pending Transactions" &&
          section !== "Today's Transactions"
      )
      .sort((a, b) => new Date(b) - new Date(a)),
  ];

  return (
    <aside className="w-full md:max-w-sm p-4">
      {/** <h2 className="text-xl font-bold mb-4">Transaction Summary</h2> */}

      {orderedSections.map((section, i) => (
        <div key={i} className="mb-6">
          <h3 className="font-semibold text-gray-600 text-xs sm:text-sm mb-2">
            {section}
          </h3>
          <div className="space-y-2">
            {groupedTransactions[section] &&
            groupedTransactions[section].length > 0 ? (
              groupedTransactions[section].map((expense) => (
                <ExpenseItem
                  key={expense._id}
                  expense={expense}
                  transactionState={section}
                  inExpenseManager={false}
                />
              ))
            ) : section === "Today's Transactions" ? (
              <p className="text-gray-500 text-xs sm:text-sm italic">
                No expenses today
              </p>
            ) : null}
          </div>
        </div>
      ))}

      <p className="text-xs sm:text-sm text-gray-500 mt-2 cursor-pointer hover:underline">
        See more...
      </p>
    </aside>
  );
};

export default TransactionList;
