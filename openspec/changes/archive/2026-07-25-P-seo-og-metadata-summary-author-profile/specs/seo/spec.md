---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: SEO Batch C

## ADDED

### Requirement: 全站默认 Open Graph 图片
- **GIVEN** 任意页面生成 Open Graph metadata，或博客文章没有显式封面
- **WHEN** Next.js 生成页面 metadata
- **THEN** `openGraph.images` 至少包含一张可访问的 1200×630 默认图片
- **AND** 文章存在显式封面时优先使用显式封面

### Requirement: 文章 Twitter 图片回退
- **GIVEN** 博客文章没有显式封面
- **WHEN** Next.js 生成 Twitter Card metadata
- **THEN** `twitter.images` 使用全站默认 1200×630 图片
- **AND** `twitter.card` 保持适合大图展示的卡片类型

### Requirement: 文章作者关键词与分类 metadata
- **GIVEN** 博客文章包含作者、CMS keywords、文章标签或可推导的分类信息
- **WHEN** 生成文章 metadata
- **THEN** metadata 可表达 `authors`、`keywords` 和 `category`
- **AND** `keywords` 优先使用 CMS metadata keywords
- **AND** CMS keywords 缺失时回退到文章标签

### Requirement: 语义 Markdown 自动摘要
- **GIVEN** 博客文章没有 CMS `summary` 且正文包含 Markdown 内容
- **WHEN** 生成 description 或 BlogPosting 的 description
- **THEN** 使用 Markdown AST 提取首个有效段落
- **AND** 忽略代码块、标题和空白内容
- **AND** 摘要长度遵守现有 metadata 展示上限并保持可读文本

### Requirement: CMS 摘要优先
- **GIVEN** 博客文章存在非空 CMS `summary`
- **WHEN** 生成 description 或 BlogPosting 的 description
- **THEN** 直接使用 CMS `summary`
- **AND** 不使用自动 Markdown 摘要覆盖 CMS 内容

### Requirement: About 作者档案结构化数据
- **GIVEN** 用户或搜索引擎访问 `/about`
- **WHEN** 页面输出 JSON-LD
- **THEN** 包含 `ProfilePage` 类型的结构化数据
- **AND** `ProfilePage` 的 mainEntity 对应站点 Person 实体
- **AND** Person 实体与 `https://github.com/stack-wuh` 建立 `sameAs` 或等价对应关系
