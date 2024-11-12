import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const VacanciesCarousel = () => {
  const images = [
    "https://www.groupl.ae/images/OA1.png",
    "https://www.groupl.ae/images/EKCD1.png",
    "https://www.groupl.ae/images/PSBD1.png",
    "https://www.groupl.ae/images/MEP1.png",
    "https://www.groupl.ae/images/_COM1.png",
    "https://www.groupl.ae/images/_COM2.png",
    "https://www.groupl.ae/images/_com3.png",
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
      <div className=" flex items-center">
        {/* Current Vacancies Section */}
        <div className="bg-DarkRed w-[356px] h-[300px] lg:-mt-14 text-white text-left flex flex-col justify-center items-center p-6 text-5xl font-bold mr-4">
          CURRENT <br /> VACANCIES
        </div>

        {/* Image Carousel */}
        <div className="relative flex flex-col items-center space-y-4">
          {/* Display Two Images */}
          <div className="flex space-x-4 transition-transform duration-500 ease-in-out">
            {visibleImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Vacancy ${index + 1}`}
                className="w-80 h-80 object-cover lg:w-[356px] lg:h-[300px] rounded-lg shadow-md"
              />
            ))}
          </div>

          {/* Navigation Buttons Below Images */}
          <div className="flex space-x-4 ml-[596px] mt-4">
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

export default VacanciesCarousel;
