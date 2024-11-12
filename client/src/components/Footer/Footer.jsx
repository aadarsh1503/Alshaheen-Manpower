import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white max-w-5xl mx-auto lg:h-[220px]">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left Section */}
        <div>
          <h2 className="text-lightblue mt-10 font-bold text-3xl">CONTACT US</h2>
          <p className="mt-4 text-11.2 text-gray-700">
           
          P.O. Box 54121,
          Kingdom of Bahrain
<br />
+97313303301<br />
info@alshaheen.pro

          </p>
        </div>

        {/* Right Section */}
        <div className="text-left">
          <h3 className="text-lightblue font-bold">Follow us</h3>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="https://facebook.com/gvscargo" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-gray-400 text-2xl hover:text-gray-600" />
            </a>
            <a href="https://instagram.com/gvscargo" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-400 text-2xl hover:text-gray-600" />
            </a>
            <a href="https://www.linkedin.com/company/gvsbahrain/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-gray-400 text-2xl hover:text-gray-600" />
            </a>
            <a href="https://twitter.com/gvscargo" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-gray-400 text-2xl hover:text-gray-600" />
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-2">Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
