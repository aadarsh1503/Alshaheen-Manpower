import React, { useState, useEffect } from 'react';
import { BsFillChatRightQuoteFill, BsX } from 'react-icons/bs'; // Using icons for a cleaner look
import L1 from './L1.jpg';

// Import the custom CSS file
import './c.css';

const CEOSpeaks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 font-raleway py-20 md:py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Giant background quote icon for aesthetic depth */}
        <BsFillChatRightQuoteFill className="absolute top-16 left-8 text-9xl text-lightblue/10 transform -rotate-12" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-center">
          {/* --- LEFT COLUMN: Title & Signature --- */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-lightblue mb-3">
              CEO SPEAKS
            </h2>
            <div className="w-24 h-2 bg-lightblue rounded-full mx-auto lg:mx-0"></div>
            
            <div className="mt-16 text-center">
              <p className="font-signature text-2xl lg:text-5xl text-gray-700">Riyadh Shaheen</p>
              <p className="text-lightgreen font-semibold text-center tracking-wider mt-1">MANAGING DIRECTOR</p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: The Message --- */}
          <div className="lg:col-span-2 text-gray-600 text-base md:text-lg leading-relaxed space-y-6">
            <p>
              Nearly fifty years ago, AL SHAHEEN MANPOWER was founded with a dream. A dream to fulfill human
              potential. It is a dream that we work on every day. Today, Al Shaheen Manpower opens doors for
              international migrant workers and empowers them to earn a better livelihood.
            </p>
            <p>
              Recruiting across an array of industries including — Security, Facility Management, Construction, Food & Beverage,
              Retail, Hospitality, Aviation, Healthcare, and Oil & Gas, we have leveraged our vast experience
              servicing those sectors and created job-specific training courses to ensure that all workers deployed
              by Al Shaheen Manpower arrive job-ready.
            </p>
            <p>
              Al Shaheen Manpower is approved by the Labour Market
              Regulatory Authority (<span
                className="font-bold text-lightblue cursor-pointer hover:underline"
                onClick={toggleModal}
              >
                Commercial Registration No. 2024/MA23R0189
              </span>) in line with Law No. (19) for 2006.
            </p>
            <p>
              As Al Shaheen Manpower enters the sixth decade of its life, the pursuit of our
              dream is stronger than ever, as is our commitment to bringing skills and opportunities together.
            </p>
          </div>
        </div>
      </div>

      {/* --- Upgraded Futuristic Modal --- */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={toggleModal} // Close modal by clicking the background
        >
          <div 
            // The animation-modal-pop-in class is from our CSS file
            className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl animation-modal-pop-in"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
          >
            {/* Close Button - Sleek and modern */}
            <button
              className="absolute -top-4 -right-4 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-lightblue hover:text-white transition-all duration-300"
              onClick={toggleModal}
            >
              <BsX size={24} />
            </button>
            {/* Image */}
            <img
              src={L1}
              alt="Registration Document"
              className="rounded-lg max-w-full md:max-w-3xl max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CEOSpeaks;