module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/dist/",
    "<rootDir>/src/test/skip/",
  ],
};
