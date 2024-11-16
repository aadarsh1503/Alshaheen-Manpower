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
      <div className="absolute left-1 top-1 z-20 hidden lg:block">
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
        <a href="/about" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">About Us</a>
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
              <a href="/recruitment" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Recruitment</a>
              <a href="/pre-employment" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Pre-Employment</a>
              <a href="/placements" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Placements</a>
              <a href="/visas" className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100">Visas</a>

            </div>
          )}
        </div>
        <a href="/training" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">Training</a>
        <a href="/newsEvents" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">News</a>
        <ul class="list-none">
  <li>
    <a 
      href="https://www.talentportal.bh/#pills-home" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-red-500 font-raleway  hover:underline"
    >
      Find a Job
    </a>
  </li>
</ul>

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
          <li><a href="/about" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">About Us</a></li>
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
                <li><a href="/recruitment" className="block text-black hover:text-lightgreen">Recruitment</a></li>
                <li><a href="/pre-employment" className="block text-black hover:text-lightgreen">Pre-Employment</a></li>
                <li><a href="/placements" className="block text-black hover:text-lightgreen">Placements</a></li>
                <li><a href="/visas" className="block text-black hover:text-lightgreen">Visas</a></li>
              </ul>
            )}
          </li>
          <li><a href="/training" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">Training</a></li>
          <li><a href="/newsEvents" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">News</a></li>
          <ul class="list-none">
  <li>
    <a 
      href="https://www.talentportal.bh/#pills-home" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-red-500 font-raleway  hover:underline"
    >
      Find a Job
    </a>
  </li>
</ul>

          <li><a href="/contactUs" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
