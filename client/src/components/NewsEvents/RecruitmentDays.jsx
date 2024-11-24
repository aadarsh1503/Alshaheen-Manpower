import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i5 from "./i5.png";
import i6 from "./i6.png";

const RecruitmentDays = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: i1, subject: "Application For Driver" },
    { src: i2, subject: "Application For Welder" },
    { src: i3, subject: "Application For Sales Executive" },
    { src: i4, subject: "Application For Accountant" },
    { src: i5, subject: "Application For Chef" },
    { src: i6, subject: "Application For Delivery Man" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="">
      <div className="flex lg:ml-32 flex-col md:flex-row p-8 items-center">
        {/* Left Side - Carousel Image */}
        <div className="relative w-full md:w-[400px] flex items-center justify-center">
          <a href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(images[currentIndex].subject)}`} target="_blank">
            <img
              src={images[currentIndex].src}
              alt="Recruitment Slide"
              className="w-full object-cover"
            />
          </a>
        </div>

        {/* Right Side - Text Content */}
        <div className="md:w-2/3 p-8 lg:-mt-56 text-gray-700">
          <h2 className="text-3xl font-bold text-red-600 mb-4">RECRUITMENT DAYS</h2>
          <p className="text-gray-600">
            Through efficient processes, technology, and dedicated service teams, we are bringing skills and opportunities together almost every single day. Find the most recent job openings here.
          </p>
        </div>
      </div>
      {/* Carousel Controls Below Image */}
      <div className="flex justify-center mb-4 space-x-4 w-full md:w-2/3">
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
