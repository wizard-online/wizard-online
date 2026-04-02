import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import jestPlugin from 'eslint-plugin-jest';
import unicornPlugin from 'eslint-plugin-unicorn';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';

const gitignorePath = path.resolve('.', '.gitignore');

export default defineConfig([
  // Ignore .gitignore entries + extra patterns
  includeIgnoreFile(gitignorePath),
  { ignores: ['jest.*.js', 'jest.*.ts', 'src/test/**/*.d.ts'] },

  // JS base + airbnb base
  { name: 'js/config', ...js.configs.recommended },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,

  // React + hooks + a11y
  plugins.react,
  plugins.reactHooks,
  plugins.reactA11y,
  ...configs.react.recommended,

  // TypeScript
  plugins.typescriptEslint,
  ...configs.base.typescript,
  ...configs.react.typescript,

  // Jest — scoped to test files
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**/*.{ts,tsx}'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
      'jest/no-alias-methods': 'off',
    },
  },

  // Unicorn
  unicornPlugin.configs['flat/recommended'],

  // ESLint comments
  eslintComments.recommended,

  // Custom project rules (ported from .eslintrc.js)
  {
    rules: {
      // Import rules — renamed from import/ to import-x/
      'import-x/prefer-default-export': 'off',
      'import-x/no-default-export': 'error',

      // React
      'react/jsx-filename-extension': 'off',
      'react/jsx-key': 'warn',
      'react/prop-types': 'off',
      'react/function-component-definition': 'off',
      'react/require-default-props': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/jsx-no-useless-fragment': 'error',

      // TypeScript (non-type-aware — safe for all files)
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-require-imports': 'off',

      // Core
      'consistent-return': 'off',
      'no-use-before-define': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'no-promise-executor-return': 'error',
      'arrow-body-style': 'error',

      // ESLint comments
      '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/no-unused-enable': 'error',
      '@eslint-community/eslint-comments/disable-enable-pair': 'off',

      // Unicorn — all off
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-reduce': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-array-index-of': 'off',
      'unicorn/no-new-array': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/no-useless-switch-case': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-native-coercion-functions': 'off',
      'unicorn/no-unnecessary-polyfills': 'off',
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/explicit-length-check': 'off',
      'unicorn/consistent-existence-index-check': 'error',
      'unicorn/prefer-global-this': 'off',
    },
  },

  // Type-aware TS rules — only for .ts/.tsx (require type information)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
    },
  },

  // Server files — allow console
  {
    files: ['src/server/**/*.{ts,tsx,js}'],
    rules: {
      'no-console': 'off',
    },
  },

  // CJS files — allow module/require globals
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
      },
    },
  },

  // Test files — allow devDependencies imports
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**/*.{ts,tsx}'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  // Prettier — MUST be last to override conflicting rules
  {
    plugins: { prettier: prettierPlugin },
  },
  {
    rules: {
      ...prettierConfigRules,
      'prettier/prettier': 'error',
    },
  },
]);
