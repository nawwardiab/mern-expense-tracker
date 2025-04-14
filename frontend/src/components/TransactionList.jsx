import React, { useContext, useEffect } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import ExpenseItem from "./reusable/ExpenseItem";
import { getAllExpenses } from "../api/expenseApi";

const TransactionList = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  useEffect(() => {
    getAllExpenses(expenseDispatch);
  }, [expenseDispatch]);

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const groupedTransactions = expenses.reduce((acc, transaction) => {
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
  
  const orderedSections = [
    "Pending Transactions",
    "Today's Transactions",
    ...Object.keys(groupedTransactions)
      .filter(
        (section) =>
          section !== "Pending Transactions" && section !== "Today's Transactions"
      )
      .sort((a, b) => new Date(b) - new Date(a)),
  ];

  return (
    <aside className="w-full md:max-w-sm p-4">
     {/** <h2 className="text-xl font-bold mb-4">Transaction Summary</h2> */}

      {orderedSections.map((section, i) => (
        <div key={i} className="mb-6">
          <h3 className="font-semibold text-gray-600 text-xs sm:text-sm mb-2">{section}</h3>
          <div className="space-y-2">
            {groupedTransactions[section] && groupedTransactions[section].length > 0 ? (
              groupedTransactions[section].map((expense) => (
                <ExpenseItem
                  key={expense._id}
                  expense={expense}
                  transactionState={section}
                  onClick={() => {
                    expenseDispatch({ type: "SET_SELECTED_EXPENSE", payload: expense });
                    expenseDispatch({ type: "OPEN_MODAL" });
                  }}
                />
              ))
            ) : section === "Today's Transactions" ? (
              <p className="text-gray-500 text-xs sm:text-sm italic">No expenses today</p>
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


