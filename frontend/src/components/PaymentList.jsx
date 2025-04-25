import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "../contexts/PaymentContext";
import { fetchPayments, updatePayment } from "../api/paymentApi";
import { useBalance } from "../contexts/BalanceContext";
import { fetchGroupBalances } from "../api/balanceApi";

const PaymentList = ({ groupId }) => {
  const { paymentState, paymentDispatch } = useContext(PaymentContext);
  const { balanceDispatch } = useBalance();
  const { payments = [], loading, error } = paymentState; // Default to [] for payments
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSortOrder, setDateSortOrder] = useState("desc");

  const handleSortDate = () => {
    setDateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (!groupId) return;
    loadPayments();
    // eslint-disable-next-line
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
      await loadPayments();
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Payments</h2>
        {/* Payment Status Filter */}
        <select
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {!filteredPayments || filteredPayments.length === 0 ? (
        <p className="text-center text-gray-500">No payments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer select-none hover:text-purple-600 transition"
                onClick={handleSortDate}
              >
                Date
                <span className="ml-1 text-black">{dateSortOrder === "asc" ? "▲" : "▼"}</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">Payer</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Payee</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[...filteredPayments]
              .filter((pmt) => !!pmt.createdAt)
              .sort((a, b) => {

                const aDate = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const bDate = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateSortOrder === "asc"
                  ? aDate - bDate
                  : bDate - aDate;
              })
              .map((pmt) => (
                <tr key={pmt._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {pmt.createdAt
                      ? new Date(pmt.createdAt).toLocaleDateString()
                      : "No Date"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pmt.payer?.fullName || "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pmt.payee?.fullName || "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pmt.amount?.toFixed(2)} €
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pmt.notes && (
                      <div className="text-xs text-gray-500 mt-1">{pmt.notes}</div>
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
