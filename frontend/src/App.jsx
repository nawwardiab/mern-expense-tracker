import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import ExpenseManager from "./pages/ExpenseManager";
import GroupExpenses from "./pages/GroupExpenses";

import SettingPage from "./pages/SettingPage";
import { AuthContext } from "./contexts/AuthContext";
import { useGlobalContext } from "./contexts/Context"; 
import ProtectedLayout from "./layouts/ProtectedLayout"; 
import MinimalLayout from "./layouts/MinimalLayout";


const ProtectedRoute = ({ children }) => {
  const { user, loading, checkAuth } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      checkAuth();
    }
  }, [user, checkAuth]);

  if (loading || !user || Object.keys(user).length === 0) {
    return <p>Loading user data...</p>;
  }

  if (!user.isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (user.isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/homepage" replace />;
  }

  return children;
};



function App() {
  return (
    <Routes>
      {/* Landing Page with Minimal Navbar */}
      <Route
        path="/"
        element={
          <MinimalLayout>
            <LandingPage />
          </MinimalLayout>
        }
      />

      {/* Public Routes (No Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Onboarding Route: Users who completed onboarding should be redirected */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes with Navbar */}
      <Route
        path="/homepage"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        </Route>

      <Route
        path="/expense-manager"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExpenseManager />} />
      </Route>
      
      <Route
        path="/expenses/group"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GroupExpenses />} />
      </Route>

     

      {/* Settings Page with a Minimal Navbar */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SettingPage />} />
      </Route>

    </Routes>
  );
}

export default App;
