// src/components/RootLayout.jsx
import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';


const RootLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
