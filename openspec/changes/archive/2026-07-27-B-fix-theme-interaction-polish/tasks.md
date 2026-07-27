# 任务清单

## Phase 1: 建立回归测试

### Task 1: 复现 Header 双下划线

- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 断言 `NavLink` 在 Hover / `focus-visible` 状态显式禁用原生文字下划线。
- [x] 断言现有 `::after` 主题色装饰线保持不变。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 21/22 通过，新增断言因缺少局部 `text-decoration: none` 失败

### Task 2: 复现留言板非主题色渐变

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 断言背景渐变使用 `--primary-color`，且不使用 `--accent-color` 作为背景主色。
- [x] 断言暗色分支使用 `[data-color-scheme='dark']`，不使用 `prefers-color-scheme`。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 1/2 通过，新增断言因色源和主题路由不符失败

## Phase 2: 最小样式修复

### Task 3: 修复 Header 单下划线

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 在 Hover / `focus-visible` 中覆盖全局文字下划线。
- [x] 保留 1px `--primary-color` 伪元素装饰线和焦点轮廓。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** Header 回归测试 22/22 通过

### Task 4: 实现留言板单向主题雾化

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 使用 `--primary-color` 与纸张底色构建 105deg 左向右自然衰减渐变。
- [x] 左侧强调线、边框和 CTA 使用主题色语义。
- [x] 暗色分支改用 `[data-color-scheme='dark'] &`。
- [x] 保留 `220ms ease`、文字可读性和 reduced-motion。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 留言板回归测试 2/2 通过

## Phase 3: 语法与范围检查

### Task 5: 检查变更语法和范围

- [x] **文件:** 上述 4 个实现与测试文件
- [x] 执行 Node 语法检查、相关测试与 Git diff 空白检查。
- [x] 确认未修改全局链接规则、移动菜单、留言弹窗或业务逻辑。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`，24/24 通过

## 验收

- [x] Header Hover / `focus-visible` 仅显示一条 1px 主题色装饰线。
- [x] Header 不再显示浏览器文字下划线，正文链接规则未改变。
- [x] 留言板默认与 Hover / Focus 背景均使用当前 `--primary-color`。
- [x] 留言板渐变从左向右自然衰减并保留纸张基底。
- [x] 酒红/素雅及亮色/暗色主题均通过 `data-*` 主题状态自动适配。
- [x] 背景、边框和文字保留统一 `220ms ease`，reduced-motion 下取消动画。
- [x] 相关测试 24/24 通过，`git diff --check` 零错误。
