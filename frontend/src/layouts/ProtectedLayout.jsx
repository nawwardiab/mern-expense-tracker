import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/reusable/Navbar";
import Footer from "../components/Footer";
import Aside from "../components/reusable/Aside";

const ProtectedLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
       {/* Sidebar - Hidden on Small Screens, Visible on Medium and Larger */}
       <div className="hidden md:block">
        <Aside />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 w-full">
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

