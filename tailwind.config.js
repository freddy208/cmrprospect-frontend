// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // bleu moderne
        secondary: '#2563EB', // accent légèrement plus clair
        accent: '#FBBF24', // orange pour badges/statuts
        background: '#F9FAFB', // fond clair
        card: '#FFFFFF', // cartes
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
