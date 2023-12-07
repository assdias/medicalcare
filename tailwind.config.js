/** @type {import('tailwindcss').Config} */
const brand = require('./brand.config.js');
module.exports = {
  prefix: 'tw-',
  content: ['./src/**/*.{html,js,vue,ts}'],
  theme: {
    extend: {
      darkMode: 'class',
      colors: brand,
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
