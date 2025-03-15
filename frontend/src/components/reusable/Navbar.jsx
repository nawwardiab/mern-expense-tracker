import React, { useState, useEffect ,useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaBars, FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications, IoIosAddCircle } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications (placeholder for now)
    setNotifications(["New expense added!", "Group expense updated!"]);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Search Query:", searchQuery);
    // TODO: Make an API call to search expenses
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="h-16 flex justify-between gap-20 items-center p-4 bg-gray-100 text-white shadow-md">
      {/* App logo */}
     
      <h1 className="text-2xl text-black font-bold">Track$</h1>
      {/* Search Bar */}
      <form className="hidden md:flex grow items-center space-x-2 bg-white rounded-lg px-3 py-1 text-black">
        <FaSearch className="text-gray-500" />
        <input
          type="text "
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none bg-transparent text-sm"
        />
      </form>

      <div className="hidden md:flex justify-between items-baseline  w-48 mr-16">
        {/* Notifications Icon */}
        <div className="relative cursor-pointer">
          <IoIosNotifications className="text-2xl text-gray-700 hover:text-black block py-2 md:py-0 " />
          {/**  {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {notifications.length}
          </span>
        )} */}
        </div>
        {/* Group  add Expense Icon */}
        <div className="relative curser-pointer">
          <IoIosAddCircle
            className="text-2xl text-gray-700 hover:text-black block py-2 md:py-0 "
            onClick={() => navigate("/expenses")}
          />
        </div>
        {/* Group Expense Manager Icon */}
        <div className="relative curser-pointer">
          <FaUserGroup className="text-2xl text-gray-700 hover:text-black block py-2 md:py-0 "
          onClick={() => navigate("/expenses/group")}/>
        </div>

        {/* User Profile Picture */}
        <div className="hidden md:block">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User profile"
              className="w-10 h-10 rounded-full border-2 border-gray-900"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <RxAvatar className="text-gray-900 w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer" onClick={toggleMobileMenu}>
        <FaBars className="text-2xl text-red-800" />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-4 text-xs font-thin bg-gray-600 p-4 rounded-lg shadow-md md:hidden">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link to="/expenses/group" className="hover:text-white hover:underline underline-offset.4">
                Group Expense Manager
              </Link>
            </li>
            <li>
              <Link to="/expenses/add-group" className="hover:text-white hover:underline underline-offset.4">
                Add Expense Group
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-white hover:underline underline-offset.4">
                Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-white hover:underline underline-offset.4">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
