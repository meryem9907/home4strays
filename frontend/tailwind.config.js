/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*"],
  theme: {
    extend: {},
  },
  plugins: ["daisyui"],
  daisyui: {
    themes: ["light-h4s", "dark-h4s"],
    darkTheme: "dark-h4s",
  },
};
