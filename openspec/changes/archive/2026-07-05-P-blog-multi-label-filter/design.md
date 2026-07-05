# 设计文档

## 架构

本次沿用现有博客列表的 Server Component 数据获取方式。`/blog/page.tsx` 从 URL 读取一个或多个 `labels` 参数，规范化为 `string[]` 后请求内容 API；`BlogListView` 只负责渲染过滤条、标签菜单、已选 token、列表和分页链接。

```
/blog?labels=javascript&labels=react
        |
        v
page.tsx 解析 activeLabels: string[]
        |
        v
GET /content/posts?state=open&labels=javascript&labels=react
        |
        v
Nest content controller 使用 { labels: { $all: [...] } }
        |
        v
BlogListView 渲染多 token 与可追加标签菜单
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 多标签语义 | AND，同时包含全部已选标签 | 符合筛选条件叠加的直觉，避免多个 token 被误解为精确筛选但实际放宽结果 |
| URL 表达 | 优先支持重复查询参数 `labels=a&labels=b`，兼容逗号分隔输入 | Next searchParams 已支持 `string | string[]`，兼容后端 DTO 的 comma-separated or array 说明 |
| UI 状态 | 多个 token + 单独移除 | 用户能清楚看到当前筛选条件，并逐个回退 |
| 样式策略 | 使用 `--accent-color`、`--primary-color`、`--background-100` 的 `color-mix` | 与现有主题系统一致，不引入新主题 token |

## 数据模型（如涉及）

不新增数据库字段。现有 `Content.labels: string[]` 继续作为查询依据。

前端将 active label 状态从单值扩展为数组：

```ts
type Props = {
  activeLabels: string[]
  availableLabels: ContentLabelSummary[]
}
```

## API 设计（如涉及）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/content/posts` | 当存在多个 `labels` 查询参数时，返回同时包含全部 labels 的 open 博客 |
| GET | `/content/labels` | 保持现有 open labels 汇总接口不变 |

**请求示例:**

```json
{
  "page": "1",
  "limit": "10",
  "state": "open",
  "labels": ["javascript", "react"]
}
```

**查询语义:**

```ts
dbQuery.labels = { $all: ['javascript', 'react'] }
```

单个 label 与现有行为保持一致；多个 label 从“任一匹配”调整为“全部匹配”。

## 组件/模块设计

### Blog page

职责：解析 URL 查询参数、请求文章列表和标签汇总。

- 新增 `toLabelParams(value)`，输出去重后的 `string[]`。
- 同时支持 `?labels=a&labels=b` 与 `?labels=a,b`。
- 请求 posts 时传入 labels 数组或逗号分隔字符串，保持 shared-contracts endpoint 可序列化。

### BlogListView

职责：展示博客列表、分类过滤条和分页器。

- `buildBlogUrl(page, labels)` 生成保留多标签的 URL。
- 点击未选标签时追加到当前 labels，并重置到第 1 页。
- 点击已选 token 的关闭按钮时只移除该标签；移除最后一个标签后回到 `/blog`。
- 下拉项文案显示 `name(+count)`；外部已选 token 只显示标签名，active 项仍可点击并保持当前筛选。
- `FilterSummary` 在存在已选标签时显示当前 AND 查询结果数，例如选中 `javascript(+8)` 和 `vue(+3)` 后如果交集结果为 2 篇，则显示 `Labels(+2)`；未选中任何标签时显示 `Labels`。
- 过滤条不展示 `open posts` 或 `filtered by` 结果提示文案。

### Content controller

职责：将查询参数转换为 MongoDB 查询条件。

- 当 `labels` 非空时使用 `{ labels: { $all: labels } }`。
- 保持 `state=open` 与分页参数逻辑不变。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 过滤条横向展示，`Labels(+n)` 和多个 token 尽量同行展示 |
| < 768px | 过滤条允许换行，token 保持可点击区域，不挤压文章列表 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 多 labels 查询从 OR 改为 AND；单 label 查询无变化。
- **向后兼容:** 继续兼容单个 `labels=<label>` URL；无筛选 URL 不变；逗号分隔输入可被解析。
- **性能影响:** MongoDB 已有 `labels` 索引，`$all` 查询可复用数组索引；多个 label 条件可能减少结果集，分页成本不增加。
