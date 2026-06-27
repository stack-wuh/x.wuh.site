# 任务拆分

## Phase 1 — Tag 组件实现

- [ ] T1: 创建 Tag 组件结构与 styled-components 样式
  - 涉及文件: `packages/components/tag/index.tsx`, `packages/components/tag/styles/index.ts`
  - 产出: 胶囊样式 Tag 组件，支持 color prop

- [ ] T2: 更新组件导出
  - 涉及文件: `packages/components/index.ts`
  - 产出: `@wuh.site/components` 可导入 Tag

## Phase 2 — 页面接入

- [ ] T3: 在 HomeView.tsx 中接入 Tag 组件
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`
  - 产出: 替换 CardHeader 内联标签为 Tag 组件

## Phase 3 — 验证

- [ ] T4: 验证 light/dark 模式与响应式
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 hover 动画、标签颜色、移动端表现
