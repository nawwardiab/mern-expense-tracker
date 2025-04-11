import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/reusable/Navbar";
import Footer from "../components/Footer";
import Aside from "../components/reusable/Aside";
import { AuthContext } from "../contexts/AuthContext";

const Layout = () => {
  const { userState } = useContext(AuthContext);
  const { isUserLoggedin } = userState;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Sidebar if user is logged in */}
        {isUserLoggedin && (
          <div className="hidden md:flex w-64 flex-shrink-0">
            <Aside />
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full min-h-screen pt-16">
          {/* Navbar can either always show or conditionally show */}
          {isUserLoggedin && <Navbar />}

          {/* You can add some margin/padding here if you like */}
          <main className="flex-1 p-4 overflow-auto m-3 rounded-md">
            {/* The Outlet will render the nested route's component */}
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
