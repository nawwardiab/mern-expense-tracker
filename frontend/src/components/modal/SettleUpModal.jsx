import React from "react";

const SettleUpModal = ({ data, onClose }) => {
  // data has {amount, payeeId} and whatever we pass in the parent
  const { amount, payeeId } = data;

  const handleConfirmPay = () => {
    alert(`You paid ${amount}€ to user: ${payeeId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          &times;
        </button>

        <h2 className="tet-xl font-bold mb-4">Settle Up</h2>
        <p className="mb-4">
          You owe <strong>{amount.toFixed(2)} €</strong> to user with ID:{" "}
          {payeeId}
        </p>
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
