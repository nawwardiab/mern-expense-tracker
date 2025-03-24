import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const LandingPageNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-10 top-0 flex justify-between items-center px-6 py-4 md:px-10">
        <h1 className="text-2xl font-bold">TRACK$</h1>
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className={`md:flex space-x-6 hidden`}>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="hover:text-gray-500"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-gray-500"
            >
              Pricing
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-gray-500"
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <ul className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4">
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="hover:text-gray-500"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-gray-500"
            >
              Pricing
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-gray-500"
            >
              Contact
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default LandingPageNavbar;
