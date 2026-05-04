# Spec: linting

## CHANGED

### Requirement: Oxlint 替代 ESLint

GIVEN 项目已配置 oxlint
WHEN 执行 `pnpm lint:next` 或 `cd packages/wuh.site.next && pnpm lint`
THEN 使用 oxlint（而非 eslint）检查代码
AND 检查速度明显快于 ESLint
AND 不会出现 segfault 异常退出

### Requirement: 配置文件有效

GIVEN `.oxlintrc.json` 存在于 packages/wuh.site.next/
WHEN oxlint 启动
THEN 正确加载配置文件
AND TypeScript + React + Import 规则生效

### Requirement: 保留 ESLint 可行（但不强制）

GIVEN ESLint 依赖已移除
WHEN 未来需要 ESLint 特定规则
THEN 可以重新安装 eslint 并与 oxlint 并行使用（通过 eslint-plugin-oxlint 去重）

### Requirement: 根依赖清理

GIVEN 根 package.json 中存在 `eslint: ^8` 和 `eslint-config-next: 15.0.4`
WHEN 迁移完成
THEN 这两个依赖被移除
AND 全局 `lint:next` 脚本正常工作
