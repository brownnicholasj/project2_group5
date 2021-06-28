/*
    Tailwind config file
*/
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        2: 'repeat(2, minmax(20%, 80%))',
      },
    },
  },
  variants: {
    extend: {},
    width: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
