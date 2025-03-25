import React, { createContext, useReducer } from "react";
import paymentReducer, { initialState } from "../reducers/paymentReducer";
import { fetchPayments, createPayment, updatePayment } from "../api/paymentApi";

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [paymentState, paymentDispatch] = useReducer(
    paymentReducer,
    initialState
  );

  // Example action to load all payments
  const loadPayments = async (params = {}) => {
    paymentDispatch({ type: "PAYMENTS_REQUEST" });
    try {
      const result = await fetchPayments(params);
      // result should be { success: true, data: [...] }
      paymentDispatch({ type: "PAYMENTS_SUCCESS", payload: result.data });
    } catch (err) {
      paymentDispatch({ type: "PAYMENTS_FAILURE", payload: err });
    }
  };

  // Create a payment
  const addPayment = async (paymentData) => {
    paymentDispatch({ type: "PAYMENTS_REQUEST" });
    try {
      const result = await createPayment(paymentData);
      paymentDispatch({ type: "CREATE_PAYMENT_SUCCESS", payload: result.data });
    } catch (err) {
      paymentDispatch({ type: "PAYMENTS_FAILURE", payload: err });
    }
  };

  // Update payment (e.g. mark completed)
  const modifyPayment = async (paymentId, updateData) => {
    paymentDispatch({ type: "PAYMENTS_REQUEST" });
    try {
      const result = await updatePayment(paymentId, updateData);
      paymentDispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: result.data });
    } catch (err) {
      paymentDispatch({ type: "PAYMENTS_FAILURE", payload: err });
    }
  };

  const value = {
    payments: paymentState.payments,
    loading: paymentState.loading,
    error: paymentState.error,
    loadPayments,
    addPayment,
    modifyPayment,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}
