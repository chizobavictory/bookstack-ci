module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
      '^types/(.*)$': '<rootDir>/src/types/$1',
      '^utils/(.*)$': '<rootDir>/src/utils/$1',
      '^service/(.*)$': '<rootDir>/src/service/$1',
      '^models/(.*)$': '<rootDir>/src/models/$1',
      '^config/(.*)$': '<rootDir>/src/config/$1',
    },
    testTimeout: 20000,
    collectCoverage: true,
    collectCoverageFrom: [
      'src/controllers/**/*.ts',
      'src/service/**/*.ts',
      '!src/server.ts',
      '!src/config/**',
      '!src/test/**',
    ],
    coverageThreshold: {
      global: {
        statements: 80,
        functions: 80,
        lines: 80,
      },
    },
    coverageReporters: ['text-summary', 'json', 'lcov', 'clover'],
  };
  