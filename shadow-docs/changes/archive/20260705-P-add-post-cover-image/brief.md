# 博客详情页支持正文首图封面

> 原始变更名：`2026-07-05-P-add-post-cover-image`

## 元数据
- 日期：2026-07-05
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
当前博客详情页已经存在 `metadata.cover` 的封面展示能力，但依赖文章显式配置封面图。多数 GitHub Issue 文章正文中已经包含图片，如果没有手动配置封面，详情页顶部缺少视觉锚点，文章内容的第一张图也无法自然承担封面作用。

用户希望封面图由服务端直接处理出来：前端只接收一张封面图片链接并负责展示；如果正文没有图片，或图片加载失败，则不展示封面区域。

## 引用规范
- `specs/blog-detail/spec.md`
- `specs/content-api/spec.md`

## 决策
本需求采用“服务端推导 + 前端展示”的方式。内容详情接口负责在返回文章前补齐封面 URL，前端不再解析正文，只消费 `issue.metadata.cover`。

```
GitHub Issue / MongoDB Content
          |
          v
ContentService.findBySlugOrNumber()
          |
          v
ContentController.getPostDetail()
          |
          v
buildPostDetailResponse()
  - 保留 metadata.cover
  - 否则从 bodyHtml 第一张 img 提取
  - 再否则从 body Markdown 第一张图提取
          |
          v
PostView
  - PostHeader 渲染标题/作者/摘要
  - PostCover 渲染封面图并在 onError 后隐藏
  - MarkdownBody 正文保持原样
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 封面来源 | 复用 `metadata.cover` | 现有契约已表达封面语义，避免新增字段和前后端映射成本 |
| 推导位置 | 详情接口响应层 | 旧文章无需回填即可生效，避免把自动推导值写入数据库污染手动配置 |
| 提取顺序 | `metadata.cover` > `bodyHtml` 首图 > `body` Markdown 首图 | 手动配置优先，HTML 更接近实际渲染结果，Markdown 作为兜底 |
| 图片失败处理 | 前端 `onError` 隐藏组件 | 图片可用性依赖远端资源，客户端最适合处理加载失败 |

## 任务
### Phase 1: 服务端封面推导
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content-cover.util.ts`
- [x] 实现 `extractFirstImageUrl(bodyHtml, body)`，优先提取 HTML 首个 `<img src>`。
- [x] Markdown fallback 支持 `![alt](url)` 格式。
- [x] 覆盖无图、HTML 图、Markdown 图、HTML 优先于 Markdown 的单元测试。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 25 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`
- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 在 `getPostDetail()` 返回前构造 plain response，避免修改 Mongoose 文档对象。
- [x] 当原始 `metadata.cover` 缺失时，使用正文首图补齐返回值中的 `metadata.cover`。
- [x] 保留 `liked`、`prev`、`next`、`total`、`position` 返回字段。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`
### Phase 2: 前端封面展示
- [x] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [x] 移除标题上方的封面图渲染，让 Header 只负责标题、作者、摘要和装饰分隔线。
- [x] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`
- [x] 新增封面展示组件，无 `src` 不渲染，图片加载失败后隐藏。
- [x] **预计耗时:** 50 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/post`
- [x] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [x] 在 `PostHeader` 后、`ArticleCard` 前渲染 `PostCover`。
- [x] 使用 `issue.metadata?.cover` 作为图片来源，`issue.title` 作为 alt。
- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-header.ts`
- [x] 复用或调整现有 `CoverImage` 样式，确保桌面和移动端不溢出。
- [x] **预计耗时:** 40 分钟
- [x] **实际耗时:** 15 分钟
- [ ] **验证:** 待用户手动检查有图/无图/坏图三种文章详情页表现
### Phase 3: 回归验证
- [x] **文件:** `packages/shared-contracts/src/index.ts`
- [x] 确认无需新增契约字段；未新增契约字段。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node_modules/.bin/tsc --noEmit`
- [x] 已有 `metadata.cover` 的文章继续使用手动封面。
- [x] 没有 `metadata.cover` 但正文含图片的文章，详情页展示正文第一张图片作为封面。
- [x] 正文没有图片的文章不展示封面区域。
- [x] 封面图片加载失败时隐藏封面区域，不出现破图。
- [x] 封面展示位置位于标题/元信息下方、正文上方。
- [x] `node_modules/.bin/tsc --noEmit` 零错误。

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-05-P-add-post-cover-image
date: 2026-07-05
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/181
```

### `design.md`
# 设计文档

## 架构

本需求采用“服务端推导 + 前端展示”的方式。内容详情接口负责在返回文章前补齐封面 URL，前端不再解析正文，只消费 `issue.metadata.cover`。

```
GitHub Issue / MongoDB Content
          |
          v
ContentService.findBySlugOrNumber()
          |
          v
ContentController.getPostDetail()
          |
          v
buildPostDetailResponse()
  - 保留 metadata.cover
  - 否则从 bodyHtml 第一张 img 提取
  - 再否则从 body Markdown 第一张图提取
          |
          v
PostView
  - PostHeader 渲染标题/作者/摘要
  - PostCover 渲染封面图并在 onError 后隐藏
  - MarkdownBody 正文保持原样
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 封面来源 | 复用 `metadata.cover` | 现有契约已表达封面语义，避免新增字段和前后端映射成本 |
| 推导位置 | 详情接口响应层 | 旧文章无需回填即可生效，避免把自动推导值写入数据库污染手动配置 |
| 提取顺序 | `metadata.cover` > `bodyHtml` 首图 > `body` Markdown 首图 | 手动配置优先，HTML 更接近实际渲染结果，Markdown 作为兜底 |
| 图片失败处理 | 前端 `onError` 隐藏组件 | 图片可用性依赖远端资源，客户端最适合处理加载失败 |

## 数据模型（如涉及）

不新增字段，继续使用现有契约：

```ts
metadata?: {
  slug?: string
  summary?: string
  cover?: string
  keywords?: string[]
  rssExcluded?: boolean
  extra?: Record<string, unknown>
}
```

响应层需要保证：当 `metadata.cover` 原本不存在但正文可提取第一张图片时，返回值中的 `metadata.cover` 为该图片 URL；数据库中的原始 `metadata` 不被修改。

## API 设计（如涉及）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/content/posts/:slugOrNumber` | 返回文章详情，`metadata.cover` 可能由服务端从正文首图推导 |

**响应示例:**

```json
{
  "number": 155,
  "title": "一篇有图片的文章",
  "metadata": {
    "summary": "文章摘要",
    "cover": "https://example.com/cover.png"
  },
  "bodyHtml": "<p><img src=\"https://example.com/cover.png\" /></p>",
  "prev": null,
  "next": null,
  "total": 1,
  "position": 1
}
```

## 组件/模块设计

### `extractFirstImageUrl`

负责从内容中提取首张图片 URL。建议作为纯函数放在内容模块附近，便于单元测试。

- 输入：`bodyHtml?: string | null`、`body?: string | null`
- 输出：`string | undefined`
- 行为：优先解析 HTML `<img src="...">`；如果没有命中，再解析 Markdown 图片语法 `![alt](url)`。
- 约束：只返回 URL，不校验远程资源是否可访问。

### 详情响应组装

`ContentController.getPostDetail()` 当前直接返回 `result.toJSON()`。本次引入响应组装逻辑：

- 将 Mongoose 文档转为 plain object。
- 复制并补齐 `metadata`，避免修改原文档对象。
- 保留已有 `liked`、`prev`、`next`、`total`、`position` 字段。

### `PostHeader`

只负责文章标题、作者、日期、阅读数、摘要和装饰分隔线，不再渲染封面图。

### `PostCover`

新增或拆分一个轻量客户端组件，职责单一：

- 接收 `src` 和 `alt`。
- 无 `src` 时不渲染。
- 图片 `onError` 后设置本地隐藏状态，不渲染封面区域。
- 放置在 `PostHeader` 之后、`ArticleCard` 之前。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 封面图在主内容列内完整展示，保持圆角和最大宽度，不超过文章卡片宽度 |
| < 768px | 封面图跟随主内容列宽度缩放，避免横向滚动 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；`metadata.cover` 是既有可选字段。
- **向后兼容:** 没有正文图片的文章返回行为保持等价；已有手动 `metadata.cover` 优先级不变。
- **性能影响:** 每次详情响应会做一次轻量字符串匹配；仅针对单篇文章，影响可忽略。

### `proposal.md`
# 博客详情页支持正文首图封面

## 背景

当前博客详情页已经存在 `metadata.cover` 的封面展示能力，但依赖文章显式配置封面图。多数 GitHub Issue 文章正文中已经包含图片，如果没有手动配置封面，详情页顶部缺少视觉锚点，文章内容的第一张图也无法自然承担封面作用。

用户希望封面图由服务端直接处理出来：前端只接收一张封面图片链接并负责展示；如果正文没有图片，或图片加载失败，则不展示封面区域。

## 目标

- 服务端在文章详情响应中提供可用的 `metadata.cover`。
- 当原始 `metadata.cover` 不存在时，从正文第一张图片自动推导封面 URL。
- 博客详情页在标题/元信息下方、正文上方展示封面图。
- 封面图加载失败时静默隐藏，不展示破图或错误提示。
- 保持正文原图展示不变，封面只是额外的详情页视觉增强。

## 非目标（明确不做）

- 不新增后台管理配置入口。
- 不对历史数据做批量回填或写库迁移。
- 不改变列表页、RSS 或 SEO 的封面策略。
- 不从远程图片下载、转存或生成缩略图。

## 影响范围

- `packages/wuh.site.nest` — 在内容详情响应层补齐 `metadata.cover`，新增首图提取逻辑及测试。
- `packages/shared-contracts` — 继续复用已有 `metadata.cover` 契约，不新增字段。
- `packages/wuh.site.next` — 调整博客详情页封面展示位置，并处理图片加载失败隐藏。
- `openspec/specs/content-api/spec.md` — 增加文章详情封面字段推导规则。
- `openspec/specs/blog-detail/spec.md` — 增加详情页封面展示规则。

### `specs/blog-detail/spec.md`
# Spec: 博客详情页封面展示

## ADDED

### Requirement: Detail page shows cover below header metadata
- **GIVEN** 文章详情接口返回 `metadata.cover`
- **WHEN** 用户打开博客详情页
- **THEN** 页面应在标题/作者/摘要区域下方、正文内容上方展示封面图
- **AND** 正文中的原图片内容应保持展示，不应因为作为封面而被移除

### Requirement: Detail page hides unavailable cover image
- **GIVEN** 文章详情接口未返回 `metadata.cover`
- **WHEN** 用户打开博客详情页
- **THEN** 页面不应渲染封面图区域

### Requirement: Detail page hides failed cover image
- **GIVEN** 文章详情接口返回了 `metadata.cover`
- **WHEN** 封面图片加载失败
- **THEN** 页面应隐藏封面图区域
- **AND** 不应显示破图、错误提示或占位图

---

## MODIFIED

### Requirement: 正文字号与行高
- **GIVEN** 用户查看包含封面图的博客详情页
- **WHEN** 页面渲染 Markdown 正文
- **THEN** 正文排版仍应遵守既有字号与行高要求
- **AND** 封面图不应造成正文横向滚动

---

## REMOVED

### Requirement: None
- 本次不移除既有博客详情页排版需求。

### `specs/content-api/spec.md`
# Spec: 内容 API 文章详情封面

## ADDED

### Requirement: Post detail derives cover from first content image
- **GIVEN** 一篇文章的 `metadata.cover` 为空，且 `bodyHtml` 中包含至少一个 `<img src="...">`
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 `bodyHtml` 中第一张图片的 `src`
- **AND** 服务端不应将该推导值写回数据库

### Requirement: Post detail falls back to markdown first image
- **GIVEN** 一篇文章的 `metadata.cover` 为空，`bodyHtml` 不包含图片，且 `body` 中包含 Markdown 图片语法
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 Markdown 正文第一张图片的 URL

---

## MODIFIED

### Requirement: Post detail includes prev/next adjacent posts
- **GIVEN** 一篇已存在的文章
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应继续包含 `prev`、`next`、`total`、`position`
- **AND** 响应的 `metadata.cover` 优先保留原始手动配置值；仅当原始值为空时，才从正文首图推导

---

## REMOVED

### Requirement: None
- 本次不移除既有内容 API 需求。

### `tasks.md`
# 任务清单

## Phase 1: 服务端封面推导

### Task 1: 增加首图提取纯函数

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content-cover.util.ts`
- [x] 实现 `extractFirstImageUrl(bodyHtml, body)`，优先提取 HTML 首个 `<img src>`。
- [x] Markdown fallback 支持 `![alt](url)` 格式。
- [x] 覆盖无图、HTML 图、Markdown 图、HTML 优先于 Markdown 的单元测试。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 25 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`

### Task 2: 详情接口补齐 `metadata.cover`

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 在 `getPostDetail()` 返回前构造 plain response，避免修改 Mongoose 文档对象。
- [x] 当原始 `metadata.cover` 缺失时，使用正文首图补齐返回值中的 `metadata.cover`。
- [x] 保留 `liked`、`prev`、`next`、`total`、`position` 返回字段。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`

## Phase 2: 前端封面展示

### Task 3: 调整 Header 与封面组件职责

- [x] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [x] 移除标题上方的封面图渲染，让 Header 只负责标题、作者、摘要和装饰分隔线。
- [x] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`
- [x] 新增封面展示组件，无 `src` 不渲染，图片加载失败后隐藏。
- [x] **预计耗时:** 50 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/post`

### Task 4: 将封面放到标题/元信息下方、正文上方

- [x] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [x] 在 `PostHeader` 后、`ArticleCard` 前渲染 `PostCover`。
- [x] 使用 `issue.metadata?.cover` 作为图片来源，`issue.title` 作为 alt。
- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-header.ts`
- [x] 复用或调整现有 `CoverImage` 样式，确保桌面和移动端不溢出。
- [x] **预计耗时:** 40 分钟
- [x] **实际耗时:** 15 分钟
- [ ] **验证:** 待用户手动检查有图/无图/坏图三种文章详情页表现

## Phase 3: 回归验证

### Task 5: 类型与构建检查

- [x] **文件:** `packages/shared-contracts/src/index.ts`
- [x] 确认无需新增契约字段；未新增契约字段。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node_modules/.bin/tsc --noEmit`

## 验收

- [x] 已有 `metadata.cover` 的文章继续使用手动封面。
- [x] 没有 `metadata.cover` 但正文含图片的文章，详情页展示正文第一张图片作为封面。
- [x] 正文没有图片的文章不展示封面区域。
- [x] 封面图片加载失败时隐藏封面区域，不出现破图。
- [x] 封面展示位置位于标题/元信息下方、正文上方。
- [x] `node_modules/.bin/tsc --noEmit` 零错误。
