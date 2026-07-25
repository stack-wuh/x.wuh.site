---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# SEO Batch C 技术设计

**目标：** 在不增加后端 API 和不改变可见 UI 的前提下，统一全站分享图片、文章 metadata、Markdown 摘要和 About 作者结构化数据。

**Architecture：** 将 SEO 规则集中到 Next 前端的纯函数模块，Markdown 摘要只依赖现有 unified/remark AST 管线；页面组件负责获取数据和把结构化数据交给现有 `JsonLd` 输出组件。

**Tech Stack：** Next.js 15 App Router、React 19、TypeScript 5、`unified`、`remark-parse`、`remark-gfm`、Node test runner。

## 架构

```text
ContentItem / GitHubProfileDto
          │
          ├── app/lib/markdown.ts
          │      └── extractFirstParagraphText()
          │
          └── app/lib/seo.ts
                 ├── buildArticleDescription()
                 ├── buildArticleMetadata()
                 ├── buildBlogPostingJsonLd()
                 └── buildProfilePageJsonLd()
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   app/layout.tsx   post/[number]/page.tsx  about/page.tsx
        │                 │                 │
   默认站点 metadata  文章 metadata + JSON-LD  ProfilePage JSON-LD
```

### 默认分享图片

- 在 `packages/wuh.site.next/public/og-default.png` 放置 1200×630 静态图片。
- 在 `app/layout.tsx` 设置全站默认 `openGraph.images`、`twitter.card` 和 `twitter.images`。
- 文章 metadata 通过同一个默认图片 URL 回退；有 `metadata.cover` 时继续优先使用显式封面。
- 通过已有 `metadataBase: https://wuh.site` 生成绝对 URL，不新增环境变量。

### Markdown 摘要

`app/lib/markdown.ts` 增加同步 AST 提取函数，处理流程如下：

1. 用现有 `remarkParse` 和 `remarkGfm` 解析 Markdown AST。
2. 仅检查根节点的直接子节点，跳过 `heading`、`code` 和空白节点。
3. 找到首个有效 `paragraph` 后递归拼接其文本子节点；保留链接、强调、删除线和行内代码中的可读文字。
4. 归一化空白并限制为 160 个字符；超出时使用 `...`。
5. 没有有效段落时回退到 `阅读这篇博客文章`。

### 文章 metadata

`app/lib/seo.ts` 负责纯函数映射：

- `summary`：非空 CMS `metadata.summary` 优先，否则调用 AST 摘要函数。
- `keywords`：`metadata.keywords` 非空时原样使用，否则使用全部 labels。
- `category`：优先使用 `metadata.extra.category` 的非空字符串，否则使用第一个 label。
- `authors`：由文章作者 login/name 生成 Next Metadata 的 author 对象，并附 GitHub profile URL。
- `images`：`metadata.cover` 优先，否则使用默认 OG 图片；封面 alt 优先使用 `coverAlt`，再回退文章标题。
- `BlogPosting.author` 使用站点 Person `@id`，并通过 `sameAs` 保持与 GitHub profile 的关联。

### About 作者档案

`about/page.tsx` 在现有 profile/repositories 并行请求完成后，输出一个 `ProfilePage` JSON-LD：

- `@id` 为 `https://wuh.site/about#profilepage`；
- `mainEntity` 为站点 Person `https://wuh.site/#person`；
- Person 的 `sameAs` 至少包含 `https://github.com/stack-wuh`；
- profile API 失败时使用稳定的 `stack-wuh`、站点 URL 和页面既有文案作为降级值；
- 继续复用 `app/components/JsonLd.tsx`，不引入第二套脚本输出逻辑。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 摘要解析 | 复用 `unified + remark-parse + remark-gfm` | 依赖已经存在，和正文渲染使用同一 Markdown 语义，不需要正则猜测结构 |
| AST 遍历 | 新增小型递归文本提取函数 | 只需要段落、文本和少量 inline 节点，不为一次性需求引入 `unist-util-visit` 或 `mdast-util-to-string` |
| SEO 规则 | `app/lib/seo.ts` 纯函数 | 页面逻辑只负责数据获取，规则可通过 Node test runner 独立验证 |
| 默认图片 | `public/og-default.png` | 静态资源部署稳定，适合社交平台抓取，尺寸固定为 1200×630 |
| 结构化数据 | 复用 `JsonLd` | 保持现有 JSON-LD 输出方式，避免新增组件或重复安全边界 |
| 测试 | `.mjs` + Node `node:test` | 匹配仓库现有测试方式，覆盖纯函数输入输出和关键页面源码契约 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Markdown 渲染管线 | `@/app/lib/markdown` | 扩展 | `packages/wuh.site.next/app/lib/markdown.ts` |
| JSON-LD 输出 | `@/app/components/JsonLd` | 复用 | `packages/wuh.site.next/app/components/JsonLd.tsx` |
| Next metadataBase | `next` metadata | 复用 | `packages/wuh.site.next/app/layout.tsx` |
| GitHub profile 数据 | `@wuh.site/shared-contracts` / `reposService` | 复用 | `packages/wuh.site.next/app/about/page.tsx` |
| 文章内容模型 | `ContentItem`、`Issue` | 复用 | `packages/shared-contracts/src/index.ts`、`app/post/PostView.types.ts` |
| SEO 规则工具 | `@/app/lib/seo` | 新建 | 无，作为本批次纯函数模块 |

**说明：** 本批次不新增组件包组件，也不改变后端 DTO、接口路径或数据库 schema。

## 数据模型（如涉及）

不新增数据模型。使用现有字段：

```ts
ContentItem.metadata?.summary?: string
ContentItem.metadata?.keywords?: string[]
ContentItem.metadata?.cover?: string
ContentItem.metadata?.coverAlt?: string
ContentItem.metadata?.extra?: Record<string, unknown>
ContentItem.labels: string[]
ContentItem.author: { login: string; url: string }
```

`category` 的运行时读取规则为：

```ts
const category =
  typeof item.metadata?.extra?.category === 'string' && item.metadata.extra.category.trim()
    ? item.metadata.extra.category.trim()
    : item.labels[0]
```

## API 设计（如涉及）

无 API 变更。继续调用现有服务：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | 现有 `contentService.getPost` | 获取文章及 metadata、labels、author |
| GET | 现有 `reposService.getProfile` | 获取 About 页 GitHub profile |

## 组件/模块设计

### `app/lib/markdown.ts`

- 保留 `renderMarkdown(md)` 的现有异步 HTML 渲染接口。
- 新增 `extractFirstParagraphText(md, maxLength = 160): string`。
- 函数必须是纯函数、同步、无浏览器 API 依赖，便于 metadata 生成和单元测试。

### `app/lib/seo.ts`

- 导出站点 URL、默认图片路径和默认描述常量。
- 导出文章摘要、关键词、分类、图片、metadata 和 BlogPosting JSON-LD builder。
- 导出 `buildProfilePageJsonLd(profile)`，支持 profile 为 `null` 的稳定降级。
- 只接受现有 DTO/view model，不发起网络请求。

### `app/post/[number]/page.tsx`

- 保留 `getIssue`、slug 解析、正文渲染和相邻文章查询。
- 删除页面内正则摘要逻辑，改为调用 `app/lib/seo.ts`。
- `generateMetadata` 和 BlogPosting JSON-LD 使用同一份 description、image、author、keywords、category 映射，避免 metadata 与正文脚本不一致。

### `app/about/page.tsx`

- 保留现有 profile/repositories 数据获取。
- 在 `AboutView` 前输出由 `buildProfilePageJsonLd(profile)` 生成的 `JsonLd`。
- 不改变 About 页面现有可见内容和交互。

## 响应式策略（如涉及）

不涉及可见 UI 或响应式布局变更。默认图片固定为 1200×630，页面展示行为由社交平台抓取 metadata 决定。

## 影响分析

- **新增依赖:** 无；复用现有 `unified`、`remark-parse`、`remark-gfm`。
- **破坏性变更:** 无；保留显式封面、canonical URL、现有正文渲染和 API 契约。
- **向后兼容:** 无 cover 的历史文章获得默认图片；CMS summary、keywords、coverAlt 和旧 URL 行为保持兼容。
- **性能影响:** AST 摘要只在文章 metadata/JSON-LD 生成时执行一次，数据量小；不新增请求，About profile 继续使用现有缓存策略。
- **回滚策略:** 删除新 SEO 工具、默认图片和调用点即可恢复现有 metadata；不涉及数据库迁移。
