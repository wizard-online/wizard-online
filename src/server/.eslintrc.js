module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    jsx: false,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  rules: {
    "no-console": "off"
  }
}