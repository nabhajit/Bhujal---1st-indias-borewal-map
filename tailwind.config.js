/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html', './static/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        'nerko': ['Nerko One'],
      }
    },
  },
  plugins: [],
}

