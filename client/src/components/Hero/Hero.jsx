import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ========== ASSETS ==========
import gog from "./gog.png";
const videoUrl = "https://res.cloudinary.com/ds1dt3qub/video/upload/v1771420424/3191887-uhd_3840_2160_25fps_xrts9v.mp4";

// --- Data ---
const sliderData = [
  {
    text: "RECRUITMENT EXPERTS: <br /> RATED 4.8 ON GOOGLE",
    description: "Our aim is to give back to the society by enabling people to earn a better livelihood by empowering them with professional skills.",
    googleSrc: gog,
  },
  {
    text: "BRINGING SKILLS <br /> AND OPPORTUNITY TOGETHER",
    description: "Incorporated 48 years ago, AL SHAHEEN MANPOWER has been providing ethical workforce and recruitment solutions across multiple industries in Europe and the Middle East since 2013.",
    googleSrc: "",
  },
  {
    text: "HIRE SMART, <br /> GROW FAST",
    description: "With our team of skilled managers, we offer the expertise to tackle a range of challenges, from auditing recruitment processes to resolving labor disputes.",
    googleSrc: "",
  },
  {
    text: "160,000+ SCREENED <br />CANDIDATES",
    description: "We offer an extensive pool of trained and thoroughly vetted candidates to meet your business needs, assessed on both technical and language skills before selection.",
    googleSrc: "",
  },
  {
    text: "FULL SERVICE HR",
    description: "Our comprehensive service portfolio manages your entire human resource cycle, providing valuable insights into the recruitment market and tailored solutions.",
    googleSrc: "",
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ==========================================================
// FIX: STATIC VIDEO COMPONENT
// The second argument () => true tells React NEVER to re-render this.
// This prevents the video from restarting on resize or state change.
// ==========================================================
const BackgroundVideo = memo(() => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ filter: "brightness(0.5)" }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      {/* Dark Overlay Overlay */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}, () => true); // ALWAYS returns true (never re-renders)

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = sliderData[currentIndex];

  return (
    <section className="relative w-full h-[600px] lg:h-[700px] flex items-center overflow-hidden bg-black">
      {/* This component will stay playing smoothly regardless of size changes */}
      <BackgroundVideo />

      <div className="container mx-auto px-6 lg:px-[10%] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-4xl"
          >
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-raleway"
              dangerouslySetInnerHTML={{ __html: currentSlide.text }}
              variants={itemVariants}
            />

            <motion.div 
              className="h-1 w-20 bg-green-500 mb-6" 
              variants={itemVariants} 
            />

            <motion.p
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: currentSlide.description }}
              variants={itemVariants}
            />

            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-bold transition-all"
                onClick={() => window.open("https://www.talentportal.bh/#pills-profile", "_blank")}
              >
                FIND TALENT
              </button>
              <button
                className="border-2 border-white text-white px-8 py-4 font-bold hover:bg-white hover:text-black transition-all"
                onClick={() => navigate('/apply')}
              >
                FIND A JOB
              </button>
            </motion.div>

            {currentSlide.googleSrc && (
              <motion.div className="mt-10" variants={itemVariants}>
                <img src={currentSlide.googleSrc} alt="Google" className="h-16 w-auto" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {sliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;