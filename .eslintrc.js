// based on https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser", // allows to lint typescript
  plugins: [
    "@typescript-eslint", // allows for TypeScript-specific linting rules to run.
    "eslint-comments", //Additional ESLint rules for ESLint directive comments (e.g. //eslint-disable-line).
    "jest", // rules specific for testing with jest
    "unicorn", // Various awesome ESLint rules 
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "prettier", //Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript", // use airbnb ruleset for typescript as base
    "plugin:react-hooks/recommended", // add lint rules for use of react hooks
    "plugin:jest/recommended", // use recommended jest rules
    "plugin:unicorn/recommended", // use recommended rules of unicorn ruleset
    "plugin:prettier/recommended", // extend eslint-config-prettier rules
    "prettier", // eslint-config-prettier Turns off all rules that are unnecessary or might conflict with Prettier. Must be last.
  ],
  parserOptions: {
    ecmaVersion: 2018,
    jsx: true,
    sourceType: "module",
    useJSXTextNode: true,
    project: ["./tsconfig.app.json", "./tsconfig.server.json", "./tsconfig.test.json"],
  },

  env: {
    node: true,
    browser: true,
    jest: true,
  },
  ignorePatterns: [".cache/**/*", "dist/**/*", ".git/**/*", "node_modules/**/*", ".*.js", "jest.*.js", "jest.*.ts", "src/test/**/*.d.ts"],
  rules: {  
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    "react/jsx-filename-extension": "off",
    "react/jsx-key": "warn",  
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    // Common abbreviations are known and readable
    "unicorn/prevent-abbreviations": "off",
    "@typescript-eslint/no-implied-eval": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "consistent-return": "off",
    "jest/expect-expect": ["error", { assertFunctionNames: ["expect*"] }],
    "react/prop-types": "off",
    "eslint-comments/no-duplicate-disable": "error",
    "eslint-comments/no-unlimited-disable": "error",
    "eslint-comments/no-unused-enable": "error",
    "unicorn/filename-case": "off",
    "unicorn/no-null": "off", // disable because we differ between null and undefined
    "unicorn/no-reduce": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/prefer-ternary": "off",
    // re-enable later:
    "unicorn/prefer-array-index-of": "off",
    "unicorn/no-new-array": "off",
    "unicorn/prefer-at": "off",
    "unicorn/switch-case-braces": "off",
    "unicorn/no-useless-switch-case": "off",
    "unicorn/no-negated-condition": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-useless-fallback-in-spread": "off",
    "unicorn/prefer-date-now": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/prefer-native-coercion-functions": "off",
    "unicorn/no-unnecessary-polyfills": "off",
    "unicorn/prefer-regexp-test": "off",
    "unicorn/explicit-length-check": "off",
    "jest/no-alias-methods": "off",
    "@typescript-eslint/no-redeclare": "off",
    // Use function hoisting to improve code readability
    "no-use-before-define": [
      "off",
      // { functions: false, classes: true, variables: true },
    ],
    "@typescript-eslint/no-use-before-define": [
      "off",
      // { functions: false, classes: true, variables: true, typedefs: false },
    ],
  },
};
