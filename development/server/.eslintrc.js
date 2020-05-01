module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    global: true,
    module: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'max-len': ['error', { code: 100 }],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
