import React, { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import ExpenseItem from "./reusable/ExpenseItem";
import { getAllExpenses } from "../api/expenseApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FilteredTransactionList = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { groupState } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { expenses } = expenseState;
  const { groups } = groupState;
  const { user } = userState;

  // Filter states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState("all"); // "all", "private", "group"

  // Month navigation
  const previousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);

    // Don't allow navigation beyond current month
    if (nextMonthDate <= new Date()) {
      setCurrentDate(nextMonthDate);
    }
  };

  // Format current month/year for display
  const formattedMonthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Fetch expenses
  useEffect(() => {
    getAllExpenses(expenseDispatch);
  }, [expenseDispatch]);

  // Filter transactions by selected month and type
  const filteredTransactions = React.useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];

    // Filter by month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    let filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.transactionDate);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });

    // Filter by type (private or group)
    if (filterType === "private") {
      filtered = filtered.filter((expense) => !expense.groupId);
    } else if (filterType === "group") {
      filtered = filtered.filter((expense) => expense.groupId);
    }

    return filtered;
  }, [expenses, currentDate, filterType]);

  // Group by transaction status and date
  const groupedTransactions = React.useMemo(() => {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return filteredTransactions.reduce((acc, transaction) => {
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
  }, [filteredTransactions]);

  // Order sections with pending and today first
  const orderedSections = React.useMemo(() => {
    return [
      "Pending Transactions",
      "Today's Transactions",
      ...Object.keys(groupedTransactions)
        .filter(
          (section) =>
            section !== "Pending Transactions" &&
            section !== "Today's Transactions"
        )
        .sort((a, b) => new Date(b) - new Date(a)),
    ];
  }, [groupedTransactions]);

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Transaction List</h3>

        <div className="flex items-center">
          <button
            onClick={previousMonth}
            className="p-1 rounded hover:bg-gray-200"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          <span className="mx-2 font-medium">{formattedMonthYear}</span>

          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-200"
            disabled={
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
            }
          >
            <FaChevronRight
              className={`${
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Transaction Type Filter */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filterType === "all"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filterType === "private"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setFilterType("private")}
        >
          Private
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filterType === "group"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setFilterType("group")}
        >
          Group
        </button>
      </div>

      {/* Transactions */}
      {orderedSections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No transactions found for this period.
        </p>
      ) : (
        orderedSections.map((section, i) => (
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
                    isGroupExpense={!!expense.groupId}
                    onClick={() => {
                      expenseDispatch({
                        type: "SET_SELECTED_EXPENSE",
                        payload: expense,
                      });
                      expenseDispatch({ type: "OPEN_MODAL" });
                    }}
                  />
                ))
              ) : section === "Today's Transactions" ? (
                <p className="text-gray-500 text-xs sm:text-sm italic">
                  No expenses today
                </p>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FilteredTransactionList;
