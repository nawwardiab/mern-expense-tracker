import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaBars, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications, IoIosAddCircle } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import AddExpense from "../modal/AddExpense";
import { logout } from "../../api/authApi.js";

const Navbar = () => {
  const { userState, notificationState } = useContext(AuthContext);
  const { notificationCount, notificationSettings } = notificationState;
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobileMenu(); // Close menu on logout
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  return (
    <>
      <nav className="h-16 flex justify-between gap-20 items-center p-4 bg-gray-100 text-white shadow-md relative">
        {/* App logo */}
        <h1 className="text-2xl text-black font-bold">Track$</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-baseline w-48 mr-16">
          <IoIosAddCircle
            className="text-2xl text-gray-700 hover:text-black cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <FaUserGroup
            className="text-2xl text-gray-700 hover:text-black cursor-pointer"
            onClick={() => navigate("/expenses/group")}
          />

          {/* Notification Icon with Dropdown */}
          <div className="relative cursor-pointer">
            <div onClick={toggleNotificationDropdown} className="relative">
              <IoIosNotifications
                className="text-2xl text-gray-700 hover:text-black"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white rounded-full text-xs h-5 w-5">
                  {notificationCount}
                </span>
              )}
            </div>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b font-bold">Notifications</div>
                <div className="p-4 flex flex-col gap-2">
                  {notificationSettings && Object.keys(notificationSettings).map((key) => (
                    notificationSettings[key] && (
                      <div key={key} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                        {key === "expenseAlerts" && "You have new expense alerts!"}
                        {key === "communityUpdates" && "New community updates available!"}
                        {key === "paymentReminders" && "You have pending payment reminders!"}
                        {key === "featureAnnouncements" && "New features have been announced!"}
                      </div>
                    )
                  ))}
                  {notificationCount === 0 && (
                    <div className="p-2 text-center text-gray-500">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {userState.user?.profilePicture ? (
            <img
              src={userState.user.profilePicture}
              alt="User profile"
              className="w-10 h-10 rounded-full border-2 border-gray-900"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <RxAvatar className="text-gray-900 w-6 h-6" />
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={toggleMobileMenu}>
          <FaBars className="text-2xl text-gray-800" />
        </div>
      </nav>

      {/* Expense Modal (conditionally rendered) */}
      {isModalOpen && (
        <AddExpense
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;

