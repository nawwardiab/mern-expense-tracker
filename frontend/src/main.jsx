import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
// import { GlobalProvider } from "./contexts/Context"; // Global context provider
import { AuthProvider } from "./contexts/AuthContext";
import { ExpenseProvider } from "./contexts/ExpenseContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { GroupProvider } from "./contexts/GroupContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <ExpenseProvider>
        <GroupProvider>
          <PaymentProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PaymentProvider>
        </GroupProvider>
      </ExpenseProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
