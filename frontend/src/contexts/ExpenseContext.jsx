// src/contexts/ExpenseContext.jsx
import React, { createContext, useReducer } from "react";
import expenseReducer, {
  initialExpenseState,
} from "../reducers/expenseReducer";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenseState, expenseDispatch] = useReducer(
    expenseReducer,
    initialExpenseState
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenseState,
        expenseDispatch,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
