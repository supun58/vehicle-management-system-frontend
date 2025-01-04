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
        primary: "#800000",
        secondary: "#de9e28",
        maroon: {
          700: "#800000",
          800: "#660000",
        },
        ash: {
          100: "#f5f5f5",
          200: "#e0e0e0",
          500: "#a8a8a8",
          600: "#808080",
          700: "#606060",
          800: "#404040",
        },
      },
    },
  },
  plugins: [],
};
