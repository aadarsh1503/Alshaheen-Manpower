import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

// Import your images
import i1 from "./i1.png";
import i2 from "./i2.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Gulf Air",
      text: "Al Shaheen Manpower has played a crucial role in helping us scale our operations. Their commitment to quality, especially in aviation staffing, has consistently exceeded our expectations.",
      image: i1,
    },
    {
      id: 2,
      name: "Jumeirah Group",
      text: "Working with Al Shaheen Manpower has been an outstanding experience. Their deep understanding of the hospitality industry has helped us find world-class professionals with minimal turnaround time.",
      image: i2,
    },
    {
      id: 3,
      name: "Mediclinic Middle East",
      text: "We collaborated with Al Shaheen to meet urgent hiring demands. Their seamless coordination, pre-screened candidates, and efficient process made them an invaluable partner for our healthcare unit.",
      image: "https://ocs-sport.ams3.cdn.digitaloceanspaces.com/sst/2023/02/mediclinic-logo.png",
    },
    {
      id: 4,
      name: "ADNOC Group",
      text: "The talent pool Al Shaheen provides is consistently top-tier. Their team is proactive and responsive, ensuring we meet our recruitment goals quickly. We've onboarded several skilled engineers through them.",
      image: "https://yt3.googleusercontent.com/NgrRBjmwwqgyGiTHlEfVKPuxk4GPcXKxiUYHiYSV4MJplTm75cXsev1BWkYWRgo2EjO7a64lGA=s900-c-k-c0x00ffffff-no-rj",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const getCardIndices = () => {
    const total = testimonials.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    return [prevIndex, currentIndex, nextIndex];
  };

  const visibleIndices = getCardIndices();

  return (
    <div className="bg-gray-100 font-raleway w-full py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-lightblue mb-3">
            OUR TESTIMONIALS
          </h2>
          <div className="w-32 h-2 bg-lightblue rounded-full"></div>
        </div>

        <div className="relative h-[450px] md:h-[400px] flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-64 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition"
          >
            <BsChevronLeft className="text-lightblue" size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:right-64 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition"
          >
            <BsChevronRight className="text-lightblue" size={24} />
          </button>

          <div className="relative w-full h-full [perspective:1000px]">
            {testimonials.map((testimonial, index) => {
              const visibleIndex = visibleIndices.indexOf(index);
              
              let positionStyle = {};
              let zIndex = 0;
              let opacity = 0;
              let scale = 0.8;

              if (visibleIndex !== -1) {
                opacity = 1;
                if (visibleIndex === 1) { 
                  zIndex = 10;
                  scale = 1;
                  positionStyle = { transform: "translateX(0) translateZ(0) rotateY(0)" };
                } 
                else if (visibleIndex === 0) { 
                  zIndex = 5;
                  // ✨ Changed from -60% to -50% to bring it closer
                  positionStyle = { transform: "translateX(-50%) translateZ(-200px) rotateY(45deg)" };
                } 
                else if (visibleIndex === 2) { 
                  zIndex = 5;
                   // ✨ Changed from 60% to 50% to bring it closer
                  positionStyle = { transform: "translateX(50%) translateZ(-200px) rotateY(-45deg)" };
                }
              } else {
                positionStyle = { transform: `translateX(0) translateZ(-500px) rotateY(0)` };
              }

              return (
                <div
                  key={testimonial.id}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    ...positionStyle,
                    zIndex: zIndex,
                  }}
                >
                  <div
                    className="w-11/12 md:w-3/5 lg:w-2/5 min-h-[320px] bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-lightblue/20 border border-gray-200/50 p-6 text-center flex flex-col items-center justify-center transition-all duration-500"
                    style={{
                      opacity: opacity,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 mb-4 object-contain bg-white p-2 rounded-full ring-4 ring-lightblue/50 ring-offset-4 ring-offset-transparent"
                    />
                    <p className=" text-base lg:text-lg text-gray-600 leading-relaxed line-clamp-4">
                      "{testimonial.text}"
                    </p>
                    <p className="mt-6 text-base lg:text-lg font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;