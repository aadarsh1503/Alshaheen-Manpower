import React, { useState, useEffect } from "react";
import g1 from "./g1.png"; // Your image path

const WhatsAppWidget = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  const image = {
    src: g1,
    alt: "Click Here To View Company Profile",
    file: "/files/Al Shaheen Manpower_Profile_2025.pdf",
  };

  // Handle auto-minimize on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isWidgetOpen) {
        setIsWidgetOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWidgetOpen]);

  return (
    <>
      {/* Main Floating Button */}
      <div className="fixed bottom-7 z-50 left-2 lg:left-1">
        <button
          onClick={() => setIsWidgetOpen(!isWidgetOpen)}
          className="bg-lightblue hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold flex items-center justify-center"
        >
          {!isWidgetOpen ? (
            "View Company Profile"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>

        {/* Widget with Image */}
        <div
          className={`${
            isWidgetOpen ? "block" : "hidden"
          } rounded-lg shadow-lg p-4 mt-4 w-64 transition-all`}
        >
          <div className="relative group cursor-pointer">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-96 object-cover rounded-lg"
            />
            <button
              onClick={() => setShowPDF(true)}
              className="absolute inset-0 bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold rounded-lg"
            >
              {image.alt}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-[90%] h-[90%] relative shadow-lg">
            {/* Close Button */}
         {/* Close Button */}
<button
  onClick={() => setShowPDF(false)}
  className="absolute top-2 right-1 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50 hover:bg-red-500 hover:text-white transition"
>
  &times;
</button>

            {/* PDF Viewer */}
            <iframe
              src={image.file}
              title="Company Profile"
              className="w-full h-full border-none"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
