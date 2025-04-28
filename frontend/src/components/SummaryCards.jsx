import React, { useEffect, useContext, useState } from "react";
import { formatAmount } from "../utils/format";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { PaymentContext } from "../contexts/PaymentContext";
import { AuthContext } from "../contexts/AuthContext";
import { getAllExpenses } from "../api/expenseApi";
import { fetchUserPayments } from "../api/paymentApi";
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from "react-icons/fa";

const SummaryCards = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  const { paymentState, paymentDispatch } = useContext(PaymentContext);
  const { payments } = paymentState;
  const { userState } = useContext(AuthContext);
  const user = userState?.user;

  const [monthlyStats, setMonthlyStats] = useState({});
  const [totalStats, setTotalStats] = useState({});

  useEffect(() => {
    if (user) {
      getAllExpenses(expenseDispatch);
      fetchUserPayments(user._id, paymentDispatch);
    }
  }, [user, expenseDispatch, paymentDispatch]);

  useEffect(() => {
    if (!user) return;

    const monthlySalary = user.income || 0;
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    const today = new Date();

    const monthsSinceCreation = createdAt
      ? (today.getFullYear() - createdAt.getFullYear()) * 12 +
        (today.getMonth() - createdAt.getMonth()) +
        1
      : 1; // fallback to 1 month if createdAt missing

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const isInCurrentMonth = (dateStr) => {
      const d = new Date(dateStr);
      return d >= startOfMonth;
    };

    const calculateStats = (isMonthly = false) => {
      // Filter expenses for the period - include all recurring expenses regardless of date
      const filteredExpenses = isMonthly
        ? expenses.filter(
            (e) => e.isRecurring || isInCurrentMonth(e.transactionDate)
          )
        : expenses;

      // Filter payments for the period
      const filteredPayments = isMonthly
        ? payments?.filter((p) => isInCurrentMonth(p.createdAt))
        : payments;

      // Calculate total outgoing from expenses
      const totalExpensesOutgoing = filteredExpenses.reduce(
        (sum, e) => sum + Math.abs(Number(e.amount || 0)),
        0
      );

      // Calculate outgoing payments (payments made to others)
      const outgoingPayments =
        filteredPayments?.filter((payment) => {
          const payerId =
            typeof payment.payer === "object"
              ? payment.payer?._id
              : payment.payer;
          return payerId === user._id;
        }) || [];

      // Calculate incoming payments (payments received from others)
      const incomingPayments =
        filteredPayments?.filter((payment) => {
          const payeeId =
            typeof payment.payee === "object"
              ? payment.payee?._id
              : payment.payee;
          return payeeId === user._id;
        }) || [];

      // Sum of outgoing payments
      const totalOutgoingPayments = outgoingPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );

      // Sum of incoming payments
      const totalIncomingPayments = incomingPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );

      // Total outgoing = expenses + outgoing payments
      const totalOutgoing = totalExpensesOutgoing + totalOutgoingPayments;

      // Total incoming = salary + incoming payments
      const totalIncoming =
        (isMonthly ? monthlySalary : monthlySalary * monthsSinceCreation) +
        totalIncomingPayments;

      // Count total transactions (expenses + payments)
      const totalTransactions =
        filteredExpenses.length + (filteredPayments?.length || 0);

      return {
        totalTransactions,
        totalOutgoing,
        totalIncoming,
        totalExpensesOutgoing,
        totalOutgoingPayments,
        totalIncomingPayments,
        salary: isMonthly ? monthlySalary : monthlySalary * monthsSinceCreation,
        balance: totalIncoming - totalOutgoing,
      };
    };

    setMonthlyStats(calculateStats(true));
    setTotalStats(calculateStats(false));
  }, [expenses, payments, user]);

  return (
    <section className="grid gap-4 mb-6">
      <div className="bg-gray-300 rounded-xl p-6">
        <p className="text-lg font-semibold mb-1">Current Balance</p>
        <h2
          className={`text-4xl font-bold ${
            totalStats.balance < 0 ? "text-red-600" : "text-black"
          }`}
        >
          €{formatAmount(totalStats.balance)}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <FaExchangeAlt className="text-gray-600 mr-2" />
            <p className="text-sm font-medium">Transactions</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-2xl font-bold">
                {monthlyStats.totalTransactions || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">All Time</p>
              <p className="text-lg font-semibold">
                {totalStats.totalTransactions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <FaArrowUp className="text-red-500 mr-2" />
            <p className="text-sm font-medium">Money Out</p>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-red-500">
                €{formatAmount(monthlyStats.totalOutgoing)}
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1 mt-1 border-t pt-2 border-gray-300">
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span>€{formatAmount(monthlyStats.totalExpensesOutgoing)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payments:</span>
              <span>€{formatAmount(monthlyStats.totalOutgoingPayments)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <FaArrowDown className="text-green-500 mr-2" />
            <p className="text-sm font-medium">Money In</p>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-green-500">
                €{formatAmount(monthlyStats.totalIncoming)}
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1 mt-1 border-t pt-2 border-gray-300">
            <div className="flex justify-between">
              <span>Income:</span>
              <span>€{formatAmount(monthlyStats.salary)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payments:</span>
              <span>€{formatAmount(monthlyStats.totalIncomingPayments)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
