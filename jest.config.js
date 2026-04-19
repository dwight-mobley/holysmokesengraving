const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/src/exercises/"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};