module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '\\.(component-)?test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!**/bin/**', '!**/src/types/**'],
  coveragePathIgnorePatterns: [
    'src/main.ts',
    'src/app.module.ts',
    'src/infrastructure/db/migrations/*',
  ],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
  setupFiles: ['<rootDir>test.config.ts'],
  clearMocks: true,
};
