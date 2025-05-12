import React, { useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import i1 from "./i1.jpg";
import i21 from "./i21.jpg";

const Navbar = () => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  
  const industryDropdownRef = useRef(null);  // Ref for the industry dropdown
  const emailDropdownRef = useRef(null);     // Ref for the email dropdown

  const toggleEmailDropdown = () => setEmailDropdownOpen(!emailDropdownOpen);

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
    if (industryDropdownOpen) setIndustryDropdownOpen(false); // Close the other dropdown
  };

  const toggleIndustryDropdown = () => {
    setIndustryDropdownOpen(!industryDropdownOpen);
    if (servicesDropdownOpen) setServicesDropdownOpen(false); // Close the other dropdown
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setServicesDropdownOpen(false);
      setIndustryDropdownOpen(false); // Close both dropdowns when mobile menu is opened
    }
  };

  const handleSelection = (value) => {
    setServicesDropdownOpen(false);
    setIndustryDropdownOpen(false); // Close the dropdown
    window.location.href = value; // Navigate to the selected page
  };

  return (
    <nav className="relative bg-white lg:flex max-w-7xl mx-auto justify-end items-center p-6 lg:py-4 text-black">
      <div className="absolute left-1 top-1 z-20 hidden lg:block">
        <img
          src={i21}
          alt="Logo"
          className="h-28"
        />
      </div>

      <button
        className="lg:hidden text-DarkRed text-2xl z-50 relative"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="hidden lg:text-md lg:flex space-x-8">
        <a href="/" className="hover:underline text-DarkRed lg:mt-2 mt-0 font-semibold hover:text-lightgreen">Home</a>
        <a href="/about" className="hover:underline font-semibold lg:mt-2 mt-0 hover:text-lightgreen text-DarkRed">About Us</a>
        
        <div className="relative" ref={industryDropdownRef}>
          <div
            className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed flex items-center"
            onMouseEnter={() => {
              setIndustryDropdownOpen(true);
              setServicesDropdownOpen(false);
            }}
            onMouseLeave={(e) => {
              // Close dropdown only if the mouse leaves both the parent and the dropdown
              if (!industryDropdownRef.current.contains(e.relatedTarget)) {
                setIndustryDropdownOpen(false);
              }
            }}
          >
            Industries
            {industryDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </div>
          {industryDropdownOpen && (
            <div
              className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md"
              onMouseEnter={() => setIndustryDropdownOpen(true)}
              onMouseLeave={() => setIndustryDropdownOpen(false)}
            >
              {/* Dropdown links */}
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
          )}
        </div>

        <a href="/training" className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed">Training</a>
        <a href="/newsEvents" className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed">News</a>
        <a href="/contactUs" className="hover:underline text-DarkRed font-semibold lg:mt-2 mt-0 hover:text-lightgreen">Contact Us</a>
        
        <div className="relative" ref={emailDropdownRef}>
          <div
            className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed flex items-center"
            onMouseEnter={() => {
              setEmailDropdownOpen(true);
            }}
            onMouseLeave={(e) => {
              // Close dropdown only if the mouse leaves both the parent and the dropdown
              if (!emailDropdownRef.current.contains(e.relatedTarget)) {
                setEmailDropdownOpen(false);
              }
            }}
          >
            <FaEnvelope className="mr-2" /> Email
            {emailDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </div>
          {emailDropdownOpen && (
            <div 
              className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md"
              onMouseEnter={() => setEmailDropdownOpen(true)}
              onMouseLeave={() => setEmailDropdownOpen(false)}
            >
              <a href="mailto:sales@alshaheen.pro" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">
                Seller Care
              </a>
              <a href="mailto:info@alshaheen.pro" className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100">
                Business Enquiries
              </a>
            </div>
          )}
        </div>

        <a href="https://www.talentportal.bh/#pills-home" target="_blank" className="bg-red-600 text-white lg:text-md  font-semibold hover:text-DarkRed outline hover:outline-Darkred hover:bg-white mt-0 px-4 py-2 rounded">
          Click Here To Register
        </a>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed bottom-0 left-0 w-full h-full bg-white shadow-lg transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in-out z-40`}>
        <ul className="flex flex-col items-center justify-center h-full space-y-4 p-4">
          <img
            src={i21}
            alt="Logo"
            className="h-28"
          />
          {/* Mobile Menu Items */}
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
          <li><a href="/construction" className="block text-black hover:text-lightgreen">Construction</a></li>
          <li><a href="/events" className="block text-black hover:text-lightgreen">Events</a></li>
          <li><a href="/healthcare" className="block text-black hover:text-lightgreen">Healthcare</a></li>
          <li><a href="/hospitality" className="block text-black hover:text-lightgreen">Hospitality</a></li>
          <li><a href="/logistics" className="block text-black hover:text-lightgreen">Logistics</a></li>
          <li><a href="/manufacturing" className="block text-black hover:text-lightgreen">Manufacturing</a></li>
          <li><a href="/retail" className="block text-black hover:text-lightgreen">Retail</a></li>
          <li><a href="/security" className="block text-black hover:text-lightgreen">Security</a></li>
        </ul>
      )}
    </li>
    
    <li><a href="/training" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">Training</a></li>
    <li><a href="/newsEvents" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">News</a></li>
    <li><a href="https://www.talentportal.bh/#pills-home" target="_blank" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Find a Job</a></li>
    <li><a href="/contactUs" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Contact Us</a></li>

    {/* Email Section - New Block Style */}
    <div className="relative w-full text-center">
      <button
        className="font-semibold hover:text-lightgreen text-DarkRed flex items-center justify-center w-full text-2xl"
        onClick={toggleEmailDropdown}
      >
        <FaEnvelope className="mr-2" /> Email
        {emailDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
      </button>
      {emailDropdownOpen && (
        <div className="mt-2 grid grid-cols-1 gap-4 w-full px-4 py-4 bg-white border rounded-lg shadow-md">
          <a 
            href="mailto:sales@alshaheen.pro" 
            className="block text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md"
          >
            Seller Care
          </a>
          <a 
            href="mailto:info@gvscargo.com" 
            className="block text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md"
          >
            Business Enquiries
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