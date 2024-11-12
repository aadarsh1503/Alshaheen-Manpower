// Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white flex justify-between items-center p-4 text-black">
      <div className="logo"> {/* Add your logo here */}
        <img src="/path/to/logo.png" alt="Logo" className="h-10" />
      </div>
      <div className="flex ml-96 font- space-x-8">
        <a href="/" className="hover:underline font-semibold">Home</a>
        <a href="#about" className="hover:underline font-semibold text-DarkRed">About Us</a>
        <div className="relative">
          <button className="hover:underline font-semibold text-DarkRed">Industries</button>
          {/* Add dropdown menu for Services if needed */}
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
