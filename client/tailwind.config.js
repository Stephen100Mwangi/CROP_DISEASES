/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      lato: ['Lato', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
      openSans: ['Open Sans', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        crop: '#4CAF50',
        earth: '#8D6E63',
        warning: '#FFEB3B',
        danger: '#F44336',
        lightBlue: '#81D4FA',
        gray: '#E0E0E0',
        darkGreen: '#2E7D32',
        beige: '#D7CCC8',
      },
    },
  },
  plugins: [],
};
