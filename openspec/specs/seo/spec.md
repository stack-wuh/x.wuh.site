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
- **THEN** description 优先使用 summary，fallback 到正文首个有效段落
- **AND** 不在文章内容摘要中机械追加"吴尒红（Shadow）"
- **AND** 作者姓名通过 authors metadata 与 BlogPosting Person 实体表达

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
- **AND** `ProfilePage` 的 mainEntity 对应"吴尒红（Shadow）"Person 实体
- **AND** Person 实体与根布局使用相同 `@id`，并关联 `https://github.com/stack-wuh`

## ADDED (2026-08-01)

### Requirement: 可索引页面包含统一个人品牌姓名
- **GIVEN** 搜索引擎抓取任一可索引的站点级或列表级页面
- **WHEN** Next.js 生成页面 description
- **THEN** description 自然包含统一公开姓名"吴尒红（Shadow）"
- **AND** description 同时表达当前页面的具体主题，不使用与页面内容无关的关键词堆砌
- **AND** `robots` 为 `index: false, follow: false` 的内部调试页面不受此要求约束

### Requirement: 社交摘要保留个人品牌语义
- **GIVEN** 可索引页面定义 Open Graph 或 Twitter Card metadata
- **WHEN** 社交平台抓取页面摘要
- **THEN** `openGraph.description` 与 `twitter.description` 均包含"吴尒红（Shadow）"
- **AND** 两者与页面主 description 表达相同的页面主题和作者归属

### Requirement: 作者身份在 Metadata 与 JSON-LD 中一致
- **GIVEN** 根布局、About 页面或文章详情页输出作者相关 metadata 或 JSON-LD
- **WHEN** 搜索引擎解析 authors、creator、WebSite、Person、ProfilePage 或 BlogPosting
- **THEN** 作者公开姓名统一为"吴尒红（Shadow）"
- **AND** Person 实体通过稳定 `@id` 在 WebSite publisher、ProfilePage mainEntity、BlogPosting author 与 publisher 之间复用
- **AND** Person 的 `sameAs` 或作者 URL 关联 `https://github.com/stack-wuh`

### Requirement: 页面 description 保持主题差异化
- **GIVEN** 首页、About、博客、主题页、微信读书、足迹和留言板承担不同内容职责
- **WHEN** 为这些页面生成 description
- **THEN** 每个页面的 description 描述该页面实际内容
- **AND** 姓名关键词在单个 description 中自然出现，不进行重复堆砌

## ADDED (2026-07-26)

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
- **AND** 全站默认 `description` 自然包含"吴尒红（Shadow）"及其技术创作者定位
- **AND** `authors` 与 `creator` 使用"吴尒红（Shadow）"，并关联公开 GitHub 身份
- **AND** 默认 Open Graph 与 Twitter description 采用相同个人品牌语义

### Requirement: WebSite 与 Person JSON-LD 根布局输出
- **GIVEN** 任意页面被爬虫抓取
- **WHEN** 根布局渲染
- **THEN** 输出包含 `WebSite` 与 `Person` 的 JSON-LD 图
- **AND** Person name 为"吴尒红（Shadow）"
- **AND** Person 指向 `https://github.com/stack-wuh`
- **AND** WebSite publisher 引用同一 Person `@id`

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
