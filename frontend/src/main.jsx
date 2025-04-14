import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
// import { GlobalProvider } from "./contexts/Context"; // Global context provider
import { AuthProvider } from "./contexts/AuthContext"; // Auth context provider
import "./index.css";
import { ExpenseProvider } from "./contexts/ExpenseContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { GroupProvider } from "./contexts/GroupContext.jsx";
import { InviteProvider } from "./contexts/InviteContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ExpenseProvider>
      <GroupProvider>
        <InviteProvider>
          <PaymentProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PaymentProvider>
        </InviteProvider>
      </GroupProvider>
    </ExpenseProvider>
  </AuthProvider>
);
