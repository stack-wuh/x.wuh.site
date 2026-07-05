# 任务清单

## Phase 1: 后端标签汇总接口

### Task 1: 新增 labels 汇总能力

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.service.ts`
- [x] 新增 labels 聚合方法，按 `state=open` 统计 Content labels 出现次数。
- [x] 返回结构为 `{ name: string; count: number }[]`，按数量倒序、名称升序保证稳定展示。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.5h
- [ ] **验证:** 调用 service 方法可得到去重后的 labels 与计数。

### Task 2: 暴露 labels API

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 新增 `GET /content/labels?state=open` 接口。
- [x] 保持 `GET /content/posts` 的 labels 筛选语义不变。
- [x] **文件:** `packages/shared-contracts/src/endpoints.ts`
- [x] 如需要，为 `contentService` 增加 `getLabels` endpoint 定义。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.25h
- [ ] **验证:** 接口返回 labels 汇总，不包含 closed 内容。

## Phase 2: 查询参数与数据接入

### Task 3: 接入 labels 查询参数

- [x] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [x] 新增 `toLabelParam()`，从 `searchParams.labels` 中解析单个有效 label。
- [x] `getIssues()` 支持接收 `label?: string`，调用 `contentService.getPosts.server` 时传入 `labels`。
- [x] 并行请求 posts 与 labels 汇总，向 `BlogListView` 传入 `activeLabel`、`availableLabels`、`pagination.total` 等展示所需数据。
- [ ] **预计:** 0.5h
- [ ] **实际:** 约 0.4h
- [ ] **验证:** 访问 `/blog` 与 `/blog?labels=<label>` 请求参数正确，均只查询 `state=open`。

## Phase 3: 分类过滤条 UI

### Task 4: 新增 GitHub Issues 风格过滤条

- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 新增分类过滤条区域，展示 `Labels ▾`、结果说明、活跃筛选 token。
- [x] 分类入口使用可访问的链接或按钮列表，点击分类跳转 `/blog?labels=<label>`。
- [x] 清除筛选跳转 `/blog`。
- [ ] **预计:** 1h
- [ ] **实际:** 约 0.6h
- [ ] **验证:** 点击分类后 URL 更新，切换分类回到第 1 页，清除后恢复全部列表。

### Task 5: 补充样式与响应式

- [x] **文件:** `packages/wuh.site.next/app/blog/styles/index.ts`
- [x] 新增 FilterBar、FilterButton、FilterToken、FilterSummary 等样式组件。
- [x] 使用 GitHub 风格边框、浅灰 header 背景、浅蓝筛选 token。
- [x] 移动端自动换行，不引入横向滚动或侧栏。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.4h
- [ ] **验证:** 桌面端和移动端布局稳定，动画遵循 `prefers-reduced-motion`。

## Phase 4: 分页联动与质量校验

### Task 6: 保留筛选状态的分页 URL

- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 更新 Pagination `getPageUrl`，存在 `activeLabel` 时生成 `/blog?labels=<label>&page=<n>`。
- [x] 第 1 页省略 `page`，但保留 `labels`。
- [ ] **预计:** 0.5h
- [ ] **实际:** 约 0.2h
- [ ] **验证:** 在分类筛选状态下点击上一页/下一页/页码不会丢失 label。

### Task 7: 回归验证

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.service.ts`
- [x] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] **文件:** `packages/wuh.site.next/app/blog/styles/index.ts`
- [x] 执行前端 lint 与后端新增单测。
- [ ] TypeScript 全局检查受现有错误和当前 runtime 139 阻塞，需后续单独清理。
- [ ] 手动验证空结果、无分类、带分类、多页分类结果。
- [ ] **预计:** 0.5h
- [ ] **实际:** 约 0.5h
- [ ] **验证:** 后端新增 Jest 单测通过；前端 `oxlint app` 通过；TypeScript 全局检查未通过。

## 验收

- [x] `/blog` 默认展示全部 open 博客，分页行为不回退。
- [x] `/blog?labels=<label>` 展示指定分类下的 open 博客。
- [x] `GET /content/labels?state=open` 返回完整 open 博客分类汇总。
- [x] 分类筛选后分页链接保留 `labels`，切换分类重置到第 1 页。
- [x] 过滤条视觉贴近 GitHub Issues，移动端不破坏当前列表布局。
- [x] `./node_modules/.bin/oxlint app` 零错误（`pnpm --filter @wuh.site/next run lint` 在当前 runtime 下 exit 139）。
- [ ] `pnpm exec tsc --noEmit` 零错误。
