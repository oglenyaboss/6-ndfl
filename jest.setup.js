// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Mock next/navigation for testing
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock nanoid to avoid ES module issues
jest.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid-id',
}));

// Mock xml2js
jest.mock('xml2js', () => ({
  Parser: jest.fn().mockImplementation(() => ({
    parseStringPromise: jest.fn().mockResolvedValue({}),
  })),
  Builder: jest.fn().mockImplementation(() => ({
    buildObject: jest.fn().mockReturnValue('<xml></xml>'),
  })),
}));

// Mock iconv-lite
jest.mock('iconv-lite', () => ({
  encode: jest.fn().mockReturnValue(Buffer.from('test')),
  decode: jest.fn().mockReturnValue('test'),
}));

// Global test setup
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};