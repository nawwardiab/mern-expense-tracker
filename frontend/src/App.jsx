import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import ExpenseManager from "./pages/ExpenseManager";
import GroupExpenses from "./pages/GroupExpenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import SettingPage from "./pages/SettingPage";
import { useGlobalContext } from "./contexts/Context"; // Import Global Context

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useGlobalContext(); // Access user from global state

  if (loading) return <div>Loading...</div>; // Prevent flash of unauthenticated content
  if (!user) return <Navigate to="/login" />;
  if (!user.completedOnboarding) return <Navigate to="/onboarding" />;

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding (Must Complete Before Dashboard) */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected Routes */}
      <Route
        path="/homepage"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpenseManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/group"
        element={
          <ProtectedRoute>
            <GroupExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/:id"
        element={
          <ProtectedRoute>
            <ExpenseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

