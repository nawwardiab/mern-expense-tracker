import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import ExpenseManager from "./pages/ExpenseManager";
import GroupExpenses from "./pages/GroupExpenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import SettingPage from "./pages/SettingPage";
import { AuthContext } from "./contexts/AuthContext";
import { useGlobalContext } from "./contexts/Context"; // Import Global Context
import ProtectedLayout from "./layouts/ProtectedLayout"; // Import Layout
import MinimalLayout from "./layouts/MinimalLayout";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log("User:", user);

  if (loading) return <p>Loading...</p>; //Prevents premature redirection

  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* landindigPage with minimal Navbar */}

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
      <Route path="/onboarding" element={<OnboardingPage />} />

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
            <ProtectedLayout/>
            
          </ProtectedRoute>
        }
      >
        <Route index element={<GroupExpenses />} />
      </Route>

      <Route
        path="/expenses/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExpenseDetail />} />
      </Route>

      {/* Settings Page with a Minimal Navbar 
   
      />*/}

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
