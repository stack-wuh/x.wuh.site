# 博客详情页代码展示优化

> 原始变更名：`20260510_B_blog-code-highlighting`

## 元数据
- 日期：2026-05-10
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
当前方案存在三个问题：

1. **代码块在 light 主题下看不清** — `--atom-pre-bg` 硬编码为 `#1e1e1e`（深色），`pre code` 文字颜色硬编码 `#d4d4d4`。无论站点切换到 money 还是 plain 主题，代码块始终深色背景，与浅色页面形成强烈对比。

2. **highlight.js 从 CDN 加载，不感知站点主题** — 只监听 OS 级 `prefers-color-scheme` 切换 `atom-one-dark`/`atom-one-light`，不知道站点 `data-theme` 的手动切换。

3. **CDN 依赖** — 语法高亮完全依赖外部 CDN 可用性，加载失败时代码块无任何样式。

改用 rehype 生态后，语法高亮在服务端完成，无 CDN 依赖，代码块配色可通过 CSS 变量统一响应站点主题切换。

## 引用规范
- `specs/blog-code-highlighting/spec.md`

## 决策
# 设计文档

## 架构对比

### 之前

```
page.tsx (server) → PostView.tsx (client)
                       ├── marked.parse() → HTML
                       ├── useToc (DOMParser, 添加 heading id/anchor)
                       └── usePostImagePreview
                             ├── CDN highlight.js 加载 + highlightAll()
                             ├── 复制按钮注入
                             └── 图片预览收集
```

### 之后

```
page.tsx (server)
  ├── api.content.getPost() → 原始 markdown
  └── renderMarkdown() → HTML (unified pipeline, 含语法高亮)
        │
PostView.tsx (client)
  ├── 直接使用预渲染 HTML
  ├── useToc (DOMParser, 仅提取 TOC)
  └── usePostImagePreview
        ├── 复制按钮注入 (保留)
        └── 图片预览收集 (保留)
```

## unified pipeline

```
remark-parse → remark-gfm → remark-rehype → rehype-highlight → rehype-slug → rehype-autolink-headings → rehype-stringify
```

## 关键决策

- **服务端渲染**: unified 管道在 page.tsx 执行，不进入客户端 bundle
- **代码高亮主题**: `rehype-highlight` 输出 hljs 类名，CSS 变量控制配色，响应 `prefers-color-scheme`
- **TOC 保留客户端提取**: `rehype-slug` 负责 id，`useToc` 仅提取数据
- **锚点链接**: `rehype-autolink-headings` 在服务端生成

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `package.json` | 修改 | +unified 生态，-marked |
| `app/lib/markdown.ts` | 新增 | unified pipeline |
| `app/post/[number]/page.tsx` | 修改 | 服务端调用 renderMarkdown |
| `app/post/PostView.tsx` | 修改 | 移除 marked |
| `app/post/usePostImagePreview.ts` | 修改 | 移除 CDN highlight.js |
| `app/post/hooks/useToc.ts` | 修改 | 简化为仅提取 TOC |
| `app/post/styles/index.ts` | 修改 | 代码块主题配色 + hljs token |

## 任务
### Phase 1 — 依赖与工具
- [x] T1: 安装 unified 生态依赖，移除 marked
- [x] T2: 创建 `app/lib/markdown.ts` — unified pipeline 工具函数
### Phase 2 — 服务端适配
- [x] T3: 更新 `page.tsx` 在服务端预渲染 markdown
### Phase 3 — 客户端精简
- [x] T4: 更新 `PostView.tsx` 移除 marked
- [x] T5: 移除 CDN highlight.js 加载逻辑
- [x] T6: 简化 `useToc.ts`（移除 heading DOM 修改）
### Phase 4 — 样式修复
- [x] T7: 更新代码块 CSS（主题响应式 + hljs token 配色）
### Phase 5 — 验证
- [x] T8: oxlint 通过，tsc 无新增类型错误
- [x] T9: 手动验证（需用户在本地 dev server 确认代码块可读性）

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 博客详情页代码展示优化
change: blog-code-highlighting
date: 2026-05-10
type: B
status: applied
```

### `design.md`
# 设计文档

## 架构对比

### 之前

```
page.tsx (server) → PostView.tsx (client)
                       ├── marked.parse() → HTML
                       ├── useToc (DOMParser, 添加 heading id/anchor)
                       └── usePostImagePreview
                             ├── CDN highlight.js 加载 + highlightAll()
                             ├── 复制按钮注入
                             └── 图片预览收集
```

### 之后

```
page.tsx (server)
  ├── api.content.getPost() → 原始 markdown
  └── renderMarkdown() → HTML (unified pipeline, 含语法高亮)
        │
PostView.tsx (client)
  ├── 直接使用预渲染 HTML
  ├── useToc (DOMParser, 仅提取 TOC)
  └── usePostImagePreview
        ├── 复制按钮注入 (保留)
        └── 图片预览收集 (保留)
```

## unified pipeline

```
remark-parse → remark-gfm → remark-rehype → rehype-highlight → rehype-slug → rehype-autolink-headings → rehype-stringify
```

## 关键决策

- **服务端渲染**: unified 管道在 page.tsx 执行，不进入客户端 bundle
- **代码高亮主题**: `rehype-highlight` 输出 hljs 类名，CSS 变量控制配色，响应 `prefers-color-scheme`
- **TOC 保留客户端提取**: `rehype-slug` 负责 id，`useToc` 仅提取数据
- **锚点链接**: `rehype-autolink-headings` 在服务端生成

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `package.json` | 修改 | +unified 生态，-marked |
| `app/lib/markdown.ts` | 新增 | unified pipeline |
| `app/post/[number]/page.tsx` | 修改 | 服务端调用 renderMarkdown |
| `app/post/PostView.tsx` | 修改 | 移除 marked |
| `app/post/usePostImagePreview.ts` | 修改 | 移除 CDN highlight.js |
| `app/post/hooks/useToc.ts` | 修改 | 简化为仅提取 TOC |
| `app/post/styles/index.ts` | 修改 | 代码块主题配色 + hljs token |

### `proposal.md`
# 博客详情页代码展示优化

## What

将博客详情页的 markdown 渲染从 `marked` + CDN highlight.js 方案迁移到 unified + remark + rehype 生态，在服务端完成语法高亮。

## Why

当前方案存在三个问题：

1. **代码块在 light 主题下看不清** — `--atom-pre-bg` 硬编码为 `#1e1e1e`（深色），`pre code` 文字颜色硬编码 `#d4d4d4`。无论站点切换到 money 还是 plain 主题，代码块始终深色背景，与浅色页面形成强烈对比。

2. **highlight.js 从 CDN 加载，不感知站点主题** — 只监听 OS 级 `prefers-color-scheme` 切换 `atom-one-dark`/`atom-one-light`，不知道站点 `data-theme` 的手动切换。

3. **CDN 依赖** — 语法高亮完全依赖外部 CDN 可用性，加载失败时代码块无任何样式。

改用 rehype 生态后，语法高亮在服务端完成，无 CDN 依赖，代码块配色可通过 CSS 变量统一响应站点主题切换。

### `specs/blog-code-highlighting/spec.md`
# 博客代码高亮

## R1 — 代码块主题适配

代码块配色应响应 `prefers-color-scheme` 切换。在 light 模式下代码块背景为浅色面板，dark 模式下为深色面板。代码文字与背景有足够对比度。

## R2 — 服务端语法高亮

语法高亮在服务端完成，页面 HTML 直接包含带 hljs 类名的代码块。不依赖 CDN 外部资源。

## R3 — 移除 CDN highlight.js

删除 `usePostImagePreview.ts` 中 CDN highlight.js 脚本和样式加载逻辑，以及 `prefers-color-scheme` 媒体查询监听。

## R4 — 保留现有功能

以下功能不受影响：
- 代码块复制按钮
- 博客图片预览
- 目录 (TOC) 生成和导航
- GFM 扩展语法（表格、任务列表、删除线）

### `tasks.md`
# 任务拆分

## Phase 1 — 依赖与工具

- [x] T1: 安装 unified 生态依赖，移除 marked
- [x] T2: 创建 `app/lib/markdown.ts` — unified pipeline 工具函数

## Phase 2 — 服务端适配

- [x] T3: 更新 `page.tsx` 在服务端预渲染 markdown

## Phase 3 — 客户端精简

- [x] T4: 更新 `PostView.tsx` 移除 marked
- [x] T5: 移除 CDN highlight.js 加载逻辑
- [x] T6: 简化 `useToc.ts`（移除 heading DOM 修改）

## Phase 4 — 样式修复

- [x] T7: 更新代码块 CSS（主题响应式 + hljs token 配色）

## Phase 5 — 验证

- [x] T8: oxlint 通过，tsc 无新增类型错误
- [x] T9: 手动验证（需用户在本地 dev server 确认代码块可读性）
