import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // Close menu on mobile after click
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-bold cursor-pointer">Track$</h1>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <ul
        className={`md:flex space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none md:flex-row flex-col items-center p-4 md:p-0 transition-transform transform ${
          isOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"
        }`}
      >
        <li>
          <button onClick={() => handleScrollTo("services")} className="text-gray-700 hover:text-black block py-2 md:py-0">Services</button>
        </li>
        <li>
          <button onClick={() => handleScrollTo("pricing")} className="text-gray-700 hover:text-black block py-2 md:py-0">Pricing</button>
        </li>
        <li>
          <button onClick={() => handleScrollTo("contact")} className="text-gray-700 hover:text-black block py-2 md:py-0">Contact</button>
        </li>
      </ul>

   
    </nav>
  );
};

export default Navbar;