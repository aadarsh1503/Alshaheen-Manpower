import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEnvelope ,FaBars, FaTimes } from 'react-icons/fa';
import i1 from "./i1.jpg"
const Navbar = () => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
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
      <div className="hidden lg:text-md lg:flex space-x-8">
        <a href="/" className="hover:underline text-DarkRed lg:mt-2 mt-0 font-semibold hover:text-lightgreen">Home</a>
        <a href="/about" className="hover:underline font-semibold lg:mt-2 mt-0 hover:text-lightgreen text-DarkRed">About Us</a>
        
        {/* Services Dropdown */}
        {/* <div className="relative">
          <button
            className="hover:underline font-semibold hover:text-lightgreen text-DarkRed flex items-center"
            onClick={toggleServicesDropdown}
          >
            Services
            {servicesDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </button>
          {servicesDropdownOpen && (
            <div className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md">
              <button
                className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/recruitment')}
              >
                Recruitment
              </button>
              <button
                className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/pre-employment')}
              >
                Pre-Employment
              </button>
              <button
                className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/placements')}
              >
                Placements
              </button>
              <button
                className="block px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/visas')}
              >
                Visas
              </button>
            </div>
          )}
        </div> */}

        {/* Industry Dropdown */}
        <div className="relative">
          <button
            className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed flex items-center"
            onClick={toggleIndustryDropdown}
          >
            Industries
            {industryDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
          </button>
          {industryDropdownOpen && (
  <div className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md">
    <button
      className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100"
      onClick={() => handleSelection('/aviation')}
    >
      Aviation
    </button>
              <button
                className="block w-full text-left px-4 py-2 text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/construction')}
              >
                Construction
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/events')}
              >
                Events
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/healthcare')}
              >
                Healthcare
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/hospitality')}
              >
                Hospitality
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/logistics')}
              >
                Logistics
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/manufacturing')}
              >
                Manufacturing
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/retail')}
              >
                Retail
              </button>
              <button
                className="block px-4 py-2 w-full text-left text-black hover:text-lightgreen hover:bg-gray-100"
                onClick={() => handleSelection('/security')}
              >
                Security
              </button>
            </div>
          )}
        </div>

        <a href="/training" className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed">Training</a>

        <a href="/newsEvents" className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed">News</a>
        <a href="/contactUs" className="hover:underline text-DarkRed font-semibold lg:mt-2 mt-0 hover:text-lightgreen">Contact Us</a>
        <div className="relative">
  <button
    className="hover:underline font-semibold hover:text-lightgreen lg:mt-2 mt-0 text-DarkRed flex items-center"
    onClick={toggleEmailDropdown}
  >
    <FaEnvelope className="mr-2" /> Email
    {emailDropdownOpen ? <FaChevronUp className="ml-2 mt-1" /> : <FaChevronDown className="ml-2 mt-1" />}
  </button>
  {emailDropdownOpen && (
    <div className="absolute z-50 font-raleway mt-2 bg-white shadow-lg w-48 rounded-md">
      {/* Customer Care */}
      <a 
        href="mailto:customercare@gvscargo.com" 
        className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100"
        title="Send an email to Customer Care"
      >
        Customer Care
      </a>

      {/* Sales */}
      <a 
        href="mailto:sales@gvscargo.com" 
        className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100"
        title="Send an email to Sales"
      >
        Seller Care
      </a>

      {/* Business Enquiries */}
      <a 
        href="mailto:info@gvscargo.com" 
        className="block w-full px-4 py-2 text-left text-black hover:text-lightgreen hover:bg-gray-100"
        title="Send an email to Business Enquiries"
      >
        Business Enquiries
      </a>
    </div>
  )}
</div>



        <a 
  href="https://www.talentportal.bh/#pills-home" 
  target="_blank" 
  className="flex items-center space-x-2 text-DarkRed hover:text-lightgreen font-semibold hover:underline"
>
  <img 
    src={i1}
    alt="Find a Job" 
    className="w-6 h-6 lg:w-44 rounded-full lg:h-10 object-cover"
  />
</a>
      </div>

      {/* Mobile Menu */}
      <div
  className={`lg:hidden fixed bottom-0 left-0 w-full h-full bg-white shadow-lg transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in-out z-40`}
>
  <ul className="flex flex-col  items-center justify-center h-full space-y-4 p-4">
    <img
      src="https://alshaheen.pro/wp-content/uploads/2023/09/cropped-AlshaheenManpower_1_page-0001.jpg"
      alt="Logo"
      className="h-28"
    />
    <li><a href="/" className="text-DarkRed font-semibold hover:text-lightgreen text-2xl">Home</a></li>
    <li><a href="/about" className="font-semibold hover:text-lightgreen text-DarkRed text-2xl">About Us</a></li>

    {/* Mobile Services Dropdown */}
    <li className="relative w-full text-center">
      <button
        className="font-semibold hover:text-lightgreen text-DarkRed flex items-center justify-center w-full text-2xl"
        onClick={toggleServicesDropdown}
      >
        Services
        {servicesDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
      </button>
      {servicesDropdownOpen && (
        <ul className="mt-2 space-y-2 text-lg">
          <li><a href="/recruitment" className="block text-black hover:text-lightgreen">Recruitment</a></li>
          <li><a href="/pre-employment" className="block text-black hover:text-lightgreen">Pre-Employment</a></li>
          <li><a href="/placements" className="block text-black hover:text-lightgreen">Placements</a></li>
          <li><a href="/visas" className="block text-black hover:text-lightgreen">Visas</a></li>
        </ul>
      )}
    </li>

    {/* Mobile Industry Dropdown */}
    <li className="relative w-full text-center">
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
            href="mailto:customercare@gvscargo.com" 
            className="block text-center py-2 px-4 text-black hover:text-lightgreen hover:bg-gray-100 rounded-md"
          >
            Customer Care
          </a>
          <a 
            href="mailto:sales@gvscargo.com" 
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
