# SEO 内容发现与站内导航

> 原始变更名：`2026-07-26-P-seo-discovery-navigation`

## 元数据
- 日期：2026-07-26
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
`docs/superpowers/plans/` 中保存了 2026-07-23 至 2026-07-25 的 SEO P0、P1 与 P1.2–P1.7 实施计划。这些计划共同定义了文章 URL 规范化、结构化数据、相关文章、主题页、sitemap 与索引策略，但尚未形成统一的 OpenSpec 规范。

本变更将这些历史计划迁移为可长期维护的需求制品。已单独归档的“阅读余韵索引”视觉设计不重复迁移，仅保留相关文章的数据发现与站内链接契约。

## 引用规范
- `specs/blog-detail/spec.md`
- `specs/seo/spec.md`

## 决策
SEO 能力按“规范 URL → 可抓取入口 → 聚合页 → 结构化数据”组织：

```text
Content API
├─ 分页文章 ──► canonical post URLs ──► sitemap
├─ 标签汇总 ──► canonical topic URLs ──► sitemap / topic pages
└─ 标签候选 ──► related-post selector ──► post detail links

Next.js server pages
├─ Metadata API：canonical、robots、title、description
├─ JSON-LD builders：WebSite、Person、BlogPosting、BreadcrumbList、CollectionPage、ItemList
└─ ISR：公开内容按小时重验证，不依赖用户 Cookie
```

文章编号继续作为内容查询键，标题 slug 只承担规范 URL 和可读性。非规范路径永久重定向至当前标题生成的 canonical URL。主题参数通过单一 URL 工具编码和解码，避免页面、sitemap 与链接生成规则分叉。

- 使用 Next.js App Router Metadata API 输出 canonical、robots 和页面 metadata。
- 使用纯 TypeScript builder 生成 Schema.org JSON-LD，页面仅负责提供数据和渲染。
- 使用现有 Content API 的分页、单标签查询与标签汇总能力，不新增接口。
- 使用服务端组件获取公开内容并配置 `revalidate: 3600`。
- 相关文章使用纯函数完成排除当前文章、按编号去重、共享标签数与更新时间排序，最多返回三篇。

## 任务
### Phase 1：URL、metadata 与 sitemap 基础
- [x] 规范化文章 URL 并对非 canonical 路径永久重定向。
- [x] 为公开文章启用 ISR，移除 SEO 渲染的 Cookie 依赖。
- [x] 分页生成 canonical sitemap，排除调试页并为调试页设置 noindex。
- [x] 补齐全局 metadata 默认值。
### Phase 2：结构化数据
- [x] 建立 WebSite、Person、BlogPosting 与 BreadcrumbList builder。
- [x] 在文章页渲染可访问面包屑。
- [x] 为主题页输出 CollectionPage 与 ItemList。
### Phase 3：内容发现与站内链接
- [x] 选择、去重和排序最多三篇相关文章。
- [x] 建立可索引主题页并统一标签链接。
- [x] 将主题页加入 sitemap，并将旧标签 query 页设为 noindex/follow。
- [x] 区分 Alert 站内与站外链接行为。
### Phase 4：验证
- [x] 运行对应 SEO Node 测试、前端 lint、TypeScript 与 diff 检查。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: seo-discovery-navigation
date: 2026-07-26
type: P
status: proposed
```

### `design.md`
# SEO 内容发现与站内导航设计

## 架构

SEO 能力按“规范 URL → 可抓取入口 → 聚合页 → 结构化数据”组织：

```text
Content API
├─ 分页文章 ──► canonical post URLs ──► sitemap
├─ 标签汇总 ──► canonical topic URLs ──► sitemap / topic pages
└─ 标签候选 ──► related-post selector ──► post detail links

Next.js server pages
├─ Metadata API：canonical、robots、title、description
├─ JSON-LD builders：WebSite、Person、BlogPosting、BreadcrumbList、CollectionPage、ItemList
└─ ISR：公开内容按小时重验证，不依赖用户 Cookie
```

文章编号继续作为内容查询键，标题 slug 只承担规范 URL 和可读性。非规范路径永久重定向至当前标题生成的 canonical URL。主题参数通过单一 URL 工具编码和解码，避免页面、sitemap 与链接生成规则分叉。

## 技术选型

- 使用 Next.js App Router Metadata API 输出 canonical、robots 和页面 metadata。
- 使用纯 TypeScript builder 生成 Schema.org JSON-LD，页面仅负责提供数据和渲染。
- 使用现有 Content API 的分页、单标签查询与标签汇总能力，不新增接口。
- 使用服务端组件获取公开内容并配置 `revalidate: 3600`。
- 相关文章使用纯函数完成排除当前文章、按编号去重、共享标签数与更新时间排序，最多返回三篇。

## 复用分析

- 复用 `buildPostUrl` 生成文章 canonical URL。
- 复用 Content API 的 `getPosts.server` 与 `getLabels.server`。
- 复用现有 `JsonLd` 渲染组件。
- 复用博客列表样式与文章详情 `PostView`，不建立新的通用组件包抽象。
- 已归档的“阅读余韵索引”继续作为相关文章表现层规范，本变更不覆盖其视觉契约。

## 影响分析

- `app/post/[number]/page.tsx` 不再依赖请求 Cookie，可由 ISR 缓存；非 canonical 路径会永久重定向。
- sitemap 必须分页读取全部 open 文章；任一页加载失败时显式失败，避免生成不完整索引。
- `/blog?labels=` 保留兼容但设为 noindex/follow，索引入口迁移至 `/topics/[label]`。
- 主题页输出 canonical metadata 和 CollectionPage/ItemList JSON-LD。
- Alert 仅对外部链接设置新窗口与安全属性，站内主题链接保持同窗口导航。
- 不涉及数据库、DTO 或后端路由变更。

## 数据与接口

- 文章 sitemap 数据使用 `number`、`title`、`updatedAtGitHub`、`createdAtGitHub`。
- 相关文章候选使用 `number`、`title`、`labels`、`updatedAt` 和可选 `summary`。
- topic URL 采用 `/topics/<encodeURIComponent(label)>`。
- 集合 JSON-LD 的 `ItemList` 条目使用 canonical 文章 URL，并按页面顺序从 1 递增。

## 回滚

- 主题页与结构化数据均为新增公开入口，可独立移除。
- canonical 重定向回滚时仍需保留旧数字 URL 的正常渲染能力。
- sitemap 变更可回退到上一个生成器，但不得输出调试页或 query 筛选 URL。

### `proposal.md`
# SEO 内容发现与站内导航

## 背景

`docs/superpowers/plans/` 中保存了 2026-07-23 至 2026-07-25 的 SEO P0、P1 与 P1.2–P1.7 实施计划。这些计划共同定义了文章 URL 规范化、结构化数据、相关文章、主题页、sitemap 与索引策略，但尚未形成统一的 OpenSpec 规范。

本变更将这些历史计划迁移为可长期维护的需求制品。已单独归档的“阅读余韵索引”视觉设计不重复迁移，仅保留相关文章的数据发现与站内链接契约。

## 目标

- 统一文章 canonical URL、永久重定向、ISR、全局 metadata 与 sitemap 抓取策略。
- 为站点、作者、文章、面包屑及集合页提供一致的 Schema.org JSON-LD。
- 提供最多三篇、去重且按相关度排序的相关文章。
- 建立可索引的 `/topics/[label]` 主题页。
- 将主题页加入 sitemap，并让旧 query 筛选页保持 noindex/follow。
- 将文章标签与博客标签入口统一指向站内主题页。

## 非目标（明确不做）

- 不重复定义已归档的相关文章视觉表现层。
- 不新增后端 API；复用现有内容分页、标签查询与标签汇总接口。
- 不改变 GitHub Issues 作为 CMS 的数据来源。
- 不引入新的 SEO SaaS、分析平台或第三方依赖。

## 影响范围

- `packages/wuh.site.next/app/` — metadata、文章页、主题页、sitemap、结构化数据和站内导航。
- `packages/components/alert/` — 内部链接与外部链接的打开策略。
- 影响规范：`seo`、`blog-detail`。

### `specs/blog-detail/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
---

# Spec: 博客详情页

## ADDED

### Requirement: 相关文章基于标签与时间排序、去重且最多三篇
- **GIVEN** 当前文章最多三个非空标签
- **WHEN** 获取相关文章候选
- **THEN** 每个标签并发请求最多 10 篇候选文章
- **AND** `selectRelatedPosts` 排除当前文章编号并按共享标签数降序、更新时间降序、编号升序排序
- **AND** 同一编号仅保留第一条，总数不超过 3 篇
- **AND** 无标签或全部请求失败时返回空数组

### Requirement: 文章标签链接指向站内主题页
- **GIVEN** 文章详情页渲染标签
- **WHEN** 生成标签链接
- **THEN** 使用 `buildTopicUrl(label.name)` 生成 `/topics/<encoded>` 站内链接
- **AND** 不再构造 GitHub Issue label query URL

### Requirement: Alert 区分站内外链接的打开行为
- **GIVEN** Alert 组件渲染带链接的内容
- **WHEN** 链接 href 是外部域名
- **THEN** 设置 `target="_blank"` 与 `rel="noopener noreferrer"`
- **WHEN** 链接 href 是站内路径
- **THEN** 不设置 `target="_blank"`，保持同窗口导航

### `specs/seo/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
---

# Spec: SEO

## ADDED

### Requirement: 文章页对非规范路径永久重定向
- **GIVEN** 文章通过 `/post/<number>` 或其历史 slug 被访问
- **WHEN** 当前标题生成的 canonical slug 与请求路径不同
- **THEN** 服务端执行 308 永久重定向至 `/post/<number>-<canonical-slug>`
- **AND** `buildPostUrl` 与 `isCanonicalPostPath` 使用相同的 slug → 规范 URL 链路

### Requirement: 公开文章页不依赖请求 Cookie 且使用 ISR
- **GIVEN** SEO 公开文章页渲染
- **WHEN** 页面 `fetch` 调用或 `getPost.server` 执行
- **THEN** 不使用 `cookies()` 或 `ANON_COOKIE_NAME` 读取请求 Cookie
- **AND** 使用 `revalidate: 3600` 级别的 ISR 替代实时渲染

### Requirement: Sitemap 分页生成并错误即失败
- **GIVEN** 生成主站 sitemap
- **WHEN** 收集文章条目
- **THEN** 按 `state: 'open'`、`revalidate: 3600`、固定 pageSize 分页获取
- **AND** 任一页失败时 sitemap 生成显式失败，不返回不完整的条目集合
- **AND** 每篇文章条目使用 `buildPostUrl(number, title)` 生成 canonical URL
- **AND** `lastModified` 使用 `updatedAtGitHub` 或回退至 `createdAtGitHub`

### Requirement: 调试与设计调试页不进入 sitemap 且不可索引
- **GIVEN** `/design/system-color` 等内部调试页面
- **WHEN** 生成静态 sitemap 或页面 metadata
- **THEN** 静态 sitemap 不包含此类页面
- **AND** 页面 robots metadata 为 `index: false, follow: false`

### Requirement: 根布局提供全局 Metadata 默认值
- **GIVEN** 任意页面通过 Next.js Metadata API 生成 metadata
- **WHEN** 根 layout 定义 metadata
- **THEN** 包含 `metadataBase`、`title.template` 和 `title.default`
- **AND** 包含全站 `description`、`authors`、`creator` 与 `publisher`

### Requirement: WebSite 与 Person JSON-LD 根布局输出
- **GIVEN** 任意页面被爬虫抓取
- **WHEN** 根布局渲染
- **THEN** 输出包含 `WebSite` 与 `Person` 的 JSON-LD 图
- **AND** Person 指向 `https://github.com/stack-wuh`

### Requirement: BlogPosting 使用 builder 统一构造
- **GIVEN** 博客文章渲染 JSON-LD
- **WHEN** 调用 builder
- **THEN** 仅提供 url、title、description、publishedAt、modifiedAt 时不含 image/keywords/articleSection
- **AND** 提供 cover 时包含 `image` 与 `caption`
- **AND** 提供 keywords 时合并为逗号分隔字符串
- **AND** 提供 labels 时写入 `articleSection`

### Requirement: 面包屑 JSON-LD 与可见面包屑使用一致的 canonical URL
- **GIVEN** 博客详情页使用相同文章数据
- **WHEN** 生成 BreadcrumbList JSON-LD 与可见面包屑 DOM
- **THEN** 两者使用相同的 `buildPostUrl(issue.number, issue.title)` 生成的文章链接
- **AND** 可见面包屑为 `<nav aria-label='文章面包屑'>` 结构

### Requirement: 主题页使用 canonical URL 并可被 sitemap 发现
- **GIVEN** 系统中的标签汇总信息
- **WHEN** 生成 `/topics/<encoded-label>` 页面
- **THEN** metadata 的 canonical 指向自身主题页 URL
- **AND** sitemap 包含每个公开标签的主题页条目
- **AND** 页面使用 `decodeTopicParam` 还原标签名并通过 Content API 按单标签获取文章

### Requirement: 主题 URL 编码与解码为单一入口
- **GIVEN** 任意标签名称（含特殊字符、空格或中文）
- **WHEN** 生成主题页链接或解析路由参数
- **THEN** `buildTopicUrl` 使用 `encodeURIComponent` 编码
- **AND** `decodeTopicParam` 使用 `decodeURIComponent` 还原
- **AND** 所有页面、sitemap 与链接指向同一 URL 工具，不重复实现编解码

### Requirement: 旧 labels 筛选页不可索引但保留抓取
- **GIVEN** `/blog?labels=<label>` 的旧筛选入口
- **WHEN** 搜索引擎抓取
- **THEN** metadata robots 为 `index: false, follow: true`
- **AND** 保留内容正常渲染，但不增加重复索引

### Requirement: 主题集合页面输出 CollectionPage 与 ItemList JSON-LD
- **GIVEN** 主题页有可见的文章列表
- **WHEN** 生成页面 JSON-LD
- **THEN** 输出 `CollectionPage` 类型结构化数据
- **AND** `ItemList` 使用 canonical 文章 URL 且 `position` 从 1 递增

### `tasks.md`
# SEO 内容发现与站内导航任务

> 本文件由历史实施计划迁移而来，仅记录制品对应的实施边界；代码已在原计划对应变更中完成，归档前以现有实现和测试结果为准。

## Phase 1：URL、metadata 与 sitemap 基础

- [x] 规范化文章 URL 并对非 canonical 路径永久重定向。  
  文件：`packages/wuh.site.next/app/lib/slug.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 为公开文章启用 ISR，移除 SEO 渲染的 Cookie 依赖。  
  文件：`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录
- [x] 分页生成 canonical sitemap，排除调试页并为调试页设置 noindex。  
  文件：`packages/wuh.site.next/app/sitemap.ts`、`packages/wuh.site.next/app/design/system-color/layout.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 补齐全局 metadata 默认值。  
  文件：`packages/wuh.site.next/app/layout.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录

## Phase 2：结构化数据

- [x] 建立 WebSite、Person、BlogPosting 与 BreadcrumbList builder。  
  文件：`packages/wuh.site.next/app/lib/structured-data.ts`、`packages/wuh.site.next/app/layout.tsx`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：2 小时；实际耗时：历史实施，未记录
- [x] 在文章页渲染可访问面包屑。  
  文件：`packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/styles/`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 为主题页输出 CollectionPage 与 ItemList。  
  文件：`packages/wuh.site.next/app/lib/structured-data.ts`、`packages/wuh.site.next/app/topics/[label]/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录

## Phase 3：内容发现与站内链接

- [x] 选择、去重和排序最多三篇相关文章。  
  文件：`packages/wuh.site.next/app/lib/related-posts.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 建立可索引主题页并统一标签链接。  
  文件：`packages/wuh.site.next/app/lib/topic-url.ts`、`packages/wuh.site.next/app/topics/[label]/page.tsx`、`packages/wuh.site.next/app/blog/BlogListView.tsx`、`packages/wuh.site.next/app/post/PostView.tsx`  
  预计耗时：2 小时；实际耗时：历史实施，未记录
- [x] 将主题页加入 sitemap，并将旧标签 query 页设为 noindex/follow。  
  文件：`packages/wuh.site.next/app/lib/sitemap.ts`、`packages/wuh.site.next/app/sitemap.ts`、`packages/wuh.site.next/app/blog/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 区分 Alert 站内与站外链接行为。  
  文件：`packages/components/alert/index.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录

## Phase 4：验证

- [x] 运行对应 SEO Node 测试、前端 lint、TypeScript 与 diff 检查。  
  文件：`packages/wuh.site.next/test/seo-*.test.mjs`、`packages/wuh.site.next/test/topic-url.test.mjs`、`packages/wuh.site.next/test/related-posts.test.mjs`  
  预计耗时：1 小时；实际耗时：历史实施，详见原提交记录
