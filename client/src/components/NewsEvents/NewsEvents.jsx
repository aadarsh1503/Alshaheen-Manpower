import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BrochureSection from "../BrochureSection/BrochureSection";
import RecruitmentDays from "./RecruitmentDays";
import Life from "./Life";
import NewsEventsCarousel from "../NewsEventsCarousel/NewsEventsCarousel";
import i11 from "./i11.png";

// Framer Motion Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const NewsEvents = () => {
  const images = [
    {
      src: i11,
      alt: "AL SHAHEEN MANPOWER News & Events",
      text: "NEWS & EVENTS",
      description:
        "Recent news and updates from AL SHAHEEN MANPOWER on company <br /> activities and job openings.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      <div className="relative w-full h-[550px] lg:h-[600px] overflow-hidden">
        {/* Background Image with Slow Zoom (Ken Burns Effect) */}
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentIndex].src})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 6, ease: [0.43, 0.13, 0.23, 0.96] }}
        />

        {/* Futuristic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* --- CONTENT WRAPPER ---
            This is now a flex column that pushes content to the bottom (`justify-end`) */}
        <motion.div
          className="relative z-10 flex h-full flex-col justify-end p-8 pb-12 text-white lg:pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* --- TEXT BLOCK (Aligned Left) --- */}
          <motion.div
            className="w-full max-w-2xl text-center font-raleway lg:ml-16 lg:text-left"
            variants={itemVariants}
          >
            <h1
              className="text-4xl font-bold leading-tight lg:text-6xl"
              dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}
            />
            <div className="my-4 h-1 w-20 bg-lightgreen lg:my-6 mx-auto lg:mx-0" />
            <p
              className="mb-8 text-base lg:text-lg break-words"
              dangerouslySetInnerHTML={{ __html: images[currentIndex].description }}
            />
          </motion.div>

          {/* --- BUTTON BLOCK (Aligned Center) --- */}
          <motion.div
            className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center"
            variants={itemVariants}
          >
            <motion.button
              className="w-full sm:w-auto bg-lightgreen px-8 py-3 font-semibold font-raleway tracking-wide uppercase text-white transition-colors duration-300 hover:bg-DarkRed focus:outline-none focus:ring-2 focus:ring-lightgreen focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Talent
            </motion.button>
            
            <motion.a
              href="/apply"
              className="w-full sm:w-auto bg-lightgreen px-8 py-3 text-center font-semibold font-raleway tracking-wide uppercase text-white transition-colors duration-300 hover:bg-DarkRed focus:outline-none focus:ring-2 focus:ring-lightgreen focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find a Job
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* The rest of your page components remain the same */}
      <RecruitmentDays />
      <NewsEventsCarousel />
      <Life />
      <BrochureSection />
    </div>
  );
};

export default NewsEvents;