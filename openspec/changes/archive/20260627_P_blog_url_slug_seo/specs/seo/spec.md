# SEO

## ADDED

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

## MODIFIED

### Requirement: canonical URL
- **GIVEN** 博客详情页
- **WHEN** 搜索引擎索引
- **THEN** canonical URL 包含标题 slug，格式为 `https://wuh.site/post/<number>-<slug>`
- **AND** slug 来源于文章标题
