import React, { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import { PaymentContext } from "../contexts/PaymentContext";
import ExpenseItem from "./reusable/ExpenseItem";
import { getAllExpenses } from "../api/expenseApi";
import { fetchUserPayments } from "../api/paymentApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FilteredTransactionList = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { groupState } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { paymentState, paymentDispatch } = useContext(PaymentContext);

  const { expenses } = expenseState;
  const { payments } = paymentState;
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

  // Fetch both expenses and payments
  useEffect(() => {
    getAllExpenses(expenseDispatch);
    if (user && user._id) {
      fetchUserPayments(user._id, paymentDispatch);
    }
  }, [expenseDispatch, paymentDispatch, user]);

  // Define the unified transaction source (combine expenses and payments)
  const allTransactions = React.useMemo(() => {
    // Regular expenses
    const regularExpenses = expenses || [];

    // Group payments (both incoming and outgoing)
    const paymentTransactions = payments || [];

    // Transform payments into transaction-like format
    const formattedPayments = paymentTransactions.map((payment) => {
      // Check if payment is incoming (user is payee) or outgoing (user is payer)
      const payeeId =
        typeof payment.payee === "object" ? payment.payee?._id : payment.payee;
      const isIncoming = payeeId === user?._id;

      // Get group info
      const groupId =
        typeof payment.groupId === "object"
          ? payment.groupId?._id
          : payment.groupId;
      const group = groups?.find((g) => g._id === groupId);

      // Get user info for display
      const payerName =
        typeof payment.payer === "object"
          ? payment.payer?.fullName
          : "Group Member";
      const payeeName =
        typeof payment.payee === "object"
          ? payment.payee?.fullName
          : "Group Member";

      return {
        _id: payment._id,
        title: isIncoming
          ? `Payment from ${payerName}`
          : `Payment to ${payeeName}`,
        amount: isIncoming ? Number(payment.amount) : -Number(payment.amount),
        transactionDate: payment.createdAt || new Date(),
        category: "Group Payment",
        groupId,
        groupName: group?.name || "Group",
        isPayment: true,
        paymentData: payment,
      };
    });

    // Combine both sources
    return [...regularExpenses, ...formattedPayments];
  }, [expenses, payments, groups, user]);

  // Update the filtered transactions to use allTransactions instead of just expenses
  const filteredTransactions = React.useMemo(() => {
    if (!allTransactions || !Array.isArray(allTransactions)) return [];

    // Add monthly income as a transaction
    let transactions = [...allTransactions];

    // Add monthly income only if user has income set
    if (user && user.income && parseFloat(user.income) > 0) {
      const incomeAmount = parseFloat(user.income);
      const incomeTransaction = {
        _id: "monthly-income",
        title: "Monthly Income",
        amount: incomeAmount, // Income is a positive number
        category: "Income",
        isRecurring: true,
        recurringFrequency: "monthly",
        isIncome: true, // Explicitly mark as income
      };

      transactions.push(incomeTransaction);
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    let filtered = transactions.filter((transaction) => {
      // Always include recurring transactions
      if (transaction.isRecurring) return true;

      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });

    if (filterType === "private") {
      filtered = filtered.filter(
        (transaction) =>
          (!transaction.groupId && !transaction.isPayment) ||
          transaction.isIncome
      );
    } else if (filterType === "group") {
      filtered = filtered.filter(
        (transaction) => transaction.groupId || transaction.isPayment
      );
    }

    return filtered;
  }, [allTransactions, currentDate, filterType, user]);

  // Group by transaction status and date
  const groupedTransactions = React.useMemo(() => {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return filteredTransactions.reduce((acc, transaction) => {
      // Handle recurring expenses separately
      if (transaction.isRecurring) {
        if (!acc["Recurring Expenses"]) acc["Recurring Expenses"] = [];
        acc["Recurring Expenses"].push(transaction);
        return acc;
      }

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
  }, [groupedTransactions]);

  const handleTransactionClick = (transaction) => {
    if (transaction.isPayment) {
      // Open payment details modal
      paymentDispatch({
        type: "SET_SELECTED_PAYMENT",
        payload: transaction.paymentData?._id || transaction._id,
      });
      paymentDispatch({ type: "OPEN_PAYMENT_MODAL" });
    } else {
      // Regular expense handling
      expenseDispatch({
        type: "SET_SELECTED_EXPENSE",
        payload: transaction,
      });
      expenseDispatch({ type: "OPEN_MODAL" });
    }
  };

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
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filterType === "private"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setFilterType("private")}
        >
          Private
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filterType === "group"
              ? "border-b-2 border-indigo-600 text-indigo-600"
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
                    onClick={() => handleTransactionClick(expense)}
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
