/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Vite + React
  ],
  theme: {
    extend: {
      fontFamily: {
        sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
        gemunu: ['"Gemunu Libre"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
