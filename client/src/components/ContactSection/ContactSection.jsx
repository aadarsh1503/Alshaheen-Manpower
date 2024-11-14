import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa'; // Added FaTwitter
import ContactUs from './ContactUs';
import BrochureSection from '../BrochureSection/BrochureSection';
import i1 from "./i1.png"

const ContactSection = () => {
  return (
    <div className='w-full min-h-screen'>
      <div
        className="relative bg-cover h-[500px] bg-center"
        style={{
          backgroundImage: `url(${i1})`,
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
              <a
                href="https://facebook.com/gvscargo"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://linkedin.com/company/gvsbahrain/"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com/gvscargo"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com/gvscargo"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
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
