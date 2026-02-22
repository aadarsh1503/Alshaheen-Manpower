// src/components/VacanciesCarousel/VacanciesCarousel.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // 1. Import Link from react-router-dom

const VacanciesCarousel = () => {
  // ... (all your state and useEffect hooks remain exactly the same)
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get('/api/vacancies');
        if (Array.isArray(response.data)) {
          setVacancies(response.data);
        } else {
          console.error('Vacancies data is not an array:', response.data);
          setVacancies([]);
        }
      } catch (err) {
        setError('Could not load vacancies at this time.');
        console.error("Fetch error:", err);
        setVacancies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  const handlePrev = useCallback(() => {
    if (vacancies.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? vacancies.length - 1 : prevIndex - 1));
  }, [vacancies.length]);

  const handleNext = useCallback(() => {
    if (vacancies.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vacancies.length);
  }, [vacancies.length]);

  useEffect(() => {
    if (!isHovered && vacancies.length > 1) {
      const slideInterval = setInterval(handleNext, 3000);
      return () => clearInterval(slideInterval);
    }
  }, [currentIndex, isHovered, handleNext, vacancies.length]);


  // ... (isLoading and error sections remain the same)
  if (isLoading) {
    return (
      <div className="w-full bg-white py-12 px-4 flex justify-center items-center h-[450px]">
        <p className="text-gray-500">Loading Vacancies...</p>
      </div>
    );
  }

  if (error || vacancies.length === 0) {
    return (
      <div className="w-full bg-white py-12 px-4 flex justify-center items-center h-[450px]">
        <div className="bg-lightgreen hidden w-[356px] h-[300px] lg:-mt-14 text-white text-left flex-col justify-center items-center p-6 text-5xl font-bold mr-4 lg:flex">
          CURRENT <br /> VACANCIES
        </div>
        <p className="text-center text-gray-600">
          {error ? error : "There are no open vacancies at the moment."}
        </p>
      </div>
    );
  }
  
  const visibleImages = vacancies.length > 1
    ? [vacancies[currentIndex], vacancies[(currentIndex + 1) % vacancies.length]]
    : [vacancies[0]];

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.95, position: 'absolute' }),
    center: { x: 0, opacity: 1, scale: 1, position: 'relative' },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.95, position: 'absolute' }),
  };
  const transition = { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <div className="w-full bg-white py-12 px-4 flex justify-center items-center">
      <div className="flex items-center">
        <div className="bg-lightgreen hidden w-[356px] h-[300px] lg:-mt-14 text-white text-left flex-col justify-center items-center p-6 text-5xl font-bold mr-4 lg:flex">
          CURRENT <br /> VACANCIES
        </div>

        {/* Mobile Vertical Layout */}
        <div className="lg:hidden w-full">
          <div className="p-6 text-4xl font-raleway text-white mb-6 bg-lightgreen text-center">Current Vacancies</div>
          <div className="flex flex-col items-center space-y-6">
            {vacancies.map((item, index) => (
              <Link key={item.id || index} to="/apply" className="w-full max-w-[356px]">
                <div className="relative group">
                  <img src={item.imageUrl} alt={item.subject} className="w-full h-auto object-cover rounded-lg shadow-md" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                    <h3 className="text-white font-bold text-lg">{item.subject}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden lg:flex flex-col items-center space-y-4 overflow-hidden">
          <div className={`w-[720px] h-[338px] relative overflow-hidden flex items-center ${vacancies.length === 1 ? 'justify-center' : ''}`}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute top-0 left-0 w-full flex justify-center gap-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {visibleImages.map((item) => (
                  item && (
                    <Link key={item.id} to="/apply" className="w-[356px] h-[338px] flex-shrink-0 relative">
                      <img src={item.imageUrl} alt={item.subject} className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                        <h3 className="text-white font-bold text-lg">{item.subject}</h3>
                      </div>
                    </Link>
                  )
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {vacancies.length > 1 && (
            <div className="flex space-x-4 ml-0 lg:ml-[596px] mt-4">
              <button onClick={handlePrev} className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"><BsChevronLeft className="text-gray-600" size={24} /></button>
              <button onClick={handleNext} className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"><BsChevronRight className="text-gray-600" size={24} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacanciesCarousel;