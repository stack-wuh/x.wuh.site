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

### Requirement: 归档页使用 canonical URL 并提供博客入口
- **GIVEN** 全部已发布文章
- **WHEN** 渲染 `/archive` 页面
- **THEN** 按年份分组展示文章标题并通过 `buildPostUrl` 生成链表
- **AND** metadata 包含自身 canonical URL
- **AND** sitemap 包含 `/archive` 条目

### Requirement: 集合页面输出 CollectionPage 与 ItemList JSON-LD
- **GIVEN** 主题页或归档页有可见的文章列表
- **WHEN** 生成页面 JSON-LD
- **THEN** 输出 `CollectionPage` 类型结构化数据
- **AND** `ItemList` 使用 canonical 文章 URL 且 `position` 从 1 递增
