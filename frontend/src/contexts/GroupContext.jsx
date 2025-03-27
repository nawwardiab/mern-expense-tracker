// src/contexts/GroupContext.jsx
import React, { createContext, useReducer } from "react";
import groupReducer, { initialGroupState } from "../reducers/groupReducer";

//  Create context
export const GroupContext = createContext(null);

//  Provider component
export const GroupProvider = ({ children }) => {
  const [groupState, groupDispatch] = useReducer(
    groupReducer,
    initialGroupState
  );
  console.log("selceted Group", groupState.selectedGroup);

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
