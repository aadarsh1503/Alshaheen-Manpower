import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import g1 from "./g1.jpg";
import g2 from "./g2.jpg";
import g3 from "./g3.jpg";
import g4 from "./g4.jpg";
import g5 from "./g5.jpg";
import g6 from "./g6.jpg";


const Life = () => {
  const images = [
g1,g2,g3,g4,g5,g6
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % images.length
    );
  };

  const visibleImages = [
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
  ];

  return (
    <div className="w-full bg-white py-12 px-4 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row items-center">
        {/* Current Vacancies Section */}
        <div className="bg-lightgreen w-72 text-4xl lg:w-[356px] h-[300px] lg:-mt-14 text-white text-left flex flex-col p-12 lg:text-5xl font-bold mb-4 lg:mb-0 lg:mr-4">
          LIFE<br /> AT <br /> ALSHAHEEN
        </div>

        {/* Image Carousel */}
        <div className="relative flex flex-col items-center space-y-4 w-full lg:w-auto">
          {/* Display Two Images in a Grid Layout for Mobile */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 w-72  lg:w-[732px]">
            {visibleImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Vacancy ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>

          {/* Navigation Buttons Below Images */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handlePrev}
              className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"
            >
              <BsChevronLeft className="text-gray-600" size={24} />
            </button>
            <button
              onClick={handleNext}
              className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"
            >
              <BsChevronRight className="text-gray-600" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Life;
