import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setDropdownOpen(false); // Close dropdown when mobile menu is opened
    }
  };

  return (
    <nav className="relative bg-white lg:flex max-w-7xl mx-auto justify-end items-center p-4 lg:py-6 text-black">
      {/* Logo positioned to the left and partially outside navbar */}
      <div className="absolute left-64 top-1 z-20 hidden lg:block">
        <img
          src="https://alshaheen.pro/wp-content/uploads/2023/09/cropped-AlshaheenManpower_1_page-0001.jpg"
          alt="Logo"
          className="h-28"
        />
      </div>

      {/* Hamburger icon for mobile */}
      <button
        className="lg:hidden text-DarkRed text-2xl z-50 relative"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navbar Links for Desktop */}
      <div className="hidden lg:flex space-x-8">
        <a href="/" className="hover:underline text-DarkRed font-semibold hover:text-lightgreen">Home</a>
        <a href="#about" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">About Us</a>
        <div className="relative">
          <button
            className="hover:underline font-semibold hover:text-lightgreen text-DarkRed flex items-center"
            onClick={toggleDropdown}
          >
            Services
            {dropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </button>
          {dropdownOpen && (
            <div className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md">
              <a href="/aviation" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Aviation</a>
              <a href="/construction" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Construction</a>
              <a href="/events" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Events</a>
              <a href="/healthCare" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">HealthCare</a>
              <a href="/hospitality" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Hospitality</a>
              <a href="/logistics" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Logistics</a>
              <a href="/manufacturing" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Manufacturing</a>
              <a href="/retail" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Retail</a>
              <a href="/security" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Security</a>
            </div>
          )}
        </div>
        <a href="/" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">Training</a>
        <a href="#insights" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">News</a>
        <a href="#contact" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">Find a Job</a>
        <a href="/contactUs" className="hover:underline text-DarkRed font-semibold hover:text-lightgreen">Contact Us</a>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white shadow-lg transform ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <ul className="flex flex-col items-center justify-center h-full space-y-6 p-4">
          <li><a href="/" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Home</a></li>
          <li><a href="#about" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">About Us</a></li>
          <li className="relative w-full text-center">
            <button
              className="font-semibold hover:text-lightgreen text-DarkRed flex items-center justify-center w-full text-2xl"
              onClick={toggleDropdown}
            >
              Services
              {dropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {dropdownOpen && (
              <ul className="mt-2 space-y-2 text-lg">
                <li><a href="/aviation" className="block text-black hover:text-lightgreen">Aviation</a></li>
                <li><a href="/construction" className="block text-black hover:text-lightgreen">Construction</a></li>
                <li><a href="/events" className="block text-black hover:text-lightgreen">Events</a></li>
                <li><a href="/healthCare" className="block text-black hover:text-lightgreen">HealthCare</a></li>
                <li><a href="/hospitality" className="block text-black hover:text-lightgreen">Hospitality</a></li>
                <li><a href="/logistics" className="block text-black hover:text-lightgreen">Logistics</a></li>
                <li><a href="/manufacturing" className="block text-black hover:text-lightgreen">Manufacturing</a></li>
                <li><a href="/retail" className="block text-black hover:text-lightgreen">Retail</a></li>
                <li><a href="/security" className="block text-black hover:text-lightgreen">Security</a></li>
              </ul>
            )}
          </li>
          <li><a href="/" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">Training</a></li>
          <li><a href="#insights" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">News</a></li>
          <li><a href="#contact" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">Find a Job</a></li>
          <li><a href="/contactUs" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
