import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i5 from "./i5.png";
import i6 from "./i6.png";

const VacanciesCarousel = () => {
  const images = [
    { src: i1, subject: "Application for Driver" },
    { src: i2, subject: "Application for Welder" },
    { src: i3, subject: "Application for Sales Executive" },
    { src: i4, subject: "Application for Accountant" },
    { src: i5, subject: "Application for Chef" },
    { src: i6, subject: "Application for Delivery Man" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const visibleImages = [
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
  ];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      position: 'relative',
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      position: 'absolute',
    }),
  };

  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="w-full bg-white py-12 px-4 flex justify-center items-center">
      <div className="flex items-center">
        {/* Side Text - Desktop only */}
        <div className="bg-lightgreen hidden w-[356px] h-[300px] lg:-mt-14 text-white text-left flex-col justify-center items-center p-6 text-5xl font-bold mr-4 lg:flex">
          CURRENT <br /> VACANCIES
        </div>

        {/* Mobile Vertical Layout */}
        <div className="lg:hidden w-full">
          <div className="p-6 text-4xl font-raleway text-white mb-6 bg-lightgreen text-center">
            Current Vacancies
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            {images.map((item, index) => (
              <a
                key={index}
                href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(item.subject)}`}
                className="w-full max-w-[356px] h-auto"
              >
                <img
                  src={item.src}
                  alt={`Vacancy ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Carousel - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center space-y-4 overflow-hidden">
          <div className="w-[720px] h-[338px] relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute top-0 left-0 w-full flex justify-between gap-4"
              >
                {visibleImages.map((item, index) => (
                  <a
                    key={index}
                    href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(item.subject)}`}
                    className="w-[356px] h-[338px] flex-shrink-0"
                  >
                    <img
                      src={item.src}
                      alt={`Vacancy ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                  </a>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 ml-0 lg:ml-[596px] mt-4">
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