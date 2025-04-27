import React, { createContext, useReducer } from "react";
import inviteReducer, { initialInviteState } from "../reducers/inviteReducer";

//  Create context
export const InviteContext = createContext();

//  Provider component
export const InviteProvider = ({ children }) => {
  const [inviteState, inviteDispatch] = useReducer(
    inviteReducer,
    initialInviteState
  );

  // Expose state & actions
  return (
    <InviteContext.Provider

      value={{
        inviteState,
        inviteDispatch,
      }}
    >
      {children}
    </InviteContext.Provider>
  );
};
