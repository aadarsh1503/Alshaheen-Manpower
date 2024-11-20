import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import i1 from "./i1.png"
import Process from "./Process";
import AviationMiddle from "./AviationMiddle";
import BrochureSection from "../BrochureSection/BrochureSection";


const Aviation2 = () => {
  const images = [
    {
      src: i1,
      alt: "Image 1",
      text: "AVIATION",
      description:
        "Providing world class talent solutions for world leading <br /> airlines.",
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
        className="relative w-full lg:h-[500px] h-[400px] bg-cover bg-center"
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
        <motion.div
          className="absolute top-2/3 lg:right-96 lg:ml-0 ml-20  transform -translate-y-1/2 space-x-2 lg:space-x-4 z-10 flex flex-col lg:flex-row items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
         <button
  className="bg-lightgreen text-white px-4 py-2 lg:px-6 lg:py-3 font-raleway hover:bg-DarkRed mb-2 lg:mb-0"
  onClick={() => window.open("https://www.talentportal.bh/#pills-profile", "_blank")}
>
  FIND TALENT
</button>
<button
  className="bg-lightgreen text-white px-4 py-2 lg:px-6 lg:py-3 font-raleway hover:bg-DarkRed"
  onClick={() => window.open("https://www.talentportal.bh/#pills-home", "_blank")}
>
  FIND A JOB
</button>

        </motion.div>
      </div>
      <AviationMiddle />
<Process />
<BrochureSection />
    </div>
  );
};

export default Aviation2;
