/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        DarkRed: '#ff0000',
        darkgray:'#e9e9e9',
        lightblue:'#4ba3ca',
        lightgreen:'#1a9c2c',

      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        bertioga: ['Bertioga Sans Medium', 'sans-serif'], 
      },
      fontSize: {
        '12.8': '12.8px',
        '11.2':'11.2px',
        '16':'16px',
      },
    },
  },
  plugins: [],
}