import React, { useState, useEffect } from 'react';
import L1 from './L1.jpg';

const CEOSpeaks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Disable scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isModalOpen]);

  return (
    <div className="bg-gray-100 p-8 md:px-20 lg:px-40">
      {/* Title */}
      <h2 className="text-3xl font-bold text-lightblue mb-2">CEO SPEAKS</h2>
      <div className="w-10 h-1 bg-lightblue mb-6"></div>

      {/* Content */}
      <p className="text-gray-700 mb-6">
        Nearly fifty years ago, AL SHAHEEN MANPOWER was founded with a dream. A dream to fulfill human
        potential. It is a dream that we work on every day. Today, Al Shaheen Manpower opens doors for
        international migrant workers and empowers them to earn a better livelihood. Recruiting across
        an array of industries including — Security, Facility Management, Construction, Food and Beverage,
        Retail, Hospitality, Aviation, Healthcare, and Oil and Gas, we have leveraged our vast experience
        servicing those sectors and created job-specific training courses to ensure that all workers deployed
        by Al Shaheen Manpower arrive job-ready. Al Shaheen Manpower is approved by the Labour Market
        Regulatory Authority (<span
          className="font-bold text-lightblue cursor-pointer hover:underline"
          onClick={toggleModal}
        >
          Commercial Registration No. 2024/MA23R0189
        </span>) below mentioned Establishment, in line with Law No. (19) for 2006 and all circulars regarding
        the implementation of the law, with regards to practice of Commercial Activities under the jurisdiction
        of the LMRA.
      </p>
      <p className="text-gray-700 mb-6">
        Continually expanding our reach, we currently recruit from 32 countries across South Asia,
        South-East Asia, Africa, Middle East, Eastern Europe, and Russia. Al Shaheen Manpower is committed
        to expanding its presence to newer employer markets, giving job-seekers a wide range of opportunities.
        This is complemented by our efforts to scale up the existing training infrastructure to cover all job
        roles, across our entire network. We are also optimizing our newly digitized processes to scale the
        operational life cycle. As Al Shaheen Manpower enters the sixth decade of its life, the pursuit of our
        dream is stronger than ever, as is our commitment to bringing skills and opportunities together.
      </p>

      {/* CEO Name */}
      <p className="text-lightblue font-bold">RIYADH SHAHEEN</p>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
              onClick={toggleModal}
            >
              ✖
            </button>
            {/* Image */}
            <img
              src={L1} // Replace with your image URL
              alt="Registration Document"
              className="rounded-md lg:w-[800px] lg:h-[400px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CEOSpeaks;
