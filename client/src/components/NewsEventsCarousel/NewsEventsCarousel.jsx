import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const NewsEventsCarousel = () => {
  const images = [
    {
      src: "https://www.groupl.ae/images/e9.jpg",
      alt: "Event 1",
      heading:"GroupL ROMANIA LAUNCH",
      description: "Mihai Turbatu, our Sales Manager, on the occasion of the Romanian office inauguration. After 48+ years of growth, GroupL’s UAE team has branched to a new office space in Romania to service more businesses across the world.",
    },
    {
      src: "https://www.groupl.ae/images/e7.jpg",
      alt: "Event 2",
      description: "Description for Event 2",
    },
    {
      src: "https://www.groupl.ae/images/e6.jpg",
      alt: "Event 3",
      description: "Description for Event 3",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const visibleImages = [
    images[(currentIndex - 1 + images.length) % images.length],
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
  ];

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <div className="text-left  mb-4">
          <h2 className="text-gray-400 font-thin text-4xl">UPDATES</h2>
          <h1 className="text-DarkRed font-bold text-4xl">NEWS & EVENTS</h1>
        </div>

        {/* Image Carousel */}
        <div className="relative flex items-center justify-center space-x-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute -left-40 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"
          >
            <BsChevronLeft className="text-gray-600" size={24} />
          </button>

          {/* Display Three Images */}
          <div className="flex space-x-4 transition-transform duration-500 ease-in-out">
            {visibleImages.map((image, index) => (
              <div key={index} className="relative group w-60 lg:w-[356px] lg:h-[300px] h-40">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-fill rounded-lg shadow-md"
                />
                {/* Description Overlay */}
                <div className="absolute inset-0 top-40 bg-DarkRed bg-opacity-80 text-white opacity-0 group-hover:opacity-100 flex flex-col items-start justify-center transition-opacity duration-300 rounded-lg p-4">
  <p className="text-lg font-bold text-left whitespace-pre-line ">{image.heading}</p> {/* Heading */}
  <p className="text-12.8 text-left font-semibold whitespace-pre-line mb-1">{image.description}</p> {/* Description */}
</div>

              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute -right-44 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200"
          >
            <BsChevronRight className="text-gray-600" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsEventsCarousel;
