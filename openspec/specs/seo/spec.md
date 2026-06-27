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
- **GIVEN** 博客详情页
- **WHEN** 搜索引擎索引
- **THEN** canonical URL 包含标题 slug，格式为 `https://wuh.site/post/<number>-<slug>`
- **AND** slug 来源于文章标题

### Requirement: 博客 URL 包含标题 slug
- **GIVEN** 首页或博客列表页展示博客文章列表
- **WHEN** 用户或搜索引擎抓取链接
- **THEN** 博客详情页链接格式为 `/post/<number>-<title-slug>`
- **AND** slug 中保留中文字符，URL 敏感字符（`#`、`?`、`&`、`/`、`\`）替换为 `-`
- **AND** 连续的 `-` 压缩为单个 `-`

### Requirement: 旧 URL 格式向后兼容
- **GIVEN** 存在历史链接 `/post/123`（无 slug）
- **WHEN** 用户访问该链接
- **THEN** 页面正常渲染，不 404
