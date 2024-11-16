import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import about from "./about.png"


import BrochureSection from "../BrochureSection/BrochureSection";
import CEOSpeaks from "./CEOSpeaks";
import TheTeam from "./TheTeam";
import Methodology from "./Methodology";

const About = () => {
  const images = [
    {
      src: about,
      alt: "Image 1",
      text: "ABOUT US",
      description:
        "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <div
        className="relative w-full lg:h-[500px] h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${images[currentIndex].src})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content Wrapper with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          key={currentIndex}
          className="relative z-10 flex items-center px-4 lg:px-8 py-10 lg:py-16 text-white"
        >
          <div className="w-full lg:w-1/2 font-raleway max-w-3xl lg:mt-24 ml-8 lg:ml-32">
            <motion.h1
              className="text-3xl lg:text-5xl font-bold mb-2 lg:mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />

            {/* Red Line */}
            <motion.div
              className="h-2 w-10 lg:w-16 bg-lightgreen mb-4 lg:mb-6"
              initial={{ width: 0 }}
              animate={{ width: "2.5rem" }}
              transition={{ duration: 0.6 }}
            ></motion.div>

            <motion.p
              className="text-sm lg:text-lg mb-4 lg:mb-6 break-words"
              dangerouslySetInnerHTML={{ __html: images[currentIndex].description }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            />

            {images[currentIndex].googleSrc && (
              <motion.img
                src={images[currentIndex].googleSrc}
                alt="Google Reviews"
                className="mx-auto lg:ml-0 lg:-ml-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </div>
        </motion.div>

        {/* Buttons */}
      
      </div>
<CEOSpeaks />
<TheTeam />
<Methodology />
      <BrochureSection />
    </div>
  );
};

export default About;
