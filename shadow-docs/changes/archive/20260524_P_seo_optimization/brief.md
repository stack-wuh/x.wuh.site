# SEO 深度优化

> 原始变更名：`20260524_P_seo_optimization`

## 元数据
- 日期：2026-05-24
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前 SEO 仅有 sitemap 和基础 title，缺少 Open Graph、结构化数据、差异化 description。

## 引用规范
- `specs/seo/spec.md`

## 决策
# 技术方案

## OG / Twitter Card

在 `generateMetadata` 中加 `openGraph` 和 `twitter` 字段，Next.js 自动生成 `<meta>` 标签。

## 文章 description

优先用 metadata.summary，fallback 到 body 前 160 字符。

## JSON-LD

新建 `JsonLd` 组件，用 `<script type="application/ld+json">` 注入 BlogPosting schema。

## canonical

在 metadata 中加 `alternates.canonical` 字段。

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: seo-optimization
date: 2026-05-24
type: P
status: proposed
```

### `design.md`
# 技术方案

## OG / Twitter Card

在 `generateMetadata` 中加 `openGraph` 和 `twitter` 字段，Next.js 自动生成 `<meta>` 标签。

## 文章 description

优先用 metadata.summary，fallback 到 body 前 160 字符。

## JSON-LD

新建 `JsonLd` 组件，用 `<script type="application/ld+json">` 注入 BlogPosting schema。

## canonical

在 metadata 中加 `alternates.canonical` 字段。

### `proposal.md`
# SEO 深度优化

## 动机

当前 SEO 仅有 sitemap 和基础 title，缺少 Open Graph、结构化数据、差异化 description。

## 变更范围

- 全站 Open Graph + Twitter Card 标签
- 文章 description 使用摘要或正文前 160 字
- JSON-LD BlogPosting 结构化数据
- canonical URL

## 非目标

- 不修改路由结构
- 不引入第三方 SEO 库

### `specs/seo/spec.md`
# SEO

## ADDED

### Requirement: 全站 Open Graph 标签
- **GIVEN** 任意页面被社交平台抓取
- **WHEN** 爬虫读取 HTML
- **THEN** 包含 `og:title`、`og:description`、`og:image`、`og:url`、`og:type` 标签

### Requirement: Twitter Card 标签
- **GIVEN** 页面链接被分享到 Twitter
- **WHEN** Twitter 爬虫抓取
- **THEN** 包含 `twitter:card`、`twitter:title`、`twitter:description`、`twitter:image` 标签

### Requirement: 文章差异化 description
- **GIVEN** 博客文章有 metadata.summary 或 body
- **WHEN** 生成页面 metadata
- **THEN** description 优先使用 summary，fallback 到正文前 160 字

### Requirement: JSON-LD BlogPosting 结构化数据
- **GIVEN** 博客详情页
- **WHEN** 搜索引擎爬取
- **THEN** 包含 `application/ld+json` 的 BlogPosting schema

### Requirement: canonical URL
- **GIVEN** 任意页面
- **WHEN** 搜索引擎索引
- **THEN** 包含 canonical URL 指向自身

### `tasks.md`
# 实施任务

| # | 任务 | Phase | 涉及文件 |
|---|------|-------|----------|
| 1 | 文章详情 OG + Twitter + description | 1 | `post/[number]/page.tsx` |
| 2 | 博客列表 OG + Twitter + description | 1 | `blog/page.tsx` |
| 3 | 首页 OG + Twitter | 1 | `page.tsx` |
| 4 | 关于页 OG | 1 | `about/page.tsx` |
| 5 | JsonLd 结构化数据组件 | 2 | 新建 `components/JsonLd.tsx` |
| 6 | 文章详情 BlogPosting schema | 2 | `post/[number]/page.tsx` |
| 7 | canonical URL（所有页面） | 3 | 4 个 page.tsx |
