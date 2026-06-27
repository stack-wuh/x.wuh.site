# 任务拆分

## Phase 1 — Dialog 组件实现

- [ ] T1: 创建 Dialog 组件结构与样式
  - 涉及文件: `packages/components/dialog/index.tsx`, `packages/components/dialog/styles/index.ts`
  - 产出: 支持 open/close/fullScreen 的 Dialog 组件

- [ ] T2: 实现 useDialog hook
  - 涉及文件: `packages/hooks/useDialog/index.ts`
  - 产出: 管理 Dialog 打开/关闭状态的 hook

- [ ] T3: 更新组件导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/dialog/readme.md`

## Phase 2 — 验证

- [ ] T4: 验证 Dialog 功能与无障碍
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证打开/关闭、全屏、ESC 关闭、焦点管理
