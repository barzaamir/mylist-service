module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.int.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transformIgnorePatterns: ["/node_modules/"]
};
