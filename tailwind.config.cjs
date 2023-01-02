/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": { max: "1535px" },
        hxl: { max: "1350px" },
        xl: { max: "1279px" },
        lg: { max: "1024px" },
        mdb: { max: "768px" },
        smb: { max: "639px" },
        smb2: { max: "572px" },
        slg: { max: "505px" },
        xs: { max: "430px" },
      },
      dropShadow: {
        "3xl": "0 0 4rem rgba(17, 24, 39, 1)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-slow-r": "spin 3s linear infinite reverse",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
