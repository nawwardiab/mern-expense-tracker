import axios from "axios";

// Fetch all payments (optional: pass filters like groupId)
export async function fetchPayments(groupId, dispatch) {
  try {
    if (dispatch) dispatch({ type: "PAYMENTS_REQUEST" });

    // Pass groupId in the query
    const response = await axios.get(`/payments?groupId=${groupId}`);

    if (dispatch) {
      dispatch({ type: "PAYMENTS_SUCCESS", payload: response.data.data });
    }

    return response.data.data;
  } catch (error) {
    if (dispatch) {
      dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
    }
    console.error("Failed to fetch payments:", error);
    throw error;
  }
}

// Get a single payment by ID
export async function getPayment(paymentId, dispatch) {
  try {
    if (dispatch) dispatch({ type: "PAYMENTS_REQUEST" });

    const response = await axios.get(`/payments/${paymentId}`);

    if (dispatch) {
      dispatch({ type: "PAYMENTS_SUCCESS", payload: response.data });
    }

    return response.data;
  } catch (error) {
    if (dispatch) {
      dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
    }
    console.error("Failed to fetch payment:", error);
    throw error;
  }
}

// Create a new payment
export async function createPayment(payload, dispatch) {
  try {
    if (dispatch) dispatch({ type: "PAYMENTS_REQUEST" });

    const response = await axios.post(`/payments/create`, payload);

    if (dispatch) {
      dispatch({ type: "CREATE_PAYMENT_SUCCESS", payload: response.data });
    }

    return response.data;
  } catch (error) {
    if (dispatch) {
      dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
    }
    console.error("Payment creation failed:", error);
    throw error;
  }
}

// Update a payment (typically status or transactionId)
export async function updatePayment(paymentId, payload, dispatch) {
  try {
    if (dispatch) dispatch({ type: "PAYMENTS_REQUEST" });

    const response = await axios.patch(`/payments/${paymentId}`, payload);

    if (dispatch) {
      dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: response.data });
    }

    return response.data;
  } catch (error) {
    if (dispatch) {
      dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
    }
    console.error("Payment update failed:", error);
    throw error;
  }
}

// Fetch payments related to a user (both as payer and payee)
export async function fetchUserPayments(userId, dispatch) {
  try {
    if (dispatch) dispatch({ type: "PAYMENTS_REQUEST" });

    // First, get payments where user is the payer
    const outgoingResponse = await axios.get(`/payments?userId=${userId}`);

    // Then, get payments where user is the payee
    const incomingResponse = await axios.get(
      `/payments/received?userId=${userId}`
    );

    // Combine both results
    const allPayments = [
      ...outgoingResponse.data.data,
      ...incomingResponse.data.data,
    ];

    if (dispatch) {
      dispatch({ type: "PAYMENTS_SUCCESS", payload: allPayments });
    }

    return allPayments;
  } catch (error) {
    if (dispatch) {
      dispatch({ type: "PAYMENTS_FAILURE", payload: error.message });
    }
    console.error("Failed to fetch user payments:", error);
    throw error;
  }
}
