/* eslint-disable @typescript-eslint/no-var-requires */
const mainJestConfig = require("./jest.config");

module.exports = {
  ...mainJestConfig,
  testPathIgnorePatterns: [
    ...mainJestConfig.testPathIgnorePatterns,
    "<rootDir>/src/test/scenario",
  ],
};
