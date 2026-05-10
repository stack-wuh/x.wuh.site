# 任务拆分

## Phase 1 — 移除滚动事件

- [x] T1: 删除 `useScrollProgress.ts`
- [x] T2: 删除 `ReadingProgressBar.tsx`
- [x] T3: 更新 `PostView.tsx` 移除相关导入和调用
- [x] T4: 更新 `FloatingActions.tsx` 移除 scrollPercent prop

## Phase 2 — 纯 CSS 进度条

- [x] T5: Container::before 添加 scroll-driven animation 进度条
- [x] T6: 移除 createLightGradient/createDarkGradient 死代码

## Phase 3 — 验证

- [x] T7: 本地 dev server 手动验证进度条正常、无闪屏
