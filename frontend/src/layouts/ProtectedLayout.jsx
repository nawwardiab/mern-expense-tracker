import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/reusable/Navbar";
import Footer from "../components/Footer";
import Aside from "../components/reusable/Aside";

const ProtectedLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ProtectedLayout;

