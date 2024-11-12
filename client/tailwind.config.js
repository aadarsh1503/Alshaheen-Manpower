/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        DarkRed: '#c0190f',
        darkgray:'#e9e9e9',

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