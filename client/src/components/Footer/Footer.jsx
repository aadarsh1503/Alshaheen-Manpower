import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white max-w-5xl mx-auto lg:h-[220px]">
      <div className="container mx-auto flex lg:flex-row flex-col lg:justify-between lg:items-center px-4">
        
        {/* Left Section */}
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <h2 className="text-lightblue mt-6 lg:mt-10 font-bold text-2xl lg:text-3xl">CONTACT US</h2>
          <p className="mt-2 lg:mt-4 text-sm lg:text-base text-gray-700">
            P.O. Box 54121, Kingdom of Bahrain
            <br />
            +973 13303301
            <br />
            info@alshaheen.pro
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center lg:text-left">
          <h3 className="text-lightblue font-bold mt-4 lg:mt-0">Follow us</h3>
          <div className="flex justify-center lg:justify-start space-x-4 mt-2">
            <a href="https://www.facebook.com/Alshaheen.pro/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a href="https://www.instagram.com/alshaheen_manpower/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a href="https://www.linkedin.com/in/alshaheen-manpower-144096339/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-gray-400 text-2xl hover:text-DarkRed" />
            </a>
            <a
              href="https://x.com/Alshaheen_Pro"
              className="text-gray-400 text-2xl mt-0 lg:-mt-1 hover:text-DarkRed transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
          </div>
          <a href='/privacy-policy'>
            <p className="text-gray-500 hover:text-DarkRed text-xs lg:text-sm mt-2">Privacy Policy</p>
          </a>

          {/* Download Button */}
          <div className="mt-4">
            <a 
              href="public/files/AL SHAHEEN MANPOWER WEBSITE CONTENT.docx" 
              download 
              className="bg-lightblue text-white px-4 py-2 rounded-lg hover:bg-DarkRed transition duration-300 text-sm"
            >
              Download File
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
