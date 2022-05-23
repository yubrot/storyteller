const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{jsx,ts,jsx,tsx}'],
  variants: {
    extend: {
      cursor: ['disabled'],
      pointerEvents: ['disabled'],
    },
  },
  plugins: [],
}
