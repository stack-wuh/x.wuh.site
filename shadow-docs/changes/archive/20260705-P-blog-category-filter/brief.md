# 博客列表新增分类查询

> 原始变更名：`2026-07-05-P-blog-category-filter`

## 元数据
- 日期：2026-07-05
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前博客列表页只支持按创建时间倒序分页展示全部 open 状态博客，用户无法按分类快速筛选内容。文章数据来源于 GitHub Issues，列表项已经展示 labels，后端内容接口也已支持 `labels` 查询参数，但前端 `/blog` 页面尚未提供分类查询入口，导致标签信息没有形成可操作的浏览路径。

## 引用规范
- `specs/blog-category-filter/spec.md`

## 决策
本次在前端 `/blog` 页面接入现有内容 API 的 `labels` 查询能力。页面仍由服务端组件读取 URL 查询参数并请求数据，客户端组件只负责渲染过滤条、列表与分页链接。

```
/blog?labels=frontend&page=2
        |
        v
app/blog/page.tsx
  - 解析 page
  - 解析 labels（单分类）
  - 请求 labels 汇总
  - contentService.getPosts.server({ state: open, labels, page, limit })
        |
        v
BlogListView
  - GitHub Issues 风格过滤条
  - 年份分组博客列表
  - Pagination getPageUrl 保留 labels
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 分类来源 | GitHub Issue labels | 现有数据已同步到 `ContentItem.labels`，无需新增模型 |
| 筛选方式 | 单分类筛选 | 更符合“分类查询”心智，避免多标签组合带来的空结果和 URL 复杂度 |
| 状态承载 | URL query `labels=<label>` | 支持刷新、分享、SSR/ISR 请求一致 |
| UI 风格 | GitHub Issues 过滤条 | 与 GitHub Issues CMS 来源一致，后续扩展搜索/排序自然 |
| 数据请求 | 复用 `contentService.getPosts.server` | 保持现有服务封装和 revalidate 策略 |
| 标签候选项 | 新增 labels 汇总接口 | 避免只从当前页 posts 派生导致分类列表不完整 |

## 任务
### Phase 1: 后端标签汇总接口
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.service.ts`
- [x] 新增 labels 聚合方法，按 `state=open` 统计 Content labels 出现次数。
- [x] 返回结构为 `{ name: string; count: number }[]`，按数量倒序、名称升序保证稳定展示。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.5h
- [ ] **验证:** 调用 service 方法可得到去重后的 labels 与计数。
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 新增 `GET /content/labels?state=open` 接口。
- [x] 保持 `GET /content/posts` 的 labels 筛选语义不变。
- [x] **文件:** `packages/shared-contracts/src/endpoints.ts`
- [x] 如需要，为 `contentService` 增加 `getLabels` endpoint 定义。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.25h
- [ ] **验证:** 接口返回 labels 汇总，不包含 closed 内容。
### Phase 2: 查询参数与数据接入
- [x] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [x] 新增 `toLabelParam()`，从 `searchParams.labels` 中解析单个有效 label。
- [x] `getIssues()` 支持接收 `label?: string`，调用 `contentService.getPosts.server` 时传入 `labels`。
- [x] 并行请求 posts 与 labels 汇总，向 `BlogListView` 传入 `activeLabel`、`availableLabels`、`pagination.total` 等展示所需数据。
- [ ] **预计:** 0.5h
- [ ] **实际:** 约 0.4h
- [ ] **验证:** 访问 `/blog` 与 `/blog?labels=<label>` 请求参数正确，均只查询 `state=open`。
### Phase 3: 分类过滤条 UI
- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 新增分类过滤条区域，展示 `Labels ▾`、结果说明、活跃筛选 token。
- [x] 分类入口使用可访问的链接或按钮列表，点击分类跳转 `/blog?labels=<label>`。
- [x] 清除筛选跳转 `/blog`。
- [ ] **预计:** 1h
- [ ] **实际:** 约 0.6h
- [ ] **验证:** 点击分类后 URL 更新，切换分类回到第 1 页，清除后恢复全部列表。
- [x] **文件:** `packages/wuh.site.next/app/blog/styles/index.ts`
- [x] 新增 FilterBar、FilterButton、FilterToken、FilterSummary 等样式组件。
- [x] 使用 GitHub 风格边框、浅灰 header 背景、浅蓝筛选 token。
- [x] 移动端自动换行，不引入横向滚动或侧栏。
- [ ] **预计:** 0.75h
- [ ] **实际:** 约 0.4h
- [ ] **验证:** 桌面端和移动端布局稳定，动画遵循 `prefers-reduced-motion`。
### Phase 4: 分页联动与质量校验
- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 更新 Pagination `getPageUrl`，存在 `activeLabel` 时生成 `/blog?labels=<label>&page=<n>`。
- [x] 第 1 页省略 `page`，但保留 `labels`。
- [ ] **预计:** 0.5h
- [ ] **实际:** 约 0.2h
- [ ] **验证:** 在分类筛选状态下点击上一页/下一页/页码不会丢失 label。
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
- [x] `/blog` 默认展示全部 open 博客，分页行为不回退。
- [x] `/blog?labels=<label>` 展示指定分类下的 open 博客。
- [x] `GET /content/labels?state=open` 返回完整 open 博客分类汇总。
- [x] 分类筛选后分页链接保留 `labels`，切换分类重置到第 1 页。
- [x] 过滤条视觉贴近 GitHub Issues，移动端不破坏当前列表布局。
- [x] `./node_modules/.bin/oxlint app` 零错误（`pnpm --filter @wuh.site/next run lint` 在当前 runtime 下 exit 139）。
- [ ] `pnpm exec tsc --noEmit` 零错误。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-05-P-blog-category-filter
date: 2026-07-05
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/180
```

### `design.md`
# 设计文档

## 架构

本次在前端 `/blog` 页面接入现有内容 API 的 `labels` 查询能力。页面仍由服务端组件读取 URL 查询参数并请求数据，客户端组件只负责渲染过滤条、列表与分页链接。

```
/blog?labels=frontend&page=2
        |
        v
app/blog/page.tsx
  - 解析 page
  - 解析 labels（单分类）
  - 请求 labels 汇总
  - contentService.getPosts.server({ state: open, labels, page, limit })
        |
        v
BlogListView
  - GitHub Issues 风格过滤条
  - 年份分组博客列表
  - Pagination getPageUrl 保留 labels
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 分类来源 | GitHub Issue labels | 现有数据已同步到 `ContentItem.labels`，无需新增模型 |
| 筛选方式 | 单分类筛选 | 更符合“分类查询”心智，避免多标签组合带来的空结果和 URL 复杂度 |
| 状态承载 | URL query `labels=<label>` | 支持刷新、分享、SSR/ISR 请求一致 |
| UI 风格 | GitHub Issues 过滤条 | 与 GitHub Issues CMS 来源一致，后续扩展搜索/排序自然 |
| 数据请求 | 复用 `contentService.getPosts.server` | 保持现有服务封装和 revalidate 策略 |
| 标签候选项 | 新增 labels 汇总接口 | 避免只从当前页 posts 派生导致分类列表不完整 |

## 数据模型（如涉及）

不新增后端数据模型。前端继续使用：

```ts
type PostListItem = {
  id: number
  number: number
  title: string
  html_url: string
  views: number
  created_at: string
  labels: { name: string; color?: string | null }[]
}
```

页面需要展示完整分类候选项。为避免从当前页 posts 派生导致分类列表不完整，新增轻量标签汇总响应：

```ts
type ContentLabelSummary = {
  name: string
  count: number
}
```

该响应只聚合现有 Content `labels` 字段，不新增分类表或标签管理模型。

## API 设计（如涉及）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/content/posts?page=1&limit=10&state=open&labels=frontend` | 获取指定 label 下的 open 博客分页列表 |
| GET | `/content/labels?state=open` | 获取 open 博客 labels 汇总，用于分类入口 |

**请求示例:**

```json
{
  "page": "1",
  "limit": "10",
  "state": "open",
  "labels": "frontend"
}
```

**响应示例:**

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## 组件/模块设计

### BlogListView

职责：展示博客列表、分类过滤条和分页器。

新增 Props：

- `activeLabel?: string`：当前选中的分类。
- `availableLabels: { name: string; count: number }[]`：完整分类候选项。
- `total?: number`：当前查询结果总数，用于过滤条文案。

行为：

- 未选择分类时展示 `All posts` 状态。
- 选择分类后展示筛选 token：`<label> ×`。
- 点击分类时跳转 `/blog?labels=<label>`，不保留旧 page。
- 点击清除时跳转 `/blog`。
- 分页器 `getPageUrl` 生成 `/blog?labels=<label>&page=<n>`，第 1 页省略 `page`。

### BlogCategoryFilter

职责：封装 GitHub Issues 风格过滤条。

结构：

- `Labels ▾` 入口：桌面端显示下拉或弹出列表，移动端保持换行可点。
- 当前结果文案：展示 open posts 数量或当前页结果说明。
- 活跃筛选 token：展示当前 label，并提供清除入口。

### page.tsx

职责：解析 URL 查询参数并拉取数据。

行为：

- `page` 非法时回落到 1。
- `labels` 取数组第一个值，空字符串视为未筛选。
- 请求参数保持 `state: 'open'`，避免关闭 issues 参与分页。
- 并行请求 posts 与 labels 汇总；labels 请求失败时降级为空数组，列表主内容不受影响。

### ContentController / ContentService

职责：提供 labels 汇总能力。

行为：

- 新增 `GET /content/labels?state=open`。
- 基于现有 Content 集合聚合 labels，并返回 `{ name, count }[]`。
- 默认只统计 open 状态内容，避免关闭 issues 出现在博客分类入口。
- 不改变 `GET /content/posts` 的查询和分页语义。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 过滤条横向展示，`Labels ▾`、结果文案、筛选 token 同行 |
| < 768px | 过滤条内容自动换行，分类入口和 token 保持可点区域，列表布局不引入侧栏 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。
- **向后兼容:** `/blog` 无参数仍展示全部 open 博客；已有 `page` 参数继续可用。
- **性能影响:** posts 分页请求与现有一致；新增 labels 汇总使用 MongoDB 聚合，后端已有 labels 索引，前端不引入全量拉取。

### `proposal.md`
# 博客列表新增分类查询

## 背景

当前博客列表页只支持按创建时间倒序分页展示全部 open 状态博客，用户无法按分类快速筛选内容。文章数据来源于 GitHub Issues，列表项已经展示 labels，后端内容接口也已支持 `labels` 查询参数，但前端 `/blog` 页面尚未提供分类查询入口，导致标签信息没有形成可操作的浏览路径。

## 目标

- 在 `/blog` 页面新增 GitHub Issues 风格的分类过滤条，提供清晰的分类查询入口。
- 基于现有 Issue labels 做单分类筛选，并将筛选状态写入 URL，支持分享和刷新保持状态。
- 提供 open 博客 labels 汇总能力，让分类入口展示完整可选分类，而不是只展示当前页标签。
- 分类筛选与分页联动：切换分类重置到第 1 页，分页链接保留当前分类参数。
- 保持当前博客列表按创建时间倒序、按年份分组、GitHub 风格视觉一致性。

## 非目标（明确不做）

- 不新增独立分类数据模型或后台分类管理能力。
- 不修改后端 `GET /content/posts` 的 labels 查询语义。
- 不实现全文搜索、排序切换、多标签组合筛选或标签管理。
- 不改变博客详情页、首页文章入口或 RSS 输出逻辑。

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 解析 `labels` 查询参数，请求博客列表时传入 labels，并向视图传递当前分类状态。
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 新增分类过滤条渲染、清除筛选、分页 URL 保留分类参数。
- `packages/wuh.site.next/app/blog/styles/index.ts` — 新增 GitHub Issues 风格过滤条、筛选 token、响应式布局样式。
- `packages/wuh.site.nest/src/modules/content/content.controller.ts` — 新增 labels 汇总接口，供博客分类入口使用。
- `packages/wuh.site.nest/src/modules/content/content.service.ts` — 基于现有 Content labels 聚合 open 博客标签。
- `packages/shared-contracts/src/index.ts` — 如需要，补充前端分页/标签视图类型；优先复用现有 `PostListItem` 与 `PaginationMeta`。
- `openspec/specs/blog-category-filter/spec.md` — 新增博客分类查询交互规范。

### `specs/blog-category-filter/spec.md`
# Spec: 博客分类查询

## ADDED

### Requirement: 博客列表支持分类查询
- **GIVEN** 用户访问博客列表页
- **WHEN** 用户选择一个分类 label
- **THEN** 页面跳转到包含 `labels=<label>` 的 `/blog` URL
- **AND** 列表仅展示该 label 下 open 状态的博客文章

### Requirement: 分类筛选状态可分享
- **GIVEN** 用户访问 `/blog?labels=frontend`
- **WHEN** 页面服务端渲染并请求博客列表数据
- **THEN** 请求参数包含 `state=open` 和 `labels=frontend`
- **AND** 页面展示当前筛选 token `frontend`

### Requirement: 分类入口展示完整 open 标签汇总
- **GIVEN** open 状态博客包含多个 Issue labels
- **WHEN** 用户打开博客列表页的 `Labels` 分类入口
- **THEN** 页面展示 open 状态博客的 labels 汇总
- **AND** 每个 label 包含名称和文章数量
- **AND** closed 状态 issues 的 labels 不参与汇总

### Requirement: 分类筛选与分页联动
- **GIVEN** 用户处于 `/blog?labels=frontend`
- **WHEN** 用户点击分页器进入第 2 页
- **THEN** 目标 URL 为 `/blog?labels=frontend&page=2`
- **AND** 当前分类筛选不会丢失

### Requirement: 切换分类重置分页
- **GIVEN** 用户处于 `/blog?labels=frontend&page=3`
- **WHEN** 用户选择另一个分类 `nextjs`
- **THEN** 目标 URL 为 `/blog?labels=nextjs`
- **AND** 不保留旧的 `page=3`

### Requirement: GitHub Issues 风格过滤条
- **GIVEN** 博客列表页渲染
- **WHEN** 用户查看标题下方区域
- **THEN** 页面展示 GitHub Issues 风格的分类过滤条
- **AND** 过滤条包含 `Labels` 入口、结果说明和当前筛选 token

---

## MODIFIED

### Requirement: 博客列表分页 URL
- **GIVEN** 博客列表处于分类筛选状态
- **WHEN** 分页器生成页码链接
- **THEN** 页码链接保留当前 `labels` 查询参数
- **AND** 第 1 页链接省略 `page` 参数

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。

### `tasks.md`
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
