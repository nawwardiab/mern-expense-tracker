import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../contexts/AuthContext";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { PaymentContext } from "../contexts/PaymentContext";
import { fetchUserPayments } from "../api/paymentApi";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChart = () => {
  const { userState } = useContext(AuthContext);
  const { expenseState } = useContext(ExpenseContext);
  const { paymentState, paymentDispatch } = useContext(PaymentContext);

  const user = userState?.user;
  const expenses = expenseState?.expenses || [];
  const payments = paymentState?.payments || [];

  const [chartData, setChartData] = useState(null);
  const [activeView, setActiveView] = useState("monthly"); // "monthly" or "breakdown"

  // Fetch payments if not already loaded
  useEffect(() => {
    if (user && user._id && (!payments || payments.length === 0)) {
      fetchUserPayments(user._id, paymentDispatch);
    }
  }, [user, payments, paymentDispatch]);

  useEffect(() => {
    if (!user) return;

    const salary = Number(user.income || 0);
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    const today = new Date();

    // 👇 fallback to 1 month if createdAt missing
    const monthsSinceCreation = createdAt
      ? (today.getFullYear() - createdAt.getFullYear()) * 12 +
        (today.getMonth() - createdAt.getMonth()) +
        1
      : 1;

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const isInCurrentMonth = (dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfMonth;
    };

    // Regular Expenses
    const monthlyExpenses = expenses
      .filter((e) => isInCurrentMonth(e.transactionDate))
      .reduce((sum, e) => sum + Math.abs(Number(e.amount || 0)), 0);

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Math.abs(Number(e.amount || 0)),
      0
    );

    // Outgoing Payments (user is payer)
    const outgoingPayments = payments.filter((payment) => {
      const payerId =
        typeof payment.payer === "object" ? payment.payer?._id : payment.payer;
      return payerId === user._id;
    });

    const monthlyOutgoingPayments = outgoingPayments
      .filter((p) => isInCurrentMonth(p.createdAt))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalOutgoingPayments = outgoingPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    // Incoming Payments (user is payee)
    const incomingPayments = payments.filter((payment) => {
      const payeeId =
        typeof payment.payee === "object" ? payment.payee?._id : payment.payee;
      return payeeId === user._id;
    });

    const monthlyIncomingPayments = incomingPayments
      .filter((p) => isInCurrentMonth(p.createdAt))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalIncomingPayments = incomingPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    // Monthly totals
    const monthlyOutgoing = monthlyExpenses + monthlyOutgoingPayments;
    const monthlyIncoming = salary + monthlyIncomingPayments;

    // Total (all-time) totals
    const totalOutgoing = totalExpenses + totalOutgoingPayments;
    const totalIncoming = salary * monthsSinceCreation + totalIncomingPayments;

    setChartData({
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Monthly Total",
          data: [monthlyIncoming, monthlyOutgoing],
          backgroundColor: "rgba(53, 162, 235, 0.7)",
          barPercentage: 0.7,
        },
        {
          label: "All-Time Total",
          data: [totalIncoming, totalOutgoing],
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          barPercentage: 0.7,
        },
        {
          label: "Monthly Salary",
          data: [salary, 0],
          backgroundColor: "rgba(88, 80, 141, 0.7)",
          barPercentage: 0.5,
          stack: "monthly_breakdown",
          hidden: activeView !== "breakdown",
        },
        {
          label: "Monthly Incoming Payments",
          data: [monthlyIncomingPayments, 0],
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          barPercentage: 0.5,
          stack: "monthly_breakdown",
          hidden: activeView !== "breakdown",
        },
        {
          label: "Monthly Expenses",
          data: [0, monthlyExpenses],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          barPercentage: 0.5,
          stack: "monthly_breakdown",
          hidden: activeView !== "breakdown",
        },
        {
          label: "Monthly Outgoing Payments",
          data: [0, monthlyOutgoingPayments],
          backgroundColor: "rgba(255, 159, 64, 0.7)",
          barPercentage: 0.5,
          stack: "monthly_breakdown",
          hidden: activeView !== "breakdown",
        },
      ],
    });
  }, [user, expenses, payments, activeView]);

  const toggleView = () => {
    setActiveView((prev) => (prev === "monthly" ? "breakdown" : "monthly"));
  };

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Income vs Expense</h2>

        <div className="flex items-center">
          <button
            onClick={toggleView}
            className="text-sm bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded mr-2 transition-colors"
          >
            {activeView === "monthly" ? "Show Breakdown" : "Show Summary"}
          </button>

          <div className="text-sm text-gray-500 flex items-center flex-wrap gap-2">
            {activeView === "monthly" ? (
              <>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(53,162,235,0.7)] rounded-full mr-1"></span>
                  <span>Monthly</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(75,192,192,0.7)] rounded-full mr-1"></span>
                  <span>All-Time</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(88,80,141,0.7)] rounded-full mr-1"></span>
                  <span>Salary</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(153,102,255,0.7)] rounded-full mr-1"></span>
                  <span>Income</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(255,99,132,0.7)] rounded-full mr-1"></span>
                  <span>Expenses</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[rgba(255,159,64,0.7)] rounded-full mr-1"></span>
                  <span>Payments</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function (context) {
                  // Simple label for category
                  return context[0].label;
                },
                label: function (context) {
                  const label = context.dataset.label || "";
                  const value = context.raw;
                  return `${label}: €${value.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                callback: (val) => `€${val}`,
                font: {
                  size: 11,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          animation: {
            duration: 500,
          },
        }}
      />

      <div className="mt-4 text-center text-xs text-gray-500">
        {activeView === "monthly"
          ? "Showing monthly and all-time summary"
          : "Showing detailed breakdown of monthly figures"}
      </div>
    </div>
  );
};

export default DashboardChart;
