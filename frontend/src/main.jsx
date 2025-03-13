import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { GlobalProvider } from "./contexts/Context"; // Import the global context provider
import { setAxiosDefaults } from "./utils/axiosConfig";
import "./index.css";

// Apply global axios settings
setAxiosDefaults();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);

