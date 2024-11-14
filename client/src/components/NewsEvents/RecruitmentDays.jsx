import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RecruitmentDays = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'https://www.groupl.ae/images/31_a.jpg', // Replace with your image paths
    'https://www.groupl.ae/images/31_b.jpg',
    'https://www.groupl.ae/images/vacancies2_4.jpg', // Add more images as needed
    'https://www.groupl.ae/images/vacancies2_4.jpg'

  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className=''>
    <div className="flex lg:ml-32 flex-col md:flex-row  p-8 items-center">
      {/* Left Side - Carousel Image */}
      <div className="relative w-full md:w-[400px] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt="Recruitment Slide"
          className="w-full object-cover"
        />
      </div>

      {/* Carousel Controls Below Image */}
   

      {/* Right Side - Text Content */}
      <div className="md:w-2/3 p-8 lg:-mt-56 text-gray-700">
        <h2 className="text-3xl font-bold text-red-600 mb-4">RECRUITMENT DAYS</h2>
        <p className="text-gray-600">
          Through efficient processes, technology, and dedicated service teams, we are bringing skills and opportunities together almost every single day. Find the most recent job openings here.
        </p>
      </div>
    </div>
       <div className="flex justify-center mb-4  space-x-4 w-full md:w-2/3">
       <button onClick={prevSlide} className="text-2xl text-gray-700 hover:text-gray-900">
         <FaChevronLeft />
       </button>
       <button onClick={nextSlide} className="text-2xl text-gray-700 hover:text-gray-900">
         <FaChevronRight />
       </button>
     </div>
      </div>
  );
};

export default RecruitmentDays;
