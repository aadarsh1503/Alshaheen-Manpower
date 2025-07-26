import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const VacanciesCarousel = () => {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get('https://alshaheen-manpower.onrender.com/api/vacancies');
        setVacancies(response.data);
      } catch (err) {
        setError('Could not load vacancies at this time.');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    if (vacancies.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? vacancies.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (vacancies.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vacancies.length);
  };
  
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

  // === FIX: Handle visible images logic correctly for 1 or more items ===
  const visibleImages = vacancies.length > 1
    ? [vacancies[currentIndex], vacancies[(currentIndex + 1) % vacancies.length]]
    : [vacancies[0]]; // If only one vacancy, show only that one.

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
              <a key={item.id || index} href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(item.subject)}`} className="w-full max-w-[356px] h-auto">
                <img src={item.imageUrl} alt={item.subject} className="w-full h-auto object-cover rounded-lg shadow-md" />
              </a>
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
                className="absolute top-0 left-0 w-full flex justify-center gap-4" // Use justify-center for single item
              >
                {visibleImages.map((item) => (
                  item && (
                    <a key={item.id} href={`mailto:Hire@alshaheen.pro?subject=${encodeURIComponent(item.subject)}`} className="w-[356px] h-[338px] flex-shrink-0">
                      <img src={item.imageUrl} alt={item.subject} className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105" />
                    </a>
                  )
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons - Only show if more than 1 vacancy */}
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