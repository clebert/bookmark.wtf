module.exports = {
  purge: {
    mode: 'all',
    preserveHtmlElements: false,
    content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx'],
  },
  darkMode: 'class',
  theme: {
    extend: {
      outline: {
        'blue-400': ['1px solid rgba(96, 165, 250, 1)', '-1px'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
    },
  },
  plugins: [],
};
