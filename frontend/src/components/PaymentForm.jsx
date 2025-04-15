// src/components/PaymentForm.jsx
import React, { useState, useContext } from "react";
import { PaymentContext } from "../contexts/PaymentContext";
import { createPayment } from "../api/paymentApi";
import { FaTimes } from "react-icons/fa";

const PaymentForm = ({ groupId, onClose }) => {
  const [formData, setFormData] = useState({
    groupId: "",
    payer: "",
    payee: "",
    amount: 0,
    paymentMethod: "cash",
    currency: "EUR",
  });

  const { paymentState, paymentDispatch } = useContext(PaymentContext);
  const { error, loading } = paymentState;
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, groupId };
    await createPayment(payload, paymentDispatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Create Payment</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Payer:</label>
            <input
              type="text"
              name="payer"
              className="w-full border p-2 rounded"
              value={formData.payer}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Payee:</label>
            <input
              type="text"
              name="payee"
              className="w-full border p-2 rounded"
              value={formData.payee}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Amount:</label>
            <input
              type="number"
              name="amount"
              className="w-full border p-2 rounded"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">
              Payment Method:
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
