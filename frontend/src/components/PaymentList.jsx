// src/components/PaymentList.jsx
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "../contexts/PaymentContext";
import { fetchPayments } from "../api/paymentApi";
import PaymentForm from "./PaymentForm";

const PaymentList = ({ groupId }) => {
  console.log("🚀 ~ PaymentList ~ groupId:", groupId);
  const { paymentState, paymentDispatch } = useContext(PaymentContext);
  const { payments, loading, error } = paymentState;

  const [showPaymentFormModal, setShowPaymentFormModal] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    // pass groupId as a query param
    fetchPayments(paymentDispatch, groupId);
  }, [groupId]);

  const handleListPaymentClick = () => {
    setShowPaymentFormModal(true);
  };

  const handleMarkCompleted = (paymentId) => {
    modifyPayment(paymentId, { status: "completed" });
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold mb-4">Payments</h2>
        <button
          className="bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
          onClick={handleListPaymentClick}
        >
          Inform Group About your Payment
        </button>
      </div>
      {payments?.length === 0 ? (
        <p className="text-center text-gray-500">No payments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((pmt) => (
              <tr key={pmt._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.payer?.fullName || pmt.payer?.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.payee?.fullName || pmt.payee?.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.amount} {pmt.currency}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {pmt.status !== "completed" && (
                    <button onClick={() => handleMarkCompleted(pmt._id)}>
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showPaymentFormModal && (
        <PaymentForm
          groupId={groupId}
          onClose={() => setShowPaymentFormModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentList;
