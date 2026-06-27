# RSS

## MODIFIED

### Requirement: RSS feed URL 格式
- **GIVEN** 博客详情页链接格式为 `/post/<number>-<title-slug>`
- **WHEN** 生成 RSS feed
- **THEN** item link 格式为 `https://wuh.site/post/<number>-<title-slug>`
- **AND** 不再使用 `/posts/<slug>` 旧格式

### Requirement: RSS 仅输出已发布内容
- **GIVEN** 数据库中存在 open 和 closed 的 Issue
- **WHEN** 生成 RSS feed
- **THEN** 仅查询 `state: 'open'` 的内容

## ADDED

### Requirement: 前端 RSS 自动发现
- **GIVEN** 任意页面
- **WHEN** 浏览器或 RSS 阅读器访问
- **THEN** `<head>` 包含 `<link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/v2/rss.xml">`
- **AND** 页脚有 RSS 订阅入口链接
