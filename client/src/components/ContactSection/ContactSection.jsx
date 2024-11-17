import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa'; // Added FaTwitter
import ContactUs from './ContactUs';
import BrochureSection from '../BrochureSection/BrochureSection';
import i1 from "./i1.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

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
            <h1 className="lg:text-5xl text-2xl font-bertioga font-bold mb-4">CONTACT US</h1>

            {/* Description */}
            <p className="text-16 lg:w-full w-1/2 mb-8">
              We intend our collaboration with you to deliver more<br /> than just a workforce - we aim to add an asset to your<br />
              business. Find the best talent for your business across<br /> all sectors.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap space-x-4">
              <a
                href="https://www.facebook.com/Alshaheen.pro/"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.linkedin.com/in/alshaheen-manpower-144096339/"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/alshaheen_manpower/"
                className="text-white text-2xl hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com/Alshaheen_Pro"
                className="text-white text-2xl mt-0 lg:-mt-1 hover:text-DarkRed transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ContactUs and BrochureSection */}
      <ContactUs />
      <BrochureSection />
    </div>
  );
};

export default ContactSection;
