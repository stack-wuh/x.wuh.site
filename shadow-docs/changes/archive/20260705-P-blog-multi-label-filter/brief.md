# 博客多标签过滤体验优化

> 原始变更名：`2026-07-05-P-blog-multi-label-filter`

## 元数据
- 日期：2026-07-05
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前博客列表页已经提供 `Labels` 分类入口，并展示 open 博客 labels 汇总，但筛选状态仍是单标签。用户无法叠加多个 label 精确查找同时包含多类主题的文章。

过滤条视觉也存在两个体验问题：标签汇总数量与标签名分离，阅读成本较高；过滤条背景色与主题色不够一致，active/hover/token 状态的主题感不统一。

## 引用规范
- `specs/blog-category-filter/spec.md`
- `specs/content-api/spec.md`

## 决策
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

| 维度 | 选择 | 理由 |
|------|------|------|
| 多标签语义 | AND，同时包含全部已选标签 | 符合筛选条件叠加的直觉，避免多个 token 被误解为精确筛选但实际放宽结果 |
| URL 表达 | 优先支持重复查询参数 `labels=a&labels=b`，兼容逗号分隔输入 | Next searchParams 已支持 `string | string[]`，兼容后端 DTO 的 comma-separated or array 说明 |
| UI 状态 | 多个 token + 单独移除 | 用户能清楚看到当前筛选条件，并逐个回退 |
| 样式策略 | 使用 `--accent-color`、`--primary-color`、`--background-100` 的 `color-mix` | 与现有主题系统一致，不引入新主题 token |

## 任务
### Phase 1: API 查询语义
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 将 `labels` 查询从 `$in` 改为 `$all`。
- [x] 保持单 label、无 label、`state=open` 查询行为不变。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** `node node_modules/jest/bin/jest.js src/modules/content/content.controller.spec.ts --runInBand --verbose` 曾观察到 6/6 通过；后续重跑在当前 runtime 偶发 exit 139。
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.spec.ts`
- [x] 覆盖多个 labels 输入时 controller 传递 `{ labels: { $all: [...] } }`。
- [x] 覆盖单 label 输入仍能正常查询。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** 先观察到 `$in` vs `$all` 失败，再观察到 6/6 通过；`pnpm --filter` 在当前环境 exit 139。
### Phase 2: 前端多标签状态
- [x] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [x] 将 active label 状态从单值改为去重数组。
- [x] 支持重复查询参数和逗号分隔两种 URL 输入。
- [x] 将多 labels 传给 `contentService.getPosts.server`。
- [x] **预计耗时:** 40 分钟
- [x] **实际耗时:** 35 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 4/4 通过；`packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/blog` 通过。
- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] `buildBlogUrl` 支持多个 labels，并在分页链接中保留全部 labels。
- [x] 标签菜单点击未选标签时追加筛选条件并重置页码。
- [x] 已选标签渲染为多个 token，每个 token 可单独移除。
- [x] 已选 token 只显示标签名，不显示 `(+count)`。
- [x] **预计耗时:** 50 分钟
- [x] **实际耗时:** 35 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 覆盖多 labels URL、追加、移除。
### Phase 3: 过滤条视觉和文案
- [x] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [x] 下拉项显示 `name(+count)`。
- [x] 当存在已选标签时，入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- [x] 移除 `open posts` / `filtered by` 结果提示文案。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** `node --test test/blog-filter-utils.test.mjs` 覆盖数量文案。
- [x] **文件:** `packages/wuh.site.next/app/blog/styles/index.ts`
- [x] 过滤条容器、工具栏、菜单、hover、active、token 背景统一使用主题色相关 CSS 变量。
- [x] 保持浅色/暗色主题下文字对比度和可点击区域清晰。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/blog` 通过。
- [x] `/blog?labels=javascript&labels=react` 只展示同时包含两个标签的 open 博客。
- [x] 分页链接保留全部已选 labels。
- [x] 已选 token 可以单独移除，移除最后一个 token 后回到无筛选状态。
- [x] 标签菜单项显示 `标签名(+数量)`。
- [x] 选择标签时入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- [x] 过滤条背景、hover、active、token 状态与主题色保持一致。
- [ ] `node node_modules/typescript/bin/tsc --noEmit` 当前环境 exit 139，未取得类型检查结果。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-05-P-blog-multi-label-filter
date: 2026-07-05
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/186
```

### `design.md`
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

### `proposal.md`
# 博客多标签过滤体验优化

## 背景

当前博客列表页已经提供 `Labels` 分类入口，并展示 open 博客 labels 汇总，但筛选状态仍是单标签。用户无法叠加多个 label 精确查找同时包含多类主题的文章。

过滤条视觉也存在两个体验问题：标签汇总数量与标签名分离，阅读成本较高；过滤条背景色与主题色不够一致，active/hover/token 状态的主题感不统一。

## 目标

- 支持博客列表多 label 查询，多个 label 之间采用 AND 语义，即文章必须同时包含所有已选标签。
- 分类入口和标签选项展示数量提示：标签项显示为 `javascript(+8)`，已选标签时入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- 已选标签以多个纯标签名 token 展示，可单独移除某个标签，也可回到无筛选状态。
- 移除过滤条里的结果提示文案，例如 `6 open posts filtered by`。
- 过滤条、下拉、active、hover、token 背景色统一使用主题色相关 CSS 变量。

## 非目标（明确不做）

- 不实现 OR 语义的多标签查询。
- 不新增标签管理、排序切换、全文搜索或服务端标签颜色存储。
- 不改博客详情页文章内容渲染、文章卡片列表结构或分页器组件 API。

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 解析多个 `labels` 查询参数，并传递给列表请求与视图组件。
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 支持多选标签 URL 生成、多个筛选 token、标签数量文案。
- `packages/wuh.site.next/app/blog/styles/index.ts` — 统一过滤条主题色背景、active/hover/token 状态样式。
- `packages/wuh.site.nest/src/modules/content/content.controller.ts` — 将多 label 查询语义调整为 AND。
- `packages/wuh.site.nest/src/modules/content/content.controller.spec.ts` — 覆盖多 label AND 查询条件。
- `openspec/specs/blog-category-filter/spec.md` — 更新博客分类查询交互规范。
- `openspec/specs/content-api/spec.md` — 更新内容 API labels 查询语义。

### `specs/blog-category-filter/spec.md`
# Spec: 博客分类查询

## ADDED

### Requirement: 多标签 AND 分类查询
- **GIVEN** 用户访问博客列表页
- **WHEN** 用户选择多个 label 作为分类筛选条件
- **THEN** 页面 URL 包含全部已选 labels 查询参数
- **AND** 列表仅展示同时包含全部已选 labels 的 open 状态博客文章

### Requirement: 多个筛选 token 可单独移除
- **GIVEN** 用户处于 `/blog?labels=javascript&labels=react`
- **WHEN** 用户移除 `react` token
- **THEN** 页面跳转到仅保留 `javascript` 的筛选 URL
- **AND** 当最后一个 token 被移除时页面回到 `/blog`
- **AND** 外部已选 token 只展示标签名

### Requirement: 分类数量文案
- **GIVEN** open 状态博客包含 labels 汇总
- **WHEN** 用户打开博客列表页的分类过滤条
- **THEN** 每个分类选项以 `label(+count)` 格式展示名称和文章数量
- **AND** 外部已选 token 不展示文章数量
- **AND** 当用户选择一个或多个标签时，分类入口展示当前 AND 查询结果数，例如 `Labels(+2)`
- **AND** 当用户没有选择标签时，分类入口展示 `Labels`

---

## MODIFIED

### Requirement: 分类筛选状态可分享
- **GIVEN** 用户访问 `/blog?labels=javascript&labels=react`
- **WHEN** 页面服务端渲染并请求博客列表数据
- **THEN** 请求参数包含 `state=open` 和全部 labels
- **AND** 页面展示当前全部筛选 token

### Requirement: 分类筛选与分页联动
- **GIVEN** 用户处于 `/blog?labels=javascript&labels=react`
- **WHEN** 用户点击分页器进入第 2 页
- **THEN** 目标 URL 保留全部已选 labels 并包含 `page=2`
- **AND** 当前多标签筛选不会丢失

### Requirement: GitHub Issues 风格过滤条
- **GIVEN** 博客列表页渲染
- **WHEN** 用户查看标题下方区域
- **THEN** 页面展示 GitHub Issues 风格的分类过滤条
- **AND** 过滤条包含 `Labels` 或 `Labels(+n)` 入口和当前筛选 token
- **AND** 过滤条背景、active、hover、token 状态与站点主题色保持一致
- **AND** 过滤条不展示 `open posts` 或 `filtered by` 结果提示文案

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。

### `specs/content-api/spec.md`
# Spec: 内容 API

## ADDED

### Requirement: 多 labels 查询使用 AND 语义
- **GIVEN** 内容列表接口收到多个 `labels` 查询条件
- **WHEN** 服务端构造数据库查询条件
- **THEN** 查询条件使用数组全部匹配语义
- **AND** 返回结果中的每篇文章都同时包含全部指定 labels

---

## MODIFIED

### Requirement: Labels comma-separated
- **GIVEN** 客户端请求内容列表接口
- **WHEN** `labels` 以逗号分隔字符串或重复查询参数传入
- **THEN** 服务端将其规范化为 label 数组
- **AND** 多个 label 按 AND 语义过滤内容

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。

### `tasks.md`
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
