# 任务清单

## Phase 1: 修复防闪烁机制

### Task 1: 修正 data-no-transition 属性名
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 用 `setAttribute('data-no-transition', '')` 替代 `dataset.noTransition = 'true'`
- [x] **原因:** dataset API 将驼峰转全小写，导致 `data-notransition` 与 CSS `[data-no-transition]` 不匹配

### Task 2: 调整执行顺序
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 先禁用过渡 → 强制 reflow → 设置 data 属性 → 恢复过渡
- [x] 添加 `void document.documentElement.offsetHeight` 确保 CSS 已重新计算

### Task 3: 移除冲突的 color-scheme
- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 移除 `@media (prefers-color-scheme: dark) { html { color-scheme: dark; } }`
- [x] 由 viewport 的 `colorScheme: 'light dark'` 统一管理

## 验收

- [x] TypeScript 编译通过
- [ ] 手动测试：刷新页面无闪烁
- [ ] 手动测试：dark/light 模式切换正常
