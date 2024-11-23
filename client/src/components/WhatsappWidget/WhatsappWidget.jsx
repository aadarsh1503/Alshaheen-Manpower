import React, { useState, useEffect } from "react";
import g1 from "./g1.png"; // Replace with your image path

const WhatsAppWidget = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const image = { src: g1, alt: "Company Profile", file: "file1.pdf" };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = "public/files/Al Shaheen Manpower_Profile.pdf"; // File URL or path
    link.download = "Al Shaheen Manpower_Profile.pdf"; // Downloaded file name
    link.click();
  };

  // Handle auto-minimize on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isWidgetOpen) {
        setIsWidgetOpen(false); // Close the widget on scroll
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isWidgetOpen]);

  return (
    <div className="fixed bottom-7 z-50 left-8">
      {/* Floating Button or Cross Icon */}
      <button
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className="bg-lightblue hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold flex items-center justify-center"
      >
        {!isWidgetOpen ? (
          // "View Company Profile" button when closed
          "View Company Profile"
        ) : (
          // Cross icon when widget is open
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

      {/* Sliding Widget */}
      <div
        className={`${
          isWidgetOpen ? "block" : "hidden"
        } rounded-lg shadow-lg p-4 mt-4 w-64 transition-all`}
      >
        <div className="relative group cursor-pointer">
          {/* Single Image */}
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-96 object-cover rounded-lg"
          />
          {/* Download Button Overlay */}
          <button
            onClick={downloadFile}
            className="absolute inset-0 bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold rounded-lg"
          >
            Download {image.alt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppWidget;
