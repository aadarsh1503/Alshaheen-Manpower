import React from 'react';
import i1 from "./i1.jpg"
import i2 from "./i2.jpg"
import i3 from "./i3.jpg"
import i4 from "./i4.jpg"
import i5 from "./i5.jpg"
import i6 from "./i6.jpg"

const OurCustomers = () => {
  const customerPhotos = [
 i1, // Replace with actual photo paths or URLs
 i2,
 i3,
 i4,
 i5,
 i6,

  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-4xl font-bold text-lightblue p-2 font-raleway mb-8">OUR CUSTOMERS</h2>
        <div className="grid gap-6 md:grid-cols-2 p-2 lg:grid-cols-3">
          {customerPhotos.map((photo, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={photo}
                alt={`Customer ${index + 1}`}
                className="w-full h-full object-cover group-hover:opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurCustomers;
