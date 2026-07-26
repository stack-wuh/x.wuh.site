# 任务清单

## Phase 1: 复现与最小修复

### Task 1: 建立留言板入口样式回归检查

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 复现 Hover 背景变化后文字对比与过渡不同步的问题。
- [x] 断言入口使用纸张轻染状态、统一 `220ms ease`，并包含键盘 Focus 与减少动态规则。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 2 项测试均因缺少目标规则而失败

### Task 2: 修复留言板入口 Hover 样式

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 保持浅色纸张基底，通过低强度暖色渐变实现 Hover / Focus 反馈。
- [x] 为背景、边框、标题、预览文字和 CTA 配置统一的 `220ms ease` 过渡。
- [x] 使用语义颜色令牌保证亮色、暗色主题下文字清晰可读。
- [x] 增加 `prefers-reduced-motion: reduce` 降级规则。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 新增回归测试 2/2 通过

## Phase 2: 语法验收

### Task 3: 检查入口状态与主题适配

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 审查亮色和暗色主题的默认、Hover、`focus-visible` 状态规则。
- [x] 审查背景、边框与三层文字的同步过渡声明和目标色切换。
- [x] 确认未修改移动布局、入口点击和留言弹窗实现。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 独立语法与范围审查；发现并修复文字仅声明 transition、未切换颜色的问题

### Task 4: 执行语法检查

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`、`packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 执行 Node 语法检查、相关测试和 Git diff 空白检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`

## 验收

- [x] Hover 后标题、预览文案和 CTA 使用高对比语义颜色。
- [x] 入口保持浅色纸张基底，不切换为深色实底。
- [x] 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡。
- [x] `focus-visible` 获得等价视觉反馈和清晰焦点轮廓。
- [x] 减少动态偏好下取消过渡但保留状态反馈。
- [x] 头像、文案、布局、点击行为与弹窗逻辑未修改。
- [x] 相关测试 2/2 通过且 `git diff --check` 零错误。
