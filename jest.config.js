module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'text', 'lcov'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};
