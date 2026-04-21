const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/src/exercises/", "/dist/"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.js"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};