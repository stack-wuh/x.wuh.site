# 任务拆分

## Phase 1 — 重写 404 页面

- [x] T1: 重写 `app/not-found.tsx` — 移除 Result 组件和 GlobalLayout，改为 typography 驱动的 editorial 风格布局
  - 涉及文件: `app/not-found.tsx`
  - 预计耗时: 30min

## Phase 2 — 重写 500 页面

- [x] T2: 重写 `app/error.tsx` — 与 not-found.tsx 保持一致的布局，保留 reset() 重试按钮
  - 涉及文件: `app/error.tsx`
  - 预计耗时: 20min

- [x] T3: 重写 `app/post/[number]/error.tsx` — 同布局，博客相关文案
  - 涉及文件: `app/post/[number]/error.tsx`
  - 预计耗时: 15min

## Phase 3 — 验证

- [ ] T4: TypeScript 类型检查通过
- [ ] T5: 本地 dev server 手动验证 404/500 页面风格与首页一致
