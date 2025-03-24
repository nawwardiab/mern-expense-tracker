import React, { createContext, useReducer, useEffect } from "react";
import userReducer, { initialUserState } from "../reducers/userReducer";
import { getMyData } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    getMyData(userDispatch);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userState,
        userDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
