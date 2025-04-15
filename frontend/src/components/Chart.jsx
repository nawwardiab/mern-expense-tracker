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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChart = () => {
  const { userState } = useContext(AuthContext);
  const { expenseState } = useContext(ExpenseContext);
  const { payments } = useContext(PaymentContext);

  const user = userState?.user;
  const expenses = expenseState?.expenses || [];

  const [chartData, setChartData] = useState(null);

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

    // Expenses
    const monthlyOutgoing = expenses
      .filter((e) => isInCurrentMonth(e.transactionDate))
      .reduce((sum, e) => sum + Math.abs(Number(e.amount || 0)), 0);

    const totalOutgoing = expenses.reduce(
      (sum, e) => sum + Math.abs(Number(e.amount || 0)),
      0
    );

    // Payments
    const monthlyIncomingFromPayments = payments
      ?.filter((p) => isInCurrentMonth(p.createdAt))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalIncomingFromPayments = payments?.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const monthlyIncoming = monthlyIncomingFromPayments + salary;
    const totalIncoming =
      totalIncomingFromPayments + salary * monthsSinceCreation;

    setChartData({
      labels: ["Incoming", "Outgoing"],
      datasets: [
        {
          label: "This Month",
          data: [monthlyIncoming, monthlyOutgoing],
          backgroundColor: "rgba(86, 88, 88, 0.6)",
        },
        {
          label: "Total",
          data: [totalIncoming, totalOutgoing],
          backgroundColor: "rgba(201, 199, 206, 0.6)",
        },
      ],
    });
  }, [user, expenses, payments]);

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/**   <h2 className="text-lg font-semibold mb-4"> Income vs Expense Chart</h2> */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `€${val}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DashboardChart;
