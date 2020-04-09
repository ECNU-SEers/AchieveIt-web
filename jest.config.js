module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.(js|jsx)?$": "babel-jest"
  },
  transformIgnorePatterns: ["/node_modules/*"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/tests/coverage",
  collectCoverageFrom: [
    "!**/node_modules/**",
    "<rootDir>/src/views/permission/**/*.vue",
    "<rootDir>/src/views/project/ProjectBasic.vue",
    "<rootDir>/src/views/project/ProjectMember.vue",
    "<rootDir>/src/views/project/ProjectFunction.vue"
  ],
  modulePathIgnorePatterns: ["/node_modules/*"],
  coverageReporters: ["html", "text-summary"]
};
