/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C7C7C7",
        secondary: "#1E1E1E",
        tertiary: "#808080",
      },
      boxShadow: {
        button: "6px 6px #808080",
      },
    },
  },
  plugins: [],
};
