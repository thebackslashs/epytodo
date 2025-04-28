// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['src/**/*.js'],
    ignores: ['node_modules/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...prettierRecommended.rules,
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },
];
