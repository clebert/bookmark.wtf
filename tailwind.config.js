module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: {
    content: ['./src/**/*.{html,ts,tsx}'],
  },
  theme: {
    extend: {
      outline: {
        'blue-400': ['1px solid rgba(96, 165, 250, 1)', '-1px'],
      },
    },
  },
};
