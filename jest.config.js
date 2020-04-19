module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-localstorage-mock"],
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/dist/",
    "<rootDir>/src/test/skip/",
  ],
};
