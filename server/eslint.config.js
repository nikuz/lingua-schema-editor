const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-empty': ['error', { 'allowEmptyCatch': true }],
      'indent': ['error', 4],
      // 'object-shorthand': ['error'],
      'quote-props': ['error', 'as-needed'],
      'no-param-reassign': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', { 'caughtErrors': 'none' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
