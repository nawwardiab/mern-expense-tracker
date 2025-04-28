import React, { createContext, useReducer } from "react";
import groupReducer, { initialGroupState } from "../reducers/groupReducer";

//  Create context
export const GroupContext = createContext();

//  Provider component
export const GroupProvider = ({ children }) => {
  const [groupState, groupDispatch] = useReducer(
    groupReducer,
    initialGroupState
  );

  // Expose state & actions
  return (
    <GroupContext.Provider
      value={{
        groupState,
        groupDispatch,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
