module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {branches: 100, functions: 100, lines: 100, statements: 100},
  },
  silent: true,
  testMatch: ['**/src/**/*.test.ts'],
  verbose: true,
};
