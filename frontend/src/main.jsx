import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
// import { GlobalProvider } from "./contexts/Context"; // Global context provider
import { AuthProvider } from "./contexts/AuthContext"; // Auth context provider
import "./index.css";
import { ExpenseProvider } from "./contexts/ExpenseContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ExpenseProvider>
      <PaymentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PaymentProvider>
    </ExpenseProvider>
  </AuthProvider>
);
