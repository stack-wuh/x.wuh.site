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
