---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[ \] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: Header 图标修复

### Task 1: 独立移动菜单按钮样式

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 将 `MobileToggle` 从通用 `Button` 改为原生 `styled.button`。
- [ ] 保留 44×44 触摸目标、响应式断点、交互状态和无障碍行为。
- [ ] 为内部 SVG 固定 20×20 尺寸并禁止 flex 压缩。
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- **预计耗时:** 30 分钟
- **实际耗时:** 已完成，约 20 分钟

### Task 2: 增加图标回归测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言移动按钮继续渲染 `IconBars`。
- [ ] 断言按钮使用独立 `styled.button` 和明确 SVG 样式。
- [ ] **验证:** `node --test test/site-header-theme-toggle.test.mjs`（工作目录：`packages/wuh.site.next`）
- **预计耗时:** 20 分钟
- **实际耗时:** 已完成，约 10 分钟

## Phase 2: 验收

### Task 3: 运行静态检查

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`, `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 运行 Header 定向 lint 和 diff 格式检查。
- [ ] 记录 TypeScript/生产构建工具异常，不将环境崩溃误判为代码通过。
- [ ] **验证:** `./node_modules/.bin/oxlint app/components/SiteHeader`、`git diff --check`
- **预计耗时:** 20 分钟
- **实际耗时:** 已完成，定向 lint 与 diff 检查通过；全量类型检查/构建受环境 SIGSEGV 影响

## 验收

- [ ] 移动端 Header 右侧汉堡菜单按钮显示 `IconBars`。
- [ ] 图标固定为 20×20，且不会因 flex 收缩或通用按钮样式消失。
- [ ] 菜单按钮的展开/收起、ARIA 属性和桌面端显示逻辑保持不变。
- [ ] Header 回归测试通过。
