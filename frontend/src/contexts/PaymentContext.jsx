import React, { createContext, useReducer } from "react";
import paymentReducer, {
  initialPaymentState,
} from "../reducers/paymentReducer";

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [paymentState, paymentDispatch] = useReducer(
    paymentReducer,
    initialPaymentState
  );

  const value = {
    paymentState,
    paymentDispatch,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}
