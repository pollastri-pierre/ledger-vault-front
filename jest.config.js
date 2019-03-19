module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  setupFiles: ["<rootDir>/test/__mocks__/polyfills.js"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}"
  ],
  testEnvironment: "node",
  testURL: "http://localhost",
  transform: {
    "^.+\\.(mjs)$": "./test/mock-jest-type.js",
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.css$": "<rootDir>/test/__mocks__/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|css|json)$)":
      "<rootDir>/test/__mocks__/fileTransform.js"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleNameMapper: {
    "^react-native$": "react-native-web"
  },
  moduleFileExtensions: [
    "web.js",
    "mjs",
    "js",
    "json",
    "web.jsx",
    "jsx",
    "node"
  ]
};
