// src/components/Toggle.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const Toggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={` ${darkMode ? 'text-white' : 'text-gray-800'} text-sm font-medium`}>
        {darkMode ? "Dark" : "Light"} Mode
      </span>
      <div
        onClick={toggleDarkMode}
        className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 
        ${darkMode ? "bg-gray-700" : "bg-yellow-400"}`}
      >
        <motion.div
          className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center`}
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        >
          {darkMode ? (
            <FaMoon className="text-gray-700 text-sm" />
          ) : (
            <FaSun className="text-yellow-500 text-sm" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Toggle;
