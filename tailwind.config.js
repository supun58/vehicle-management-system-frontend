/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // For React projects
    "./public/index.html", // Include HTML files
  ],
  theme: {
    extend: {
      colors: {
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
