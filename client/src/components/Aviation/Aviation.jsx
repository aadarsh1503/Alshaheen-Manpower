import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import TalentForYourBusiness from "./TalentForYourBusiness";
import ProcessSection from "./ProcessSection";

const Aviation = () => {
  const images = [
    {
      src: "https://www.groupl.ae/images/aviation_bnr.jpg",
      alt: "Image 1",
      text: "AVIATION",
      description:
        "Our aim is to give back to the society by enabling people to earn a better <br /> livelihood by empowering them with professional skills. Every youth <br /> successfully placed, is one step closer to realising our larger dream.",

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
      className="relative w-full lg:h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${images[currentIndex].src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-0"></div>

      {/* Content Wrapper with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        key={currentIndex}
        className="relative z-10 flex items-center px-8 py-16 text-white"
      >
        <div className="w-1/2 font-raleway max-w-3xl lg:mt-24 ml-32">
          <motion.h1
            className="text-5xl font-bold mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Red Line */}
          <motion.div
            className="h-2 w-16 bg-red-600 mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.6 }}
          ></motion.div>

          <motion.p
            className="text-12.8 mb-6 break-words"
            dangerouslySetInnerHTML={{ __html: images[currentIndex].description }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />

          {images[currentIndex].googleSrc && (
            <motion.img
              src={images[currentIndex].googleSrc}
              alt="Google Reviews"
              className="mx-auto ml-0 lg:-ml-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </div>
      </motion.div>
      <motion.div
        className="absolute top-2/3 right-96 transform -translate-y-1/2 space-x-4 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <button className="bg-red-700 text-white px-6 py-3 font-raleway hover:bg-white hover:text-red-500">
          FIND TALENT
        </button>
        <button className="bg-red-700 text-white px-6 py-3 font-raleway hover:bg-white hover:text-red-500">
          FIND A JOB
        </button>
      </motion.div>
      

      {/* Dot Navigation */}

    </div>
    <TalentForYourBusiness />
    <ProcessSection />
    </div>
  );
};


export default Aviation;
