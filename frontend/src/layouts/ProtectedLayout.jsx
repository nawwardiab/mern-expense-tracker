import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/reusable/Navbar";
import Footer from "../components/Footer";
import Aside from "../components/reusable/Aside";

const ProtectedLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Main Content Container */}
      <div className="flex flex-1">
        {/* Sidebar - Visible on Medium Screens and Larger */}
        <div className="hidden md:flex w-64 flex-shrink-0">
          <Aside />
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <Navbar />
          <main className="flex-1 p-4 overflow-auto m-6 rounded-md">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer (Spanning Full Width) */}
      <Footer />
    </div>
  );
};

export default ProtectedLayout;



