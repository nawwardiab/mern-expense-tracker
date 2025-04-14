import axios from "axios";

// Fetch all payments (optional: pass filters like groupId)
export async function fetchPayments(params = {}) {
  try {
    const response = await axios.get("/payments", { params });
    return response.data; // { success: boolean, data: [...payments] }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Get a single payment by ID
export async function getPayment(paymentId) {
  try {
    const response = await axios.get(`/payments/${paymentId}`);
    return response.data; // { success: boolean, data: {...payment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Create a new payment
export async function createPayment(payload) {
  try {
    const response = await axios.post(`/payments/create`, payload);
    return response.data; // { success: boolean, data: {...payment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Update a payment (typically status or transactionId)
export async function updatePayment(paymentId, payload) {
  try {
    const response = await axios.patch(`/payments/${paymentId}`, payload);
    return response.data; // { success: boolean, data: {...updatedPayment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}
