import React, { useEffect, useContext, useState } from "react";
import { formatAmount } from "../utils/format";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { PaymentContext } from "../contexts/PaymentContext";
import { AuthContext } from "../contexts/AuthContext";
import { getAllExpenses } from "../api/expenseApi";

const SummaryCards = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { expenses } = expenseState;

  const { payments, loadPayments } = useContext(PaymentContext);
  const { userState } = useContext(AuthContext);
  const user = userState?.user;

  const [monthlyStats, setMonthlyStats] = useState({});
  const [totalStats, setTotalStats] = useState({});

  useEffect(() => {
    if (user) {
      getAllExpenses(expenseDispatch);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const monthlySalary = Number(user.income || 0);
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    const today = new Date();

    const monthsSinceCreation = createdAt
      ? (today.getFullYear() - createdAt.getFullYear()) * 12 +
        (today.getMonth() - createdAt.getMonth()) + 1
      : 1; // fallback to 1 month if createdAt missing

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const isInCurrentMonth = (dateStr) => {
      const d = new Date(dateStr);
      return d >= startOfMonth;
    };

    const calculateStats = (isMonthly = false) => {
      const filteredExpenses = isMonthly
        ? expenses.filter((e) => isInCurrentMonth(e.transactionDate))
        : expenses;

      const filteredPayments = isMonthly
        ? payments.filter((p) => isInCurrentMonth(p.createdAt))
        : payments;

      const totalOutgoing = filteredExpenses.reduce(
        (sum, e) => sum + Math.abs(Number(e.amount || 0)),
        0
      );

      const totalIncomingFromPayments = filteredPayments.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0
      );

      const totalIncoming = isMonthly
        ? totalIncomingFromPayments + monthlySalary
        : totalIncomingFromPayments + monthlySalary * monthsSinceCreation;

      const totalTransactions = filteredExpenses.length;

      return {
        totalTransactions,
        totalOutgoing,
        totalIncoming,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-1">All Transactions</p>
          <p className="text-md">
            <strong>{monthlyStats.totalTransactions || 0}</strong><span className="text-xs font-thin text-gray-800"> /Month</span> 
          </p>
          <p className="text-md">
            <strong>{totalStats.totalTransactions || 0}</strong><span className="text-xs font-thin text-gray-800"> /total</span> 
          </p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-1">Total Outgoing</p>
          <p className="text-md text-red-500">
            €{formatAmount(monthlyStats.totalOutgoing)}<span className="text-xs font-thin text-gray-800"> /Month</span> 
          </p>
          <p className="text-sm text-red-700 mt-4">
            €{formatAmount(totalStats.totalOutgoing)}<span className="text-xs font-thin text-gray-800"> /total</span> 
          </p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-1">Total Incoming</p>
          <p className="text-md text-green-600">
            €{formatAmount(monthlyStats.totalOutgoing)}<span className="text-xs font-thin text-gray-800"> /Month</span> 
          </p>
          <p className="text-sm text-green-700 mt-4">
            €{formatAmount(totalStats.totalIncoming)}<span className="text-xs font-thin text-gray-800"> /total</span> 
          </p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-1">Net Savings</p>
          <p className="text-md font-semibold">
            €{formatAmount(monthlyStats.totalIncoming - monthlyStats.totalOutgoing)}<span className="text-xs font-thin text-gray-800"> /Month</span> 
          </p>
        </div>
      </div>
    </section>
  );
};


export default SummaryCards



















  

