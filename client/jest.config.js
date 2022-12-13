module.exports = {
  preset: 'ts-jest', // to use typescript
  verbose: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'common/(.*)': '<rootDir>/src/components/common/$1',
    'components/(.*)': '<rootDir>/src/components/$1',
    'config/(.*)': '<rootDir>/src/config/$1',
    '^.+\\.(css|less|scss)$': 'babel-jest',
    'styles/(.*)': '<rootDir>/src/styles/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
