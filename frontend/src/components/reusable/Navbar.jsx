import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaBars, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications (placeholder for now)
    setNotifications(["New expense added!", "Group expense updated!"]);

    // If no user is found, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Query the backend to search expenses (we'll implement it)
    console.log("Search Query:", searchQuery);
    // Make an API call to search expenses
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {/* App logo and name */}
      <div className="text-2xl font-semibold">
        AppLogo
      </div>

      {/* Search Bar */}
      <form className="flex items-center space-x-2" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md text-black"
        />
        <button type="submit" className="p-2 text-white">
          <FaSearch />
        </button>
      </form>

      {/* Notifications Icon */}
      <div className="relative">
        <FaBell className="text-2xl" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {notifications.length}
          </span>
        )}
      </div>

      {/* User Profile Picture */}
      <div>
        <img
          src={user?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden" onClick={toggleMobileMenu}>
        <FaBars className="text-2xl cursor-pointer" />
      </div>

      {/* Desktop Menu */}
      <div className={`md:flex items-center space-x-6 ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <ul className="flex space-x-6">
          <li>
            <Link to="/expenses/group" className="hover:text-gray-300">
              Group Expense Manager
            </Link>
          </li>
          <li>
            <Link to="/expenses/add-group" className="hover:text-gray-300">
              Add Expense Group
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:text-gray-300">
              Settings
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
