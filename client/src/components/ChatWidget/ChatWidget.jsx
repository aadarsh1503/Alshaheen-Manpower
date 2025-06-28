import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import "./ChatWidget.css"; // Import your CSS file

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp numbers
  const supportNumber = "+97333340017"; // Support number
  const teamNumber = "+97317491444"; // Team number

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle button click for both "Support" and "Team"
  const handleSendMessage = (messageType) => {
    const whatsappNumber =
      messageType === "support" ? supportNumber : teamNumber;
    const message =
      messageType === "support"
        ? "Hello,  Alshaheen Manpower Team! I'm [Your Name] from [Your Company]. I'm excited to discuss [Topic/Subject] with you."
        : "Hello,  Alshaheen Manpower Team! I'm [Your Name] from [Your Company]. I'm excited to discuss [Topic/Subject] with you.";

    // Check if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Generate the appropriate WhatsApp link based on the device type
    const whatsappLink = isMobile
      ? `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(
          message
        )}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
          message
        )}`;

    window.open(whatsappLink, "_blank");
  };

  // Minimize chat widget on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false); // Close the widget when the user scrolls
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]); // Dependency array ensures this effect runs when `isOpen` changes

  return (
    <div className="fixed bottom-8 lg:right-5 right-6 z-50">
      {/* WhatsApp Button */}
      <button
        onClick={toggleChat}
        className="bg-green-500 text-white relative left-4 p-2 pl-3 pr-4 rounded-full shadow-lg flex items-center hover:bg-green-600 transition duration-300"
      >
        {isOpen ? (
          <FaTimes size={18} />
        ) : (
          <>
            <FaWhatsapp size={18} className="mr-1" />
            <span className={` inline ${isOpen ? "waving-text" : ""}`}>
              Hi, how can I help?
            </span>
          </>
        )}
      </button>

      {/* Two-Button Section for Sales and Support */}
      {isOpen && (
        <div
          className={`shadow-lg bg-white rounded-lg p-4 w-80 mt-2 relative animate-slide-up`}
        >
          <div className="bg-green-500 text-white p-3 rounded-t-lg">
            <p className="text-sm sm:text-base">Choose the option to contact us:</p>
          </div>

          {/* Buttons for "Support" and "Team" */}
          <div className="p-4 flex flex-col space-y-4">
            <button
              onClick={() => handleSendMessage("support")}
              className="bg-gray-200 text-green-700 p-3 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 flex items-center justify-center text-lg"
            >
              <FaWhatsapp className="mr-2" size={20} />
              SALES
            </button>
            <button
              onClick={() => handleSendMessage("team")}
              className="bg-gray-200 text-green-700 p-3 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 flex items-center justify-center text-lg"
            >
              <FaWhatsapp className="mr-2" size={20} />
              SUPPORT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
