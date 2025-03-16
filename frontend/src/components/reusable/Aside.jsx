import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserFriends, FaCog, FaDonate } from "react-icons/fa";
import { MdOutlinePayment, MdLogout } from "react-icons/md";

const Aside = () => {
  const location = useLocation();

  // Function to format the current page name
  const getPageName = () => {
    const path = location.pathname.split("/")[1]; // Extract first part of path
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard"; // Capitalize
  };

  return (
    <aside className="w-64 bg-gray-200 text-white fixed h-screen">
      {/* Section 1 - Current Page Name */}
      <div className="h-16 flex items-center justify-center shadow-md">
        <h2 className="text-lg font-semibold text-black">{getPageName()}</h2>
      </div>

      {/* Section 2 - Navigation Links */}
      <nav className="flex flex-col justify-between h-full p-4">
        {/**nav section 1 */}
        <div className="space-y-4 flex-grow ">
          <Link
            to="/homepage"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4 rounded text-sm text-black font-semibold"
          >
            <FaHome className="text-lg" /> Home
          </Link>
          <Link
            to="/expense-manager"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4 rounded text-sm text-black font-semibold"
          >
            <FaDonate className="text-lg" /> Manage Expenses
          </Link>
          <Link
            to="/expenses/group"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4  rounded text-sm text-black font-semibold"
          >
            <FaUserFriends className="text-lg" /> Group Events
          </Link>
          <Link
            to="/homepage"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4 rounded text-sm text-black font-semibold"
          >
            <MdOutlinePayment className="text-lg" /> Financial Overview
          </Link>
        </div>

        {/**nav section 2 */}
        <div className=" mb-32">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4  rounded text-sm text-black font-semibold"
          >
            <FaCog className="text-lg" /> Settings
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 p-2 hover:underline underline-offset-4  rounded text-sm text-black font-semibold"
          >
            <MdLogout className="text-lg" /> Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Aside;
