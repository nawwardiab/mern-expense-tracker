// src/components/PaymentList.jsx
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "../contexts/PaymentContext";
import { fetchPayments, updatePayment } from "../api/paymentApi";
import { useBalance } from "../contexts/BalanceContext";
import { fetchGroupBalances } from "../api/balanceApi";

const PaymentList = ({ groupId }) => {
  const { paymentState, paymentDispatch } = useContext(PaymentContext);
  const { balanceDispatch } = useBalance();
  const { payments, loading, error } = paymentState;
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!groupId) return;
    loadPayments();
  }, [groupId]);

  const loadPayments = async () => {
    try {
      await fetchPayments(groupId, paymentDispatch);
    } catch (error) {
      console.error("Failed to load payments:", error);
    }
  };

  const handleMarkCompleted = async (paymentId) => {
    try {
      await updatePayment(paymentId, { status: "completed" }, paymentDispatch);

      // Refresh payments after update
      await loadPayments();

      // Also refresh balances after the payment is completed
      await fetchGroupBalances(groupId, balanceDispatch);
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  const filteredPayments =
    statusFilter === "all"
      ? payments
      : payments?.filter((payment) => payment.status === statusFilter);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payments</h2>
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2">
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {!filteredPayments || filteredPayments.length === 0 ? (
        <p className="text-center text-gray-500">No payments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Payer
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Payee
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((pmt) => (
              <tr key={pmt._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(pmt.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.payer?.fullName || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.payee?.fullName || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.amount.toFixed(2)} €
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                    ${
                      pmt.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : pmt.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pmt.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.status === "pending" && (
                    <button
                      onClick={() => handleMarkCompleted(pmt._id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
                    >
                      Mark Completed
                    </button>
                  )}
                  {pmt.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {pmt.notes}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentList;
