import React, { createContext, useReducer, useEffect } from "react";
import userReducer, { initialUserState } from "../reducers/userReducer";
import notificationReducer, { initialNotificationState } from "../reducers/notificationReducer";
import { getMyData } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);
  const [notificationState, notificationDispatch] = useReducer(notificationReducer, initialNotificationState);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getMyData(userDispatch);  
   
      if (user && user.notificationSettings) {
      

        notificationDispatch({
          type: "INITIALIZE_NOTIFICATIONS",
          payload: user.notificationSettings,
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userState,
        userDispatch,
        notificationState,
        notificationDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
