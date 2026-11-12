module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 类型正确性由 CI typecheck 四域背书——jest 内跳过 ts-jest 逐文件 full
  // diagnostics（@octokit/rest 等巨型类型树会 OOM，gate 首跑 20261112 实测）
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
