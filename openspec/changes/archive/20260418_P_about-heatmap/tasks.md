# 任务拆分

## Phase 1 — 数据层

- [ ] T1: 定义数据契约与 API 接口
  - 涉及文件: `packages/wuh.site.next/app/about/api.ts`
  - 产出: Contribution 类型 + 数据获取

## Phase 2 — 页面实现

- [ ] T2: 实现 About 页面 Hero + About 板块
- [ ] T3: 实现热力图组件
  - 涉及文件: `packages/wuh.site.next/app/about/Heatmap.tsx`
  - 产出: 多平台热力图（格子/Tooltip/平台切换/时间窗口）

- [ ] T4: 实现日志列表区 + 联系板块

## Phase 3 — 验证

- [ ] T5: 验证页面功能
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证热力图切换、Tooltip、响应式、dark mode
