/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>/src'],
  // setupFilesAfterEnv: ['<rootDir>/config/jest/setupJest.ts'],
  unmockedModulePathPatterns: ['utils'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
export default config
