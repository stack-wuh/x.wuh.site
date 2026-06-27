# 任务拆分

## Phase 1 — Card 组件实现

- [ ] T1: 实现 Card 样式与基础结构
  - 涉及文件: `packages/components/card/index.tsx`, `packages/components/card/styles/index.ts`
  - 产出: Material 风格 Card，支持 variant/elevation

- [ ] T2: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/card/readme.md`

## Phase 2 — 验证

- [ ] T3: 验证样式与兼容性
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 light/dark、hover/press 动画、reduced-motion
