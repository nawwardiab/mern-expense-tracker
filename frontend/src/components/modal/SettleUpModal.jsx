import React, { useState } from "react";

const SettleUpModal = ({ data, onClose, onConfirmPayment }) => {
  // data has { amount, payeeId, payeeName }
  const { payeeId, payeeName } = data;
  // Keep a local "amount" state, default to data.amount
  const [amount, setAmount] = useState(data.amount);

  const handleConfirmPay = () => {
    onConfirmPayment({ payeeId, payeeName, amount });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Settle Up</h2>
        <p className="mb-4">
          You owe <strong>{amount.toFixed(2)} €</strong> to {payeeName}
        </p>

        <label className="block mb-1">Amount to Pay:</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setAmount(isNaN(val) ? 0 : val);
          }}
          className="border p-1 rounded mb-4 w-full"
        />

        <button
          onClick={handleConfirmPay}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default SettleUpModal;
