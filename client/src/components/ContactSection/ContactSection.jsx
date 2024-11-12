import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaGooglePlusG } from 'react-icons/fa';
import ContactUs from './ContactUs';
import BrochureSection from '../BrochureSection/BrochureSection';
import Footer from '../Footer/Footer';


const ContactSection = () => {
  return (
    <div className=' w-full min-h-screen'>
    <div
      className=" relative bg-cover h-[500px] bg-center"
      style={{
        backgroundImage: `url('https://www.groupl.ae/images/conct_bnr.jpg')`, 
      }}
    >
      {/* Red Overlay */}
      <div className="absolute inset-0 bg-DarkRed opacity-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8 lg:px-32">
        <div className="text-white max-w-lg">
          {/* Title */}
          <h1 className="text-5xl font-bertioga font-bold mb-4">CONTACT US</h1>

          {/* Description */}
          <p className="text-16 mb-8">
            We intend our collaboration with you to deliver more<br /> than just a workforce - we aim to add an asset to your<br />
            business. Find the best talent for your business across<br /> all sectors.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-white text-2xl hover:text-gray-200 transition duration-300">
              <FaFacebookF />
            </a>
            <a href="#" className="text-white text-2xl hover:text-gray-200 transition duration-300">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-white text-2xl hover:text-gray-200 transition duration-300">
              <FaInstagram />
            </a>
            <a href="#" className="text-white text-2xl hover:text-gray-200 transition duration-300">
              <FaYoutube />
            </a>
            <a href="#" className="text-white text-2xl hover:text-gray-200 transition duration-300">
              <FaGooglePlusG />
            </a>
          </div>
        </div>
      </div>


    </div>
    <ContactUs />
    <BrochureSection />
    </div>
  );
};

export default ContactSection;
