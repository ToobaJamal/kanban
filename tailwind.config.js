/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './index.js'],
  theme: {
    extend: {
      colors: {
        'blue-background': '#847BF9',
        'brown-light': '#ECCC6D',
        'brown-dark': '#C2934B',
        'blue-light': '#3DC4FA',
        'blue-dark': '#0082A9',
        'green-light': '#2FD669',
        'green-dark': '#0BAE27',
        'white': '#FCFCFA',
        'card-background': '#CCCCDB',
        'black': '#36454F',
        'green': '#009E60'
      },
      fontFamily: {
        custom: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
  
