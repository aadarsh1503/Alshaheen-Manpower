import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const images = [
    {
      src: "https://images.jdmagicbox.com/quickquotes/listicle/listicle_1702290546983_1hhd5_847x400.jpg",
      alt: "Image 1",
      text: "RECRUITMENT EXPERTS: <br /> RATED 4.8 ON GOOGLE",
      description:
        "Our aim is to give back to the society by enabling people to earn a better <br /> livelihood by empowering them with professional skills. Every youth <br /> successfully placed, is one step closer to realising our larger dream.",
      googleSrc: "https://www.groupl.ae/images/gog.png",
    },
    {
      src: "https://media.istockphoto.com/id/1272136549/photo/industrial-worker-at-factory.jpg?s=612x612&w=0&k=20&c=3IfTV81wmujlXmiK8NQa-IJKyiY4GEprSpNVZ_tnQds=",
      alt: "Image 2",
      text: "BRINGING SKILLS <br /> AND OPPORTUNITY TOGETHER",
      description:
        "Incorporated 48 years ago, GroupL has been providing ethical <br /> workforce and recruitment solutions across multiple industries in <br /> Europe and the Middle East since 2013.",
      googleSrc: "",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdD-14vg4i3dzDgP-MpbUpVPb9TKqXzB5VhQ&s",
      alt: "Image 3",
      text: "HIRE SMART, <br /> GROW FAST",
      description:
        "Our qualified managers bring you the expertise to deal with a range of <br /> issues including audit of the recruitment processes, labour dispute <br /> resolution, general HR administration.",
      googleSrc: "",
    },
    {
      src: "image4.jpg",
      alt: "Image 4",
      text: "160,000+ SCREENED <br />CANDIDATES",
      description:
        "We have a vast pool of trained and screened candidates to fulfil the <br /> requirements of your business. Our global collaborations with various <br /> technical institutes enable us to train and assess the candidates' <br /> technical and language skills prior to their selection.",
      googleSrc: "",
    },
    {
      src: "image5.jpg",
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
      className="relative w-full lg:h-[624px] bg-cover bg-center"
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
      <div className="absolute lg:top-[532px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-400"}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};


export default Hero;
