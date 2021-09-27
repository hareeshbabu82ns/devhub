const config = {
  verbose: true,
  collectCoverage: true,
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
  ]
};

module.exports = config;

// // Or async function
// module.exports = async () => {
//   return {
//     verbose: true,
//   };
// };