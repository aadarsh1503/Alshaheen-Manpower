import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import BrochureSection from "../BrochureSection/BrochureSection";
import ProcessSteps from "./ProcessSteps.JSX";
import Process from "./Process";
import TechnicalSkillsTraining from "./TechnicalSkillsTraining";




const Training = () => {
  const images = [
    {
      src: "https://www.groupl.ae/images/process_bnr.jpg",
      alt: "Image 1",
      text: "TRAINING",
      description:
        "GVS's training modules have evolved from our <br /> decades of experience of dealing with people across the <br /> board for various sectors. Our candidates are sourced <br /> from 32 countries and placed across start-ups, fast- <br /> growing corporates as well as MNCs and are a crucial <br /> entity to our success.",
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
        className="relative w-full h-[400px] lg:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${images[currentIndex].src})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-lightgreen opacity-0"></div>

        {/* Content Wrapper with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          key={currentIndex}
          className="relative z-10 flex flex-col lg:flex-row items-center px-4 lg:px-8 py-8 lg:py-16 text-white"
        >
          <div className="w-full lg:w-1/2 font-raleway max-w-3xl lg:mt-24 lg:ml-32 text-center lg:text-left">
            <motion.h1
              className="text-3xl lg:text-5xl font-bold mb-2 lg:mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />

            {/* Red Line */}
            <motion.div
              className="h-1 lg:h-2 w-16 bg-lightgreen mb-4 lg:mb-6 mx-auto lg:mx-0"
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
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
                className="mx-auto mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </div>
        </motion.div>

        {/* Buttons */}

      </div>

<ProcessSteps />
<Process />
<TechnicalSkillsTraining />
      <BrochureSection />
    </div>
  );
};

export default Training;
