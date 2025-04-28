import React, { useEffect, useState } from "react";
import { getPayment } from "../../api/paymentApi";
import { FaTimes } from "react-icons/fa";

const PaymentDetail = ({ paymentId, onClose }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const data = await getPayment(paymentId);
        setPayment(data.data);
      } catch (err) {
        console.error("Error fetching payment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  if (loading)
    return <div className="text-center p-4">Loading payment details...</div>;
  if (!payment) return <div className="text-center p-4">Payment not found</div>;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Payment Details</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600">From</p>
            <p className="font-medium">
              {payment.payer?.fullName || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-gray-600">To</p>
            <p className="font-medium">
              {payment.payee?.fullName || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-bold text-lg">€{payment.amount.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-gray-600">Date</p>
            <p>{new Date(payment.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-gray-600">Status</p>
            <p
              className={
                payment.status === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </p>
          </div>

          {payment.notes && (
            <div>
              <p className="text-gray-600">Notes</p>
              <p>{payment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
