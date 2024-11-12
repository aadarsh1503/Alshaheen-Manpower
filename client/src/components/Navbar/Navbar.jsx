// Navbar.jsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import the icons

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white flex justify-between items-center p-4 text-black">
      <div className="logo"> {/* Add your logo here */}
        <img src="https://alshaheen.pro/wp-content/uploads/2023/09/cropped-AlshaheenManpower_1_page-0001.jpg" alt="Logo" className="h-16 ml-56" />
      </div>
      <div className="flex font- space-x-8">
        <a href="/" className="hover:underline font-semibold">Home</a>
        <a href="#about" className="hover:underline font-semibold text-DarkRed">About Us</a>
        <div className="relative">
          <button 
            className="hover:underline font-semibold text-DarkRed flex items-center" 
            onClick={toggleDropdown}
          >
            Services
            {/* Toggle the icon based on dropdown state */}
            {dropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 font-raleway mt-8 bg-white shadow-lg  w-32 rounded-md">
              <a href="/aviation" className="block px-4  text-black hover:bg-gray-100">Aviation</a>
              <a href="#service2" className="block px-4  text-black hover:bg-gray-100">Service 2</a>
              <a href="#service1" className="block px-4  text-black hover:bg-gray-100">Service 1</a>
              <a href="#service2" className="block px-4  text-black hover:bg-gray-100">Service 2</a>
              <a href="#service1" className="block px-4  text-black hover:bg-gray-100">Service 1</a>
              <a href="#service2" className="block px-4  text-black hover:bg-gray-100">Service 2</a>
              <a href="#service1" className="block px-4  text-black hover:bg-gray-100">Service 1</a>
              <a href="#service2" className="block px-4  text-black hover:bg-gray-100">Service 2</a>
              <a href="#service1" className="block px-4  text-black hover:bg-gray-100">Service 1</a>
              <a href="#service2" className="block px-4  text-black hover:bg-gray-100">Service 2</a>
            </div>
          )}
        </div>
        <a href="#expertise" className="hover:underline font-semibold text-DarkRed">Training</a>
        <a href="#insights" className="hover:underline font-semibold text-DarkRed">News</a>
        <a href="#contact" className="hover:underline font-semibold text-DarkRed">Find a Job</a>
        <a href="/contactUs" className="hover:underline font-semibold text-black">Contact Us</a>
      </div>
      <div className="flex space-x-3">
        {/* Social Media Icons */}
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-linkedin"></i>
        <i className="fab fa-twitter"></i>
      </div>
    </nav>
  );
};

export default Navbar;
