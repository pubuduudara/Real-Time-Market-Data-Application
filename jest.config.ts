import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Use TypeScript for setup file
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transpile TypeScript test files
  },
};

export default config;
