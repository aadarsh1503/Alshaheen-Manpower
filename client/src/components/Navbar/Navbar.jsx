import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaBars, 
  FaTimes, 
  FaUserPlus, 
  FaMotorcycle,
  FaBriefcase 
} from 'react-icons/fa';
import i1 from "./i1.jpg";
import i21 from "./i21.jpg";

const Navbar = () => {
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [registrationDropdownOpen, setRegistrationDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleIndustryDropdown = () => setIndustryDropdownOpen(!industryDropdownOpen);
  const toggleRegistrationDropdown = () => setRegistrationDropdownOpen(!registrationDropdownOpen);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setIndustryDropdownOpen(false);
      setRegistrationDropdownOpen(false);
    }
  };

  return (
    <nav className="relative bg-white lg:flex max-w-7xl mx-auto justify-end items-center p-6 lg:py-4 text-black">
      <div className="absolute left-1 top-1 z-20 hidden lg:block">
        <img src={i21} alt="Logo" className="h-28" />
      </div>

      <button
        className="lg:hidden text-DarkRed text-2xl z-50 relative"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="hidden lg:text-md lg:flex items-center space-x-8">
        <a href="/" className="hover:underline text-DarkRed font-semibold hover:text-lightgreen">Home</a>
        <a href="/about" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">About Us</a>
        
        {/* --- INDUSTRY DROPDOWN (Corrected Logic) --- */}
        <div 
          className="relative"
          onMouseEnter={() => {
            setIndustryDropdownOpen(true);
            setRegistrationDropdownOpen(false); // Close other dropdown
          }}
          onMouseLeave={() => setIndustryDropdownOpen(false)}
        >
          <div className="hover:underline font-semibold hover:text-lightgreen text-DarkRed flex items-center cursor-pointer">
            Industries
            <span className={`ml-2 transform transition-transform duration-300 ${industryDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
              <FaChevronDown size="0.8em" />
            </span>
          </div>
          {industryDropdownOpen && (
            <div className="absolute z-50 pt-2"> {/* Added pt-2 for visual gap */}
              <div className="font-raleway bg-white shadow-lg w-48 rounded-md">
                <a href="/aviation" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Aviation</a>
                <a href="/construction" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Construction</a>
                <a href="/events" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Events</a>
                <a href="/healthcare" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Healthcare</a>
                <a href="/hospitality" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Hospitality</a>
                <a href="/logistics" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Logistics</a>
                <a href="/manufacturing" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Manufacturing</a>
                <a href="/retail" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Retail</a>
                <a href="/security" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">Security</a>
              </div>
            </div>
          )}
        </div>

        <a href="/training" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">Training</a>
        <a href="/newsEvents" className="hover:underline font-semibold hover:text-lightgreen text-DarkRed">News</a>
        <a href="/contactUs" className="hover:underline text-DarkRed font-semibold hover:text-lightgreen">Contact Us</a>
        
        {/* --- REGISTRATION DROPDOWN (Corrected Logic) --- */}
        <div 
          className="relative"
          // 1. Hover events are now on the parent container
          onMouseEnter={() => {
            setRegistrationDropdownOpen(true);
            setIndustryDropdownOpen(false); // Close other dropdown
          }}
          onMouseLeave={() => setRegistrationDropdownOpen(false)}
        >
          {/* 2. The button is just a child, with no hover events */}
          <button
            className="bg-red-600 text-white lg:text-md font-semibold hover:text-DarkRed outline hover:outline-Darkred hover:bg-white px-4 py-2 rounded-lg flex items-center transition-all duration-300"
          >
            Register 
            <span className={`ml-2 transform transition-transform duration-300 ${registrationDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
              <FaChevronDown />
            </span>
          </button>
          
          {/* 3. The dropdown is also a child inside the same parent */}
          <div 
            className={`absolute z-50 -right-4 pt-3 w-72 origin-top-right
                       transition-all duration-300 ease-in-out
                       ${registrationDropdownOpen 
                         ? 'opacity-100 scale-100' 
                         : 'opacity-0 scale-95 pointer-events-none'}`
            }
          >
            <div className="p-2 bg-white backdrop-blur-lg border border-gray-200/50 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5">
              <div className="flex flex-col space-y-1">
                <a 
                  href="/apply" 
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-red-600 hover:bg-gray-500/10 rounded-lg transition-colors duration-200"
                >
                  <FaUserPlus className="text-red-500 shrink-0" />
                  <span className="font-semibold whitespace-nowrap ">Employment registration</span>
                </a>
                <a 
                  href="/registration-form" 
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-red-600 hover:bg-gray-500/10 rounded-lg transition-colors duration-200"
                >
                  <FaMotorcycle className="text-red-500" />
                  <span className="font-semibold">Rider registration</span>
                </a>
                <a 
                  href="/internship" 
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-red-600 hover:bg-gray-500/10 rounded-lg transition-colors duration-200"
                >
                  <FaBriefcase className="text-red-500" />
                  <span className="font-semibold">Internship</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white shadow-lg transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in-out z-40`}>
        {/* ... Mobile menu JSX is fine ... */}
        <ul className="flex flex-col items-center justify-center h-full space-y-4 p-4">
          <img src={i21} alt="Logo" className="h-28" />
          <li className="relative space-y-4 w-full text-center">
            <a href="/about" className="font-semibold hover:text-lightgreen text-DarkRed flex items-center justify-center w-full text-2xl">About Us</a>
            <button
              className="font-semibold hover:text-lightgreen text-DarkRed flex items-center justify-center w-full text-2xl"
              onClick={toggleIndustryDropdown}
            >
              Industry
              {industryDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {industryDropdownOpen && (
              <ul className="mt-2 space-y-2 text-lg">
                <li><a href="/aviation" className="block text-black hover:text-lightgreen">Aviation</a></li>
                {/* ... */}
              </ul>
            )}
          </li>
          <li><a href="/training" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">Training</a></li>
          <li><a href="/newsEvents" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">News</a></li>
          <li><a href="/contactUs" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Contact Us</a></li>
          <div className="relative w-full text-center mt-4">
            <button
              className="bg-red-600 text-white text-xl font-semibold hover:text-DarkRed outline hover:outline-Darkred hover:bg-white px-4 py-2 rounded flex items-center justify-center w-auto mx-auto"
              onClick={toggleRegistrationDropdown}
            >
              Register
              {registrationDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {registrationDropdownOpen && (
              <div className="mt-2 grid grid-cols-1 gap-2 w-full px-4 py-2 bg-white border rounded-lg shadow-md">
                <a href="/apply" className="block  text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md">
                  Employment registration
                </a>
                <a href="/registration-form" className="block text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md">
                  Rider registration
                </a>
                <a href="/internship" className="block text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md">
                  Internship
                </a>
              </div>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;