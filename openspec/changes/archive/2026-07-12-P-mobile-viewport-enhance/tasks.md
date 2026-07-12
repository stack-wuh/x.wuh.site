# 任务清单

## Phase 1: 扩展 Viewport 配置

### Task 1: 添加 themeColor 和 colorScheme

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `viewport` 导出中添加 `themeColor` 数组（亮/暗各一条）
- [ ] 添加 `colorScheme: 'light dark'`
- [ ] **验证:** `oxlint` 零错误

## 验收

- [ ] oxlint 零错误
- [ ] 亮色模式移动端浏览器工具栏显示暗红色
- [ ] 暗色模式移动端浏览器工具栏显示深黑色
- [ ] 首屏加载无闪白
