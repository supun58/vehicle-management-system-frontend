//** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {      
      
      colors: {
      primary: '#800000',
      secondary: '#de9e28',
    }},
  },
  plugins: [],
}