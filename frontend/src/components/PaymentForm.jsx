// src/components/PaymentForm.jsx
import React, { useState, useContext } from "react";
import { PaymentContext } from "../contexts/PaymentContext";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    groupId: "",
    payer: "",
    payee: "",
    amount: 0,
    paymentMethod: "cash",
    currency: "EUR",
  });

  const { addPayment, loading, error } = useContext(PaymentContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPayment(formData);
  };

  return (
    <div>
      <h2>Create Payment</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group ID:</label>
          <input
            type="text"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Payer (User ID):</label>
          <input
            type="text"
            name="payer"
            value={formData.payer}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Payee (User ID):</label>
          <input
            type="text"
            name="payee"
            value={formData.payee}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Payment Method:</label>
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
        <div>
          <label>Currency:</label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
