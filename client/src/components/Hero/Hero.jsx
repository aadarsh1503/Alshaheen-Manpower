import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
// Import your images
import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
import i5 from "./i5.png";
import gog from "./gog.png"
// --- Data is moved outside the component for better organization ---
const sliderData = [
  {
    src: i1,
    alt: "Recruitment experts working in an office",
    text: "RECRUITMENT EXPERTS: <br /> RATED 4.8 ON GOOGLE",
    description:
      "Our aim is to give back to the society by enabling people to earn a better livelihood by empowering them with professional skills.",
    googleSrc: gog,
  },
  {
    src: i2,
    alt: "Diverse group of professionals",
    text: "BRINGING SKILLS <br /> AND OPPORTUNITY TOGETHER",
    description:
      "Incorporated 48 years ago, AL SHAHEEN MANPOWER has been providing ethical workforce and recruitment solutions across multiple industries in Europe and the Middle East since 2013.",
    googleSrc: "",
  },
  {
    src: i3,
    alt: "Business growth chart",
    text: "HIRE SMART, <br /> GROW FAST",
    description:
      "With our team of skilled managers, we offer the expertise to tackle a range of challenges, from auditing recruitment processes to resolving labor disputes.",
    googleSrc: "",
  },
  {
    src: i4,
    alt: "Grid of candidate profiles",
    text: "160,000+ SCREENED <br />CANDIDATES",
    description:
      "We offer an extensive pool of trained and thoroughly vetted candidates to meet your business needs, assessed on both technical and language skills before selection.",
    googleSrc: "",
  },
  {
    src: i5,
    alt: "Human Resources lifecycle diagram",
    text: "FULL SERVICE HR",
    description:
      "Our comprehensive service portfolio manages your entire human resource cycle, providing valuable insights into the recruitment market and tailored solutions.",
    googleSrc: "",
  },
];

// --- Animation Variants for staggering child animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Hero = ({ onFindJobClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);


  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const currentSlide = sliderData[currentIndex];

  return (
    <div className="relative w-full h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image & Overlay */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.src})` }}
          initial={{ opacity: 0.8, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content Container with Offset */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        {/* Positioning Wrapper: Uses padding to push content from the left */}
        <div className="w-full px-6 lg:pl-[12%] lg:pr-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="max-w-3xl text-center lg:text-left" // Limits line length, aligns text
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Title */}
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white font-raleway"
                dangerouslySetInnerHTML={{ __html: currentSlide.text }}
                variants={itemVariants}
              />

              {/* Decorative Line */}
              <motion.div
                className="h-1.5 w-16 bg-lightgreen mb-6 mx-auto lg:mx-0" // Centered on mobile, left on desktop
                variants={itemVariants}
              ></motion.div>

              {/* Description */}
              <motion.p
                className="text-base lg:text-lg mb-8 text-gray-200"
                dangerouslySetInnerHTML={{ __html: currentSlide.description }}
                variants={itemVariants}
              />

              {/* Button Group: Aligned to the end (right) of the content block on large screens */}
              <motion.div
  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end"
  variants={itemVariants}
>
  <button
    className="bg-lightgreen text-white px-8 py-3 font-raleway font-semibold hover:bg-DarkRed transition-colors duration-300"
    onClick={() => window.open("https://www.talentportal.bh/#pills-profile", "_blank")}
  >
    FIND TALENT
  </button>
  
  <button
    className="bg-transparent border-2 border-white text-white px-8 py-3 font-raleway font-semibold hover:bg-white hover:text-black transition-colors duration-300"
    onClick={() => window.location.href = '/apply'}
  >
    FIND A JOB
  </button>
</motion.div>


              {/* Google Review - Aligned with content block */}
              {currentSlide.googleSrc && (
                <motion.div className="-mt-12 hidden lg:flex justify-center lg:justify-start" variants={itemVariants}>
                  <img
                    src={currentSlide.googleSrc}
                    alt="Google Reviews"
                    className="h-12"
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? "bg-white" : "bg-gray-400 bg-opacity-70 hover:bg-white"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;