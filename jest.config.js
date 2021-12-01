module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'index.ts',
    'signup-controller-protocols.ts',
    'login-controller-protocols.ts',
    'add-survey-controller-protocols.ts',
    'db-add-account-protocols.ts',
    'db-authentication-protocols.ts',
    'db-add-survey-protocols.ts'
  ],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
