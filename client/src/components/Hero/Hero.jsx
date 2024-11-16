import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
import i5 from "./i5.png";


const Hero = () => {
  const images = [
    {
      src: i1,
      alt: "Image 1",
      text: "RECRUITMENT EXPERTS: <br /> RATED 4.8 ON GOOGLE",
      description:
        "Our aim is to give back to the society by enabling people to earn a better <br /> livelihood by empowering them with professional skills. Every youth <br /> successfully placed, is one step closer to realising our larger dream.",
      googleSrc: "https://www.groupl.ae/images/gog.png",
    },
    {
      src:i2,
      alt: "Image 2",
      text: "BRINGING SKILLS <br /> AND OPPORTUNITY TOGETHER",
      description:
        "Incorporated 48 years ago, GVS has been providing ethical <br /> workforce and recruitment solutions across multiple industries in <br /> Europe and the Middle East since 2013.",
      googleSrc: "",
    },
    {
      src: i3,
      alt: "Image 3",
      text: "HIRE SMART, <br /> GROW FAST",
      description:
        "Our qualified managers bring you the expertise to deal with a range of <br /> issues including audit of the recruitment processes, labour dispute <br /> resolution, general HR administration.",
      googleSrc: "",
    },
    {
      src: i4,
      alt: "Image 4",
      text: "160,000+ SCREENED <br />CANDIDATES",
      description:
        "We have a vast pool of trained and screened candidates to fulfil the <br /> requirements of your business. Our global collaborations with various <br /> technical institutes enable us to train and assess the candidates' <br /> technical and language skills prior to their selection.",
      googleSrc: "",
    },
    {
      src:i5,
      alt: "Image 5",
      text: "FULL SERVICE HR",
      description:
        "Our service portfolio looks after your entire human resource cycle. Our <br /> consultancy vertical includes effective advisory - helping you <br /> understand and stay up to date on the current recruitment market -<br /> available talent, salary rates, current hiring complexities, competitor <br /> benchmarking as well as bespoke solutions based on your specific <br /> need.",
      googleSrc: "",
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
    <div
  className="relative w-full h-[532px] lg:h-[624px] bg-cover bg-center"
  style={{ backgroundImage: `url(${images[currentIndex].src})` }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Content Wrapper with Framer Motion */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    key={currentIndex}
    className="relative z-10 flex flex-col items-center lg:flex-row lg:items-center lg:px-8 lg:py-16 text-white text-center lg:text-left"
  >
    <div className="w-full lg:w-1/2 font-raleway max-w-3xl lg:mt-24 mt-12 lg:ml-32  px-4 sm:px-6 md:px-12 lg:px-0">
      <motion.h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
        dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Red Line */}
      <motion.div
        className="h-2 w-12 sm:w-14 lg:w-16 bg-lightgreen mb-6 mx-auto lg:mx-0"
        initial={{ width: 0 }}
        animate={{ width: "4rem" }}
        transition={{ duration: 0.6 }}
      ></motion.div>

      <motion.p
        className="text-sm sm:text-base lg:text-lg mb-6 break-words"
        dangerouslySetInnerHTML={{ __html: images[currentIndex].description }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      />

      {images[currentIndex].googleSrc && (
        <motion.img
          src={images[currentIndex].googleSrc}
          alt="Google Reviews"
          className="mx-auto hidden lg:block lg:mx-0 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      )}
    </div>
  </motion.div>

  {/* Buttons */}
  <motion.div
    className="absolute bottom-12 lg:left-1/2 left-24 transform -translate-x-1/2 space-y-4 lg:space-x-4 lg:space-y-0 lg:bottom-auto lg:top-2/3 lg:right-96 lg:transform lg:-translate-y-1/2 z-10 flex flex-col lg:flex-row"
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

  {/* Dot Navigation */}
  <div className="absolute bottom-4 sm:bottom-6 lg:top-[532px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
    {images.map((_, index) => (
      <button
        key={index}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
          currentIndex === index ? "bg-white" : "bg-gray-400"
        }`}
        onClick={() => handleDotClick(index)}
      />
    ))}
  </div>
</div>

  );
};


export default Hero;
