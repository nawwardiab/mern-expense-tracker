import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layouts/Layout"; // The merged layout
import { AuthContext } from "../contexts/AuthContext";

// Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPassword from "../pages/ForgotPassword";
import OnboardingPage from "../pages/OnboardingPage";
import HomePage from "../pages/HomePage";
import ExpenseManager from "../pages/ExpenseManager";
import GroupExpenses from "../pages/GroupExpenses";
import SettingPage from "../pages/SettingPage";
import ValidateInvitePage from "../components/InvitePage";
import PageNotFound from "../pages/PageNotFound";

export default function AppRoutes() {
  const { userState } = useContext(AuthContext);
  const { user } = userState;

  return (
    <Routes>
      {/* The top-level Layout wraps all routes in the same UI */}
      <Route index element={<LandingPage />} />
      {/* Public-ish routes (or partially protected) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      {/* Onboarding page requires user but not onboarded */}

      <Route
        path="onboarding"
        element={!user?.isOnboarded && <OnboardingPage />}
      />
      <Route path="invite/:token" element={<ValidateInvitePage />} />
      <Route path="/" element={<Layout />}>
        {/* Fully protected routes */}
        <Route path="homepage" element={<HomePage />} />
        <Route path="expense-manager" element={<ExpenseManager />} />
        <Route path="expenses/group" element={<GroupExpenses />} />
        <Route path="settings" element={<SettingPage />} />

        {/* Catch-all or 404 route (optional) */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
