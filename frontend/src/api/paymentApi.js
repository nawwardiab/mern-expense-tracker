import axios from "axios";

// Fetch all payments (optional: pass filters like groupId)
export async function fetchPayments(dispatch, groupId) {
  try {
    dispatch({ type: "PAYMENTS_REQUEST" });
    // Pass groupId in the query
    const response = await axios.get(`/payments?groupId=${groupId}`);
    dispatch({ type: "PAYMENTS_SUCCESS", payload: response.data.data });
  } catch (error) {
    dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
  }
}

// Get a single payment by ID
export async function getPayment(paymentId, dispatch) {
  try {
    dispatch({ type: "PAYMENTS_REQUEST" });

    const response = await axios.get(`/payments/${paymentId}`);
    dispatch({ type: "PAYMENTS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
  }
}

// Create a new payment
export async function createPayment(payload, dispatch) {
  try {
    dispatch({ type: "PAYMENTS_REQUEST" });
    const response = await axios.post(`/payments/create`, payload);
    dispatch({ type: "CREATE_PAYMENT_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
  }
}

// Update a payment (typically status or transactionId)
export async function updatePayment(paymentId, payload, dispatch) {
  try {
    dispatch({ type: "PAYMENTS_REQUEST" });
    const response = await axios.patch(`/payments/${paymentId}`, payload);
    dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
  }
}
