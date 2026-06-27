# 任务拆分

## Phase 1 — Image 组件实现

- [ ] T1: 搭建目录结构与基础封装
  - 涉及文件: `packages/components/image/index.tsx`, `packages/components/image/types.ts`
  - 产出: 基于 next/image 的 Image 组件，支持 variant/ratio

- [ ] T2: 实现 loading skeleton 与错误 fallback
  - 涉及文件: `packages/components/image/styles/index.ts`
  - 产出: shimmer skeleton + 错误插画兜底

- [ ] T3: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/image/readme.md`

## Phase 2 — 验证

- [ ] T4: 验证各状态与场景
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证正常加载/skeleton/错误/不同 ratio/响应式
