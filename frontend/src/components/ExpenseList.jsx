import React, { useState } from "react";
import ExpenseDetail from "../components/modal/ExpenseDetail.jsx";

const ExpenseList = ({ expenses }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const formatDate = (dateString, isRecurring, recurringFrequency) => {
    if (isRecurring && recurringFrequency) {
      return `${
        recurringFrequency.charAt(0).toUpperCase() + recurringFrequency.slice(1)
      }`;
    }

    const date = new Date(dateString);

    if (isNaN(date)) return "Invalid Date";

    // Format as dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Expense List
      </h2>

      {/* Expense Table */}
      <div className="border rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full text-left border-collapse hidden sm:table">
          {/* Table Header */}
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr className="text-gray-600 uppercase text-xs sm:text-sm tracking-wider">
              <th className="px-4 sm:px-6 py-3">Title</th>
              <th className="px-4 sm:px-6 py-3">Amount</th>
              <th className="px-4 sm:px-6 py-3 text-center">Category</th>
              <th className="px-4 sm:px-6 py-3 text-right">Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-t text-gray-800 hover:bg-gray-50 transition"
                >
                  <td
                    className="px-4 sm:px-6 py-4 text-gray-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    {expense.title}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-green-600">
                    €{expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {formatDate(
                      expense.transactionDate,
                      expense.isRecurring,
                      expense.recurringFrequency
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Mobile View (Cards) */}
        <div className="sm:hidden">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div
                key={expense._id}
                className="border-b py-4 px-4 flex flex-col gap-2 bg-white"
              >
                <div
                  className="text-gray-700 font-semibold text-lg cursor-pointer hover:underline"
                  onClick={() => setSelectedExpense(expense)}
                >
                  {expense.title}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-bold text-green-600">
                    €{expense.amount.toFixed(2)}
                  </span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {expense.category}
                  </span>
                  <span>
                    {formatDate(
                      expense.transactionDate,
                      expense.isRecurring,
                      expense.recurringFrequency
                    )}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500">No expenses found.</p>
          )}
        </div>
      </div>

      {/* ✅ Show Modal when an expense is selected */}
      {selectedExpense && (
        <ExpenseDetail
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
};

export default ExpenseList;
