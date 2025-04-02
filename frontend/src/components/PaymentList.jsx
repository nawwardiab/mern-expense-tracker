// src/components/PaymentList.jsx
import React, { useContext, useEffect } from "react";
import { PaymentContext } from "../contexts/PaymentContext";

const PaymentList = () => {
  const { payments, loading, error, loadPayments, modifyPayment } =
    useContext(PaymentContext);

  useEffect(() => {
    // Load all payments on component mount
    loadPayments();
  }, [loadPayments]);

  const handleMarkCompleted = (paymentId) => {
    modifyPayment(paymentId, { status: "completed" });
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Payer</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pmt) => (
              <tr key={pmt._id}>
                <td>{pmt.payer?.fullName || pmt.payer?.email}</td>
                <td>{pmt.payee?.fullName || pmt.payee?.email}</td>
                <td>
                  {pmt.amount} {pmt.currency}
                </td>
                <td>{pmt.status}</td>
                <td>
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
    </div>
  );
};

export default PaymentList;
