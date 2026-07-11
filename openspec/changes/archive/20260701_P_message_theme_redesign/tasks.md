# 任务清单

## Phase 1: Toast 主题重设计

### Task 1: 重写 Message 样式

- [ ] **文件:** `packages/components/message/styles/index.tsx`
- [ ] MessageItem 背景用 `--background-color`，文字用 `--text-color`
- [ ] MessageIcon 类型颜色保持不变（success/warning/error/loading/info）
- [ ] 暗黑模式下通过 `@media (prefers-color-scheme: dark)` 放大 box-shadow
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 切换酒红/素雅 + 亮/暗，Toast 颜色跟随
