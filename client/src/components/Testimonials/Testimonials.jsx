import React, { useState } from 'react';
import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Amit Chopra",
      text: "Reliable and Efficient Staffing Solutions We've been partnering with Al Shaheen Manpower for years, and they consistently deliver top-notch talent. Their personalized service have helped us find skilled professionals, especially in the nursing and aviation sectors. We highly recommend them.",
      address: "Mumbai, India",
      image: i1,
    },
    {
      id: 2,
      name: "Juan Cruz",
      text: "Dedicated and Supportive Team The team at Al Manpower is incredibly dedicated and supportive. They understood our specific needs for event coordinators and provided us with highly qualified candidates. Their commitment to client satisfaction is truly commendable",
      address: "Metro Manila, Philippines",
      image: i2,
    },
    {
      id: 3,
      name: "Ali Ahmed",
      text: "Seamless Placement Process The placement process with Al Shaheen Manpower was seamless. They quickly identified and presented us with suitable candidates for our logistics and hospitality positions. Their attention to detail and prompt communication made the entire experience hassle-free",
      address: "Dubai, UAE",
      image: i3,
    },
    {
      id: 4,
      name: "Maya Singh",
      text: "Excellent Recruitment Support Al Shaheen Manpower has been a key partner in fulfilling our staffing requirements. Their team takes the time to understand our needs and consistently delivers exceptional candidates. Their proactive approach and timely communication make them a reliable staffing provider.",
      address: "New Delhi, India",
      image: i4,
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
                  className={`object-cover w-full h-full ${index === 1 ? "scale-110" : "scale-100"}`}
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
