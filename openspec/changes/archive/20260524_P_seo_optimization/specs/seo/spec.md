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
