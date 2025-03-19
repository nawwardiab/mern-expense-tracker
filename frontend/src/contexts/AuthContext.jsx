import React, {
  createContext,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userReducer, initialUserState } from "../reducers/userReducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const navigate = useNavigate();

  // Function to check authentication
  const checkAuth = async () => {
    dispatch({ type: "LOADING" });

    try {
      const response = await axios.get("/users/profile", {
        withCredentials: true,
      });

      if (!response.data || !response.data.user) {
        dispatch({ type: "AUTH_CHECK", payload: null });
        return;
      }

      const user = response.data.user;

      // Only update state if the user data actually changes
      if (JSON.stringify(state.user) !== JSON.stringify(user)) {
        dispatch({ type: "AUTH_CHECK", payload: user });
      } else {
        console.log("⚠️ Skipping state update (no changes).");
      }
    } catch (error) {
      console.error(
        "Auth check failed:",
        error.response?.data || error.message
      );
      dispatch({ type: "AUTH_CHECK", payload: null });
    }
  };

  // Only call checkAuth once when component mounts
  useEffect(() => {
    checkAuth();
  }, []); 

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/users/login", { email, password });

      const user = data.data;
      dispatch({ type: "AUTH_CHECK", payload: user });

      navigate(user.isOnboarded ? "/homepage" : "/onboarding");
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

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/users/logout");
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user || {},
        checkAuth,
        signup,
        login,
        logout,
        loading: state.loading,
      }}
    >
      {!state.loading && children}
    </AuthContext.Provider>
  );
};
