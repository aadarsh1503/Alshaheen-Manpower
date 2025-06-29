import React, { useState } from 'react';
import i1 from "./i1.png";
import i2 from "./i2.jpg";
import i3 from "./i3.png";
import i4 from "./i4.png";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Gulf Air",
      text: "Al Shaheen Manpower has played a crucial role in helping us scale our operations at Gulf Air. Their commitment to quality, especially in aviation staffing, has consistently exceeded our expectations. Professional and trustworthy.",
      address: "",
      image: i1,
    },
    {
      id: 2,
      name: "Jumeirah Group",
      text: "Working with Al Shaheen Manpower has been an outstanding experience. Their deep understanding of the hospitality industry has helped us at Jumeirah Group find world-class professionals with minimal turnaround time.",
      address: "",
      image: i2,
    },
    {
      id: 3,
      name: "Mediclinic Middle East",
      text: "We collaborated with Al Shaheen Manpower to meet urgent hiring demands for our healthcare unit. Their seamless coordination, pre-screened candidates, and efficient process made them a valuable partner.",
      address: "",
      image: "https://ocs-sport.ams3.cdn.digitaloceanspaces.com/sst/2023/02/mediclinic-logo.png",
    },
    {
      id: 4,
      name: "ADNOC Group",
      text: "The talent pool Al Shaheen provides is consistently top-tier. Their team is proactive and responsive, ensuring we meet our recruitment goals quickly. We've onboarded several skilled engineers through them.",
      address: "",
      image: "https://yt3.googleusercontent.com/NgrRBjmwwqgyGiTHlEfVKPuxk4GPcXKxiUYHiYSV4MJplTm75cXsev1BWkYWRgo2EjO7a64lGA=s900-c-k-c0x00ffffff-no-rj",
    },
  ];
  

  const [current, setCurrent] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded testimonial

  const handleNext = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const reorderedTestimonials = [
    testimonials[(current + 0) % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  const truncateText = (text, lines) => {
    const maxChars = lines * 50; // Approximate character count for 3 lines
    return text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
  };

  return (
    <div className="bg-gray-100 py-10">
      <div className="lg:text-3xl text-2xl lg:ml-44 ml-4 text-lightblue font-bold max-w-5xl mx-auto mb-20">
        OUR TESTIMONIALS
      </div>
      <h1 className="h-2 w-10 lg:w-16 bg-lightblue ml-4 lg:ml-44 -mt-12 lg:-mt-16"></h1>

      {/* Desktop View */}
      <div className="hidden lg:flex justify-center items-center">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="text-gray-600 hover:text-gray-800 p-4 bg-gray-200 rounded-full focus:outline-none mx-4"
        >
          &#8592;
        </button>

        <div className="flex items-center gap-12 mt-32">
          {reorderedTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative transition-all duration-1000 ease-in-out flex flex-col items-center bg-white shadow-md p-6 rounded-lg
                ${index === 1
                  ? "scale-110 opacity-100 h-[456px] w-72 transform shadow-xl transition-transform"
                  : "scale-90 opacity-60 w-72 transform transition-transform"}`}
            >
              <div
                className={`absolute -top-10 flex justify-center items-center w-24 h-24 rounded-full overflow-hidden border-4 ${index === 1 ? "border-lightgreen" : "border-gray-200"}`}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={`object-fill w-full h-16 ${index === 1 ? "scale-110" : "scale-100"}`}
                />
              </div>
              <div className="text-5xl text-lightblue mt-4 lg:mt-10 ml-0 lg:-ml-56">“</div>
              <p className="text-lightblue font-bold mb-1">{testimonial.name}</p>
              <p className="text-gray-600 max-w-7xl text-center">
                {index === 1 ? testimonial.text : truncateText(testimonial.text, 3)}
              </p>
              <p className="text-gray-500 mt-2">{testimonial.address}</p>
              <div className="text-5xl text-lightblue ml-0 lg:ml-56 mt-2">”</div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="text-gray-600 hover:text-gray-800 p-4 bg-gray-200 rounded-full focus:outline-none mx-4"
        >
          &#8594;
        </button>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 lg:hidden mt-10 px-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="flex flex-col items-center bg-white shadow-md p-6 rounded-lg"
          >
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 mb-4"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lightblue font-bold mb-1">{testimonial.name}</div>
            <p className="text-gray-500 mt-2">{testimonial.address}</p>
            
            <p className="text-gray-600 max-w-7xl text-center">
              {expandedIndex === index ? testimonial.text : truncateText(testimonial.text, 3)}
            </p>

            <div className="flex justify-center space-x-2 mt-4">
              <button
                className={`h-2 w-2 rounded-full ${expandedIndex === index ? 'bg-lightblue' : 'bg-gray-300'}`}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} // Toggle expanded state
              ></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
