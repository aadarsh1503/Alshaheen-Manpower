import React, { useState, useEffect, useCallback } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import b1 from "./b1.jpg";
import b2 from "./b2.jpg";
import b3 from "./b3.jpg";
import b4 from "./b4.jpg";
import b5 from "./b5.jpg";

// --- Configuration ---
const images = [
    { src: b1, alt: "Event 1", heading: "AL SHAHEEN MANPOWER Dubai LAUNCH", description: "We are thrilled to announce our Healthcare Wellness Day, a special event designed to promote healthier living and provide valuable resources." },
    { src: b2, alt: "Event 2", heading: "LAUNCH OF AL SHAHEEN MANPOWER AT DUBAI", description: "Announcing the official launch of our new Dubai office, a milestone in our journey to extend our reach in a dynamic global hub." },
    { src: b3, alt: "Event 3", heading: "AL SHAHEEN MANPOWER LAUNCHES WORKA", description: "Al Shaheen Manpower was founded to empower people worldwide, connecting them with the right job opportunities and talent across all industries." },
    { src: b4, alt: "Event 4", heading: "STRATEGIC PARTNERSHIP ANNOUNCED", description: "A new strategic partnership that will redefine industry standards and create unparalleled value for our clients and stakeholders." },
    { src: b5, alt: "Event 5", heading: "INNOVATION IN GLOBAL RECRUITMENT", description: "Discover how our new technology platform is revolutionizing global recruitment, making it faster and more efficient than ever before." },
];

const CARD_WIDTH = 320; // w-80
const GAP = 16; // gap-4
const CLONE_COUNT = 3; // Number of items to clone on each side for a seamless loop

// --- Helper to create the extended array for looping ---
const createExtendedImages = () => {
  const clonesStart = images.slice(-CLONE_COUNT);
  const clonesEnd = images.slice(0, CLONE_COUNT);
  return [...clonesStart, ...images, ...clonesEnd];
};
const extendedImages = createExtendedImages();

// Animation for mobile view (single card fade/slide)
const mobileVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const NewsEventsCarousel = () => {
  const [virtualIndex, setVirtualIndex] = useState(CLONE_COUNT);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileDirection, setMobileDirection] = useState(0);

  const realCurrentIndex = (virtualIndex - CLONE_COUNT + images.length) % images.length;

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setVirtualIndex((prev) => prev + 1);
    setMobileDirection(1);
  }, [isTransitioning]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setVirtualIndex((prev) => prev - 1);
    setMobileDirection(-1);
  };

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => setIsTransitioning(false), 50);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const handleAnimationComplete = () => {
    if (virtualIndex >= images.length + CLONE_COUNT) {
      setIsTransitioning(true);
      setVirtualIndex(CLONE_COUNT);
    } else if (virtualIndex < CLONE_COUNT) {
      setIsTransitioning(true);
      setVirtualIndex(images.length + CLONE_COUNT - 1);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, 2000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const offset = -virtualIndex * (CARD_WIDTH + GAP);

  return (
    <div className="w-full bg-llgray py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-12 text-center lg:text-left">
          <h2 className="text-gray-400 font-light text-2xl lg:text-5xl tracking-wider">UPDATES</h2>
          <h1 className="text-lightblue font-semibold text-2xl lg:text-5xl mt-1">NEWS & EVENTS</h1>
          <p className="text-black text-base lg:text-lg mt-4 max-w-7xl mx-auto lg:mx-0">
            Stay informed with our latest developments, achievements, and upcoming events.
          </p>
        </div>

        {/* The onMouseEnter/Leave handlers have been REMOVED from this outer container */}
        <div className="lg:col-span-12 flex flex-col items-center">
          <div className="w-full h-[400px] relative overflow-hidden">
            
            {/* --- MOBILE CAROUSEL --- */}
            {/* The handlers are now on this container for mobile view */}
            <div 
              className="lg:hidden w-full h-full flex items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence initial={false} custom={mobileDirection}>
                <motion.div
                  key={realCurrentIndex}
                  custom={mobileDirection}
                  variants={mobileVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute w-80 h-72"
                >
                  <div className="relative group w-full h-full rounded-xl overflow-hidden shadow-2xl">
                    <img src={images[realCurrentIndex].src} alt={images[realCurrentIndex].alt} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-lightgreen/80 to-transparent backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white">{images[realCurrentIndex].heading}</h3>
                      <p className="text-sm text-white/90 mt-2">{images[realCurrentIndex].description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* --- DESKTOP CAROUSEL --- */}
            {/* The handlers are now on this motion.div for desktop view */}
            <motion.div
              className="hidden lg:flex items-center h-full"
              animate={{ x: `calc(50% - ${(CARD_WIDTH / 2)}px + ${offset}px)` }}
              transition={isTransitioning ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 25 }}
              onAnimationComplete={handleAnimationComplete}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex gap-4">
                {extendedImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className={`relative group h-[350px] w-80 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-out
                      ${virtualIndex === index ? 'scale-105 z-10' : 'scale-90 opacity-60'}`
                    }
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`
                      absolute inset-0 p-6 flex flex-col justify-end
                      bg-gradient-to-t from-transparent via-transparent to-transparent 
                      group-hover:from-lightgreen/90 group-hover:via-lightgreen/70 
                      group-hover:backdrop-blur-sm 
                      transition-colors duration-500 ease-out
                    `}>
                        <div className="opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <h3 className="text-xl font-bold text-white">{image.heading}</h3>
                            <p className="text-sm text-white/90 mt-2">{image.description}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={handlePrev} className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all" aria-label="Previous Slide">
              <BsChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all" aria-label="Next Slide">
              <BsChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventsCarousel;