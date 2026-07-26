# 任务清单

## Phase 1: 样式验证与实现

### Task 1: 建立桌面导航交互回归检查

- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 补充现有 Header 样式断言，覆盖移除胶囊背景和上浮位移。
- [x] 断言桌面 `NavLink` 在 Hover / Focus 状态使用渐隐装饰下划线。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，实现前 21 通过、1 失败

### Task 2: 简化桌面导航样式

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 移除 `NavLink` 的胶囊圆角、悬停背景与上浮位移。
- [x] 使用伪元素实现两端渐隐的 1px 下划线，并限定在 Hover / Focus 状态显示。
- [x] 保留原有文字颜色增强和 `focus-visible` 焦点轮廓。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，22/22 通过

## Phase 2: 语法检查

### Task 3: 检查变更语法

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`、`packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 执行 TypeScript 编译语法检查和 Git 空白错误检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `pnpm exec tsc --noEmit && git diff --check`

## 验收

- [x] 桌面端三个主导航项默认状态不显示下划线。
- [x] Hover 与 `focus-visible` 状态显示 1px 两端渐隐装饰线。
- [x] 导航项不再出现胶囊背景或上浮位移。
- [x] 键盘焦点轮廓、链接点击区域、文案和地址保持不变。
- [x] 移动端菜单实现未修改。
- [x] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 22/22 通过。
- [x] `pnpm exec tsc --noEmit` 零错误。
- [x] `git diff --check` 零错误。
