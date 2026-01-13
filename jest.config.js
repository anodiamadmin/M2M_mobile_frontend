module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-expo|expo|@expo|expo-modules-core|react-native|@react-native|expo-router)/)"
  ],
};
