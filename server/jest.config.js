const config = {
  verbose: true,
  collectCoverage: true,
  maxWorkers: 1, // disable running tests in parallel
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/db/models/",
  ],
  collectCoverageFrom: [
    // "<rootDir>/index.js",
    "<rootDir>/src/**/*.js",
    // "!<rootDir>/**/*.test.utils.js",
    "!<rootDir>/**/*.queries.js",
  ]
};

module.exports = config;

// // Or async function
// module.exports = async () => {
//   return {
//     verbose: true,
//   };
// };