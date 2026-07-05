# 任务清单

## Phase 1: API 查询语义

### Task 1: 调整多 label 查询为 AND

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 将 `labels` 查询从 `$in` 改为 `$all`。
- [x] 保持单 label、无 label、`state=open` 查询行为不变。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** `node node_modules/jest/bin/jest.js src/modules/content/content.controller.spec.ts --runInBand --verbose` 曾观察到 6/6 通过；后续重跑在当前 runtime 偶发 exit 139。

### Task 2: 补充后端单元测试

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.spec.ts`
- [x] 覆盖多个 labels 输入时 controller 传递 `{ labels: { $all: [...] } }`。
- [x] 覆盖单 label 输入仍能正常查询。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** 先观察到 `$in` vs `$all` 失败，再观察到 6/6 通过；`pnpm --filter` 在当前环境 exit 139。

## Phase 2: 前端多标签状态

### Task 3: 解析和请求多个 labels

- [x] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [x] 将 active label 状态从单值改为去重数组。
- [x] 支持重复查询参数和逗号分隔两种 URL 输入。
- [x] 将多 labels 传给 `contentService.getPosts.server`。
- [x] **预计耗时:** 40 分钟
- [x] **实际耗时:** 35 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 4/4 通过；`packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/blog` 通过。

### Task 4: 多 token 和 URL 生成

- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] `buildBlogUrl` 支持多个 labels，并在分页链接中保留全部 labels。
- [x] 标签菜单点击未选标签时追加筛选条件并重置页码。
- [x] 已选标签渲染为多个 token，每个 token 可单独移除。
- [x] 已选 token 只显示标签名，不显示 `(+count)`。
- [x] **预计耗时:** 50 分钟
- [x] **实际耗时:** 35 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 覆盖多 labels URL、追加、移除。

## Phase 3: 过滤条视觉和文案

### Task 5: 标签数量与入口文案

- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 下拉项显示 `name(+count)`。
- [x] 当存在已选标签时，入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- [x] 移除 `open posts` / `filtered by` 结果提示文案。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 覆盖数量文案。

### Task 6: 统一主题色背景

- [x] **文件:** `packages/wuh.site.next/app/blog/styles/index.ts`
- [x] 过滤条容器、工具栏、菜单、hover、active、token 背景统一使用主题色相关 CSS 变量。
- [x] 保持浅色/暗色主题下文字对比度和可点击区域清晰。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/blog` 通过。

## 验收

- [x] `/blog?labels=javascript&labels=react` 只展示同时包含两个标签的 open 博客。
- [x] 分页链接保留全部已选 labels。
- [x] 已选 token 可以单独移除，移除最后一个 token 后回到无筛选状态。
- [x] 标签菜单项显示 `标签名(+数量)`。
- [x] 选择标签时入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- [x] 过滤条背景、hover、active、token 状态与主题色保持一致。
- [ ] `node node_modules/typescript/bin/tsc --noEmit` 当前环境 exit 139，未取得类型检查结果。
