import React, { createContext, useReducer } from "react";
import balanceReducer, {
  initialBalanceState,
} from "../reducers/balanceReducer";

//  Create context
export const BalanceContext = createContext();

//  Provider component
export const BalanceProvider = ({ children }) => {
  const [balanceState, balanceDispatch] = useReducer(
    balanceReducer,
    initialBalanceState
  );

  // Expose state & actions
  return (
    <BalanceContext.Provider
      value={{
        balanceState,
        balanceDispatch,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

// Custom hook for using the balance context
export const useBalance = () => {
  const context = React.useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
