import axios from "axios";

// Base URL can be an environment variable, e.g., process.env.REACT_APP_API_URL
const API_BASE = "http://localhost:8000/payments"; // Example

// Fetch all payments (optional: pass filters like groupId)
export async function fetchPayments(params = {}) {
  try {
    const response = await axios.get(API_BASE, { params });
    return response.data; // { success: boolean, data: [...payments] }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Get a single payment by ID
export async function getPayment(paymentId) {
  try {
    const response = await axios.get(`${API_BASE}/${paymentId}`);
    return response.data; // { success: boolean, data: {...payment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Create a new payment
export async function createPayment(payload) {
  try {
    const response = await axios.post(`${API_BASE}/create`, payload);
    return response.data; // { success: boolean, data: {...payment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}

// Update a payment (typically status or transactionId)
export async function updatePayment(paymentId, payload) {
  try {
    const response = await axios.patch(`${API_BASE}/${paymentId}`, payload);
    return response.data; // { success: boolean, data: {...updatedPayment} }
  } catch (err) {
    throw err.response?.data || err.message;
  }
}
