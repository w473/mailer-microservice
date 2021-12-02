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
    'src/main.module.ts',
    'src/app.module.ts',
    'handler/interceptors/errors.interceptor.ts',
    'src/infrastructure/db/entities/*',
    'src/infrastructure/db/custom-typeorm-logger.ts',
    'src/infrastructure/db/database.module.ts',
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
  clearMocks: true,
};
