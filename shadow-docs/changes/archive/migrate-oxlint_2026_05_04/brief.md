# ESLint 迁移至 Oxlint

> 原始变更名：`migrate-oxlint_2026_05_04`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/linting/spec.md`

## 决策
# 设计：Oxlint 配置

## 配置文件

`.oxlintrc.json` — oxlint 原生 JSON 配置，无需 TypeScript 编译即可使用。

## 规则设置

### 基础设置
- `categories.correctness: "warn"` — 正确性规则默认 warn
- `plugins: ["import", "typescript", "unicorn", "react"]`
- `env.browser: true`
- `settings.react.version: "19.0.0"`

### Ignore
- `.next/**`, `out/**`, `build/**`, `dist/**`
- `next-env.d.ts`
- 设计 playground: `app/design/system-color/**`

## 脚本

```json
{
  "lint": "oxlint app --ignore-pattern 'dist/**' --ignore-pattern '.next/**'",
  "lint:fix": "oxlint app --fix --ignore-pattern 'dist/**' --ignore-pattern '.next/**'"
}
```

## 迁移映射

| ESLint (next/core-web-vitals) | Oxlint 覆盖 |
|------|------|
| eslint-plugin-react-hooks | ✅ react 插件内置 |
| @next/next rules | ❌ 不覆盖（非关键） |
| @typescript-eslint | ✅ typescript 插件 |

根 package.json 移除 `eslint: ^8` 和 `eslint-config-next: 15.0.4`（未使用）。

## 任务
### Phase 1 — Next.js 前端 (无依赖，可并行)
- [x] T1: `packages/wuh.site.next/package.json` — 安装 oxlint，移除 eslint/eslint-config-next，替换脚本
- [x] T2: 新建 `packages/wuh.site.next/.oxlintrc.json`
- [x] T3: 删除 `packages/wuh.site.next/eslint.config.mjs`
### Phase 2 — 根 + Nest 清理 (无依赖，可并行)
- [x] T4: 根 `package.json` — 移除 eslint/eslint-config-next/@typescript-eslint/* 根依赖
- [x] T5: `packages/wuh.site.nest/package.json` — 移除无效的 eslint 依赖和 lint 脚本
### Phase 3 — 验证
- [x] T6: 运行 `oxlint app` — 53ms 检查 38 文件，7w 0e ✅

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-04
```

### `design.md`
# 设计：Oxlint 配置

## 配置文件

`.oxlintrc.json` — oxlint 原生 JSON 配置，无需 TypeScript 编译即可使用。

## 规则设置

### 基础设置
- `categories.correctness: "warn"` — 正确性规则默认 warn
- `plugins: ["import", "typescript", "unicorn", "react"]`
- `env.browser: true`
- `settings.react.version: "19.0.0"`

### Ignore
- `.next/**`, `out/**`, `build/**`, `dist/**`
- `next-env.d.ts`
- 设计 playground: `app/design/system-color/**`

## 脚本

```json
{
  "lint": "oxlint app --ignore-pattern 'dist/**' --ignore-pattern '.next/**'",
  "lint:fix": "oxlint app --fix --ignore-pattern 'dist/**' --ignore-pattern '.next/**'"
}
```

## 迁移映射

| ESLint (next/core-web-vitals) | Oxlint 覆盖 |
|------|------|
| eslint-plugin-react-hooks | ✅ react 插件内置 |
| @next/next rules | ❌ 不覆盖（非关键） |
| @typescript-eslint | ✅ typescript 插件 |

根 package.json 移除 `eslint: ^8` 和 `eslint-config-next: 15.0.4`（未使用）。

### `proposal.md`
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

### `specs/linting/spec.md`
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

### `tasks.md`
# 任务拆分

## Phase 1 — Next.js 前端 (无依赖，可并行)

- [x] T1: `packages/wuh.site.next/package.json` — 安装 oxlint，移除 eslint/eslint-config-next，替换脚本
- [x] T2: 新建 `packages/wuh.site.next/.oxlintrc.json`
- [x] T3: 删除 `packages/wuh.site.next/eslint.config.mjs`

## Phase 2 — 根 + Nest 清理 (无依赖，可并行)

- [x] T4: 根 `package.json` — 移除 eslint/eslint-config-next/@typescript-eslint/* 根依赖
- [x] T5: `packages/wuh.site.nest/package.json` — 移除无效的 eslint 依赖和 lint 脚本

## Phase 3 — 验证

- [x] T6: 运行 `oxlint app` — 53ms 检查 38 文件，7w 0e ✅
