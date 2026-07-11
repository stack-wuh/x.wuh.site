# TypeScript 配置体系重新设计

## 背景

monorepo 中 `tsc`/`nest build` 间歇性 segfault（TypeScript 5.9.3 on macOS + Node 20），根 tsconfig 使用 `**/*.ts` 全局通配导致编译扫描范围失控，各包 tsconfig 缺少 include/exclude 定义。

## 目标

- 消除 tsc segfault，构建稳定通过
- 构建与类型检查分离：`pnpm build` 纯转译，`pnpm typecheck` 全量检查
- tsconfig 层级清晰：base → root → packages
- 统一 TypeScript 版本，消除版本混杂

## 方案

方案 A — 分层 tsconfig + 分离构建/检查：

- `pnpm build` = 纯转译（SWC / Next.js），不跑 tsc
- `pnpm typecheck` = 全量 `tsc --noEmit`，CI 跑，本地可选
- TypeScript 锁定 `~5.7.2`

## 范围

- `tsconfig.base.json`（新建）
- `tsconfig.json`（root，重写）
- `packages/shared-contracts/tsconfig.json`（重写，合并 tsconfig.build.json）
- `packages/wuh.site.nest/tsconfig.json`（重写）
- `packages/wuh.site.next/tsconfig.json`（重写）
- `packages/wuh.site.nest/nest-cli.json`（typeCheck: false）
- root `package.json`（scripts）

## 风险

- shared-contracts 须在 nest 之前构建（nest 依赖 .d.ts）
- TypeScript 降级到 5.7.2 需确认无 breaking change
