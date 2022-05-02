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
    'db-add-survey-protocols.ts',
    'auth-middleware-protocols.ts',
    'load-surveys-controller-protocols.ts',
    'db-load-account-by-token-protocols.ts',
    'db-save-survey-result-protocols.ts',
    'db-load-survey-by-id-protocols.ts',
    'db-load-surveys-protocols.ts',
    'save-survey-result-controller-protocols.ts'
  ],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
