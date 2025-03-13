import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userReducer, initialUserState } from "../reducers/userReducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    dispatch({ type: "LOADING" });
    try {
      const { data } = await axios.get("/users/");
      dispatch({ type: "AUTH_CHECK", payload: data });
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch({ type: "AUTH_CHECK", payload: null });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      await axios.post("/users/login", { email, password });
      await checkAuth();

      // Redirect based on onboarding status
      navigate(state.user?.completedOnboarding ? "/dashboard" : "/onboarding");
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Signup function
  const signup = async (fullName, email, password) => {
    try {
      await axios.post("/users/register", { fullName, email, password });
      await checkAuth();
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  // Logout function with redirection
  const logout = async () => {
    try {
      await axios.get("/users/logout");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user: state.user, signup, login, logout, loading: state.loading }}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
};


