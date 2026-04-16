module.exports = {
  'src/**/*.{ts,tsx}': () => [
    'eslint --fix src/',
    'prettier --write src/',
  ],
};