export default {
  testEnvironment: "node",
  transform: {},
  injectGlobals: true, // ← Enable Jest globals explicitly
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
