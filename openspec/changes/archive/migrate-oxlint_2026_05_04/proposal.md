# ESLint 迁移至 Oxlint

## 为什么做

当前 ESLint 存在两个问题：
1. Node segfault 导致 ESLint 经常崩溃（已记录在 memory），实际上无法正常使用
2. ESLint 速度慢，大项目 cold start 十几秒

Oxlint 是 Rust 编写的 JS/TS linter，速度比 ESLint 快 50-100 倍，不会有 Node segfault 问题。

## 做什么

- 安装 `oxlint` 替代 `eslint`
- 创建 `.oxlintrc.json` 配置文件（覆盖 TypeScript + React + Import 规则）
- 替换 lint 脚本，新增 `lint:fix` 脚本
- 移除 ESLint 依赖和配置文件
- 保留 `@eslint/eslintrc` 先不删（其他包可能间接依赖）

## 影响范围

- `packages/wuh.site.next/package.json` — 依赖替换 + 脚本更新
- `packages/wuh.site.next/.oxlintrc.json` — 新增配置文件
- `packages/wuh.site.next/eslint.config.mjs` — 删除
- `packages/wuh.site.nest/package.json` — 移除无效的 ESLint 依赖（有依赖有脚本但无配置文件，摆设）
- 根 `package.json` — 移除 `eslint`/`eslint-config-next`/`@typescript-eslint/*` 根依赖

## 不改什么

- 不修改任何业务代码
- pre-commit hook 不存在，无需修改
- components/hooks/config/shared-contracts 包暂不添加 lint
