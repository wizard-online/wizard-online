module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-localstorage-mock", "jest-date-mock"],
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/test/mocks/fileMock.js",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/dist/",
    "<rootDir>/src/test/skip/",
    "<rootDir>/src/test/scenario",
  ],
};
