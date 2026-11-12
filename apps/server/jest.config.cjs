module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // isolatedModules（纯转译，不建 ts.Program）：类型正确性由 CI typecheck 四域背书。
  // 默认 diagnostics 会解析 @octokit/@nestjs 巨型类型图，gate 首跑实测 transform
  // 阶段 OOM 4GB（20261112 两轮实证），isolated+无诊断是标准解法
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true, diagnostics: false }],
  },
};
