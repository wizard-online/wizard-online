module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  setupFiles: ["jest-localstorage-mock", "jest-date-mock"],
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/test/mocks/fileMock.js",
  },
  testMatch: ["<rootDir>/src/test/scenario.test.tsx"],
  testTimeout: 30000,
};
