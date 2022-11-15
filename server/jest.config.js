module.exports = {
  preset: 'ts-jest', // to use typescript
  verbose: true,
  moduleNameMapper: {
    '@apis/(.*)': '<rootDir>/apis/$1',
    '@config': '<rootDir>/config',
    '@constants/(.*)': '<rootDir>/constants/$1',
    '@db': '<rootDir>/db',
    '@middlewares/(.*)': '<rootDir>/middlewares/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@errors/(.*)': '<rootDir>/errors/$1',
  },
};
