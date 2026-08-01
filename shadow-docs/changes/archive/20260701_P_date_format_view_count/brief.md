# 日期格式优化 + 浏览数替换评论数

> 原始变更名：`20260701_P_date_format_view_count`

## 元数据
- 日期：2026-07-01
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前首页/博客列表展示 "月份缩写 日" 格式 + 评论数，详情页展示固定 "发布于 2025 Jan 1, N条评论" 格式。体验不友好。

## 引用规范
- `specs/blog-display/spec.md`

## 决策
# 设计文档

## 智能日期格式化

```ts
function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = Date.now()
  const diff = now - d.getTime()
  const hours = diff / 3600000
  const days = diff / 86400000

  if (hours < 24) return `${Math.floor(hours)}小时前发布`
  if (days < 7) return `${Math.floor(days)}天前发布`
  if (days < 30) return `${d.getMonth() + 1}月${d.getDate()}日`
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
```

## 首页/列表页日期

```ts
function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
```

## PostListItem 字段变更

```
comments: number  →  views: number
```

前端映射时 `views: 0`（占位），后续可接入真实计数。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** PostListItem 字段 rename，需确认无其他消费者
- **向后兼容:** 不影响后端 API

## 任务
### Phase 1: 类型和工具函数
- [ ] **文件:** `packages/shared-contracts/src/index.ts`
- [ ] `PostListItem.comments` → `PostListItem.views`
- [ ] `blog/page.tsx` 映射 `views: 0`
- [ ] **预计耗时:** 5 min
- [ ] **文件:** `packages/wuh.site.next/app/lib/date.ts`（新建）
- [ ] 实现 `formatShortDate(dateStr)` — MM-dd
- [ ] 实现 `formatRelativeTime(dateStr)` — 相对时间
- [ ] **预计耗时:** 10 min
### Phase 2: 前端页面更新
- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **预计耗时:** 10 min
- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [ ] 日期改 `formatRelativeTime`
- [ ] `issue.comments`条评论 → 浏览量标识
- [ ] **预计耗时:** 5 min
- [ ] 首页日期 MM-dd，展示"浏览量"字样的数值
- [ ] 博客列表同上
- [ ] 详情页 1天内文章显示 "X小时前发布"
- [ ] 详情页 1周内文章显示 "X天前发布"
- [ ] `npx tsc --noEmit` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: date-format-view-count
date: 2026-07-01
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/168
```

### `design.md`
# 设计文档

## 智能日期格式化

```ts
function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = Date.now()
  const diff = now - d.getTime()
  const hours = diff / 3600000
  const days = diff / 86400000

  if (hours < 24) return `${Math.floor(hours)}小时前发布`
  if (days < 7) return `${Math.floor(days)}天前发布`
  if (days < 30) return `${d.getMonth() + 1}月${d.getDate()}日`
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
```

## 首页/列表页日期

```ts
function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
```

## PostListItem 字段变更

```
comments: number  →  views: number
```

前端映射时 `views: 0`（占位），后续可接入真实计数。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** PostListItem 字段 rename，需确认无其他消费者
- **向后兼容:** 不影响后端 API

### `proposal.md`
# 日期格式优化 + 浏览数替换评论数

## 背景

当前首页/博客列表展示 "月份缩写 日" 格式 + 评论数，详情页展示固定 "发布于 2025 Jan 1, N条评论" 格式。体验不友好。

## 目标

- 首页/博客列表：日期改为 MM-dd 格式，评论数改为浏览量（占位）
- 博客详情页：智能日期格式 + 浏览量
  - 1天内 → "X小时前发布"
  - 1周内 → "X天前发布"
  - 1月内 → "MM月dd日发布"
  - 超1月 → "YYYY年MM月dd日"
- `PostListItem.comments` 改为 `PostListItem.views`，前端各处同步

## 非目标（明确不做）

- 不实现真实的浏览量计数
- 不修改后端 API（views 字段暂用 0 占位）

## 影响范围

- `packages/shared-contracts/src/index.ts` — PostListItem.comments → views
- `packages/wuh.site.next/app/HomeView.tsx` — 日期 MM-dd + views
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 日期 MM-dd + views
- `packages/wuh.site.next/app/blog/page.tsx` — mapContentToPost 映射 views
- `packages/wuh.site.next/app/post/components/PostHeader.tsx` — 智能日期 + views

### `specs/blog-display/spec.md`
# Blog Display

## MODIFIED

### Requirement: 首页/列表页时间格式
- **GIVEN** 首页或博客列表页展示文章列表
- **WHEN** 页面渲染
- **THEN** 日期格式为 MM-dd
- **AND** 展示浏览量代替评论数

### Requirement: 详情页时间格式
- **GIVEN** 博客详情页
- **WHEN** 页面渲染
- **THEN** 发布时间在 1 天内显示 "X小时前发布"
- **AND** 1 周内显示 "X天前发布"
- **AND** 1 月内显示 "MM月dd日"
- **AND** 超过 1 月显示 "YYYY年MM月dd日"
- **AND** 展示浏览量代替评论数

### `tasks.md`
# 任务清单

## Phase 1: 类型和工具函数

### Task 1: PostListItem.comments → views

- [ ] **文件:** `packages/shared-contracts/src/index.ts`
- [ ] `PostListItem.comments` → `PostListItem.views`
- [ ] `blog/page.tsx` 映射 `views: 0`
- [ ] **预计耗时:** 5 min

### Task 2: 日期格式化工具函数

- [ ] **文件:** `packages/wuh.site.next/app/lib/date.ts`（新建）
- [ ] 实现 `formatShortDate(dateStr)` — MM-dd
- [ ] 实现 `formatRelativeTime(dateStr)` — 相对时间
- [ ] **预计耗时:** 10 min

## Phase 2: 前端页面更新

### Task 3: 首页和博客列表

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **预计耗时:** 10 min

### Task 4: 详情页 PostHeader

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [ ] 日期改 `formatRelativeTime`
- [ ] `issue.comments`条评论 → 浏览量标识
- [ ] **预计耗时:** 5 min

## 验收

- [ ] 首页日期 MM-dd，展示"浏览量"字样的数值
- [ ] 博客列表同上
- [ ] 详情页 1天内文章显示 "X小时前发布"
- [ ] 详情页 1周内文章显示 "X天前发布"
- [ ] `npx tsc --noEmit` 零错误
