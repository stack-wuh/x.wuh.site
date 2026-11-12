module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // diagnostics:false（类型由 CI typecheck 四域背书）。不可开 isolatedModules：
  // 它会让 ts-jest 跳过 jest.mock hoisting——mock 晚于 @octokit/rest 真实包加载，
  // 实例上无 mock 方法（20261112 gate 五轮实证；webhook spec 曾以默认模式稳定过）
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
