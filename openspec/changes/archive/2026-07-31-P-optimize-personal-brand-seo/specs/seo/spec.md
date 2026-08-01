# Spec: 个人品牌 SEO

## ADDED

### Requirement: 可索引页面包含统一个人品牌姓名
- **GIVEN** 搜索引擎抓取任一可索引的站点级或列表级页面
- **WHEN** Next.js 生成页面 description
- **THEN** description 自然包含统一公开姓名“吴尒红（Shadow）”
- **AND** description 同时表达当前页面的具体主题，不使用与页面内容无关的关键词堆砌
- **AND** `robots` 为 `index: false, follow: false` 的内部调试页面不受此要求约束

### Requirement: 社交摘要保留个人品牌语义
- **GIVEN** 可索引页面定义 Open Graph 或 Twitter Card metadata
- **WHEN** 社交平台抓取页面摘要
- **THEN** `openGraph.description` 与 `twitter.description` 均包含“吴尒红（Shadow）”
- **AND** 两者与页面主 description 表达相同的页面主题和作者归属

### Requirement: 作者身份在 Metadata 与 JSON-LD 中一致
- **GIVEN** 根布局、About 页面或文章详情页输出作者相关 metadata 或 JSON-LD
- **WHEN** 搜索引擎解析 authors、creator、WebSite、Person、ProfilePage 或 BlogPosting
- **THEN** 作者公开姓名统一为“吴尒红（Shadow）”
- **AND** Person 实体通过稳定 `@id` 在 WebSite publisher、ProfilePage mainEntity、BlogPosting author 与 publisher 之间复用
- **AND** Person 的 `sameAs` 或作者 URL 关联 `https://github.com/stack-wuh`

### Requirement: 页面 description 保持主题差异化
- **GIVEN** 首页、About、博客、主题页、微信读书、足迹和留言板承担不同内容职责
- **WHEN** 为这些页面生成 description
- **THEN** 每个页面的 description 描述该页面实际内容
- **AND** 姓名关键词在单个 description 中自然出现，不进行重复堆砌

---

## MODIFIED

### Requirement: 根布局提供全局 Metadata 默认值
- **GIVEN** 任意页面通过 Next.js Metadata API 生成 metadata
- **WHEN** 根 layout 定义 metadata
- **THEN** 包含 `metadataBase`、`title.template` 和 `title.default`
- **AND** 全站默认 `description` 自然包含“吴尒红（Shadow）”及其技术创作者定位
- **AND** `authors` 与 `creator` 使用“吴尒红（Shadow）”，并关联公开 GitHub 身份
- **AND** 默认 Open Graph 与 Twitter description 采用相同个人品牌语义

### Requirement: WebSite 与 Person JSON-LD 根布局输出
- **GIVEN** 任意页面被爬虫抓取
- **WHEN** 根布局渲染
- **THEN** 输出包含 `WebSite` 与 `Person` 的 JSON-LD 图
- **AND** Person 的 name 为“吴尒红（Shadow）”
- **AND** Person 指向 `https://github.com/stack-wuh`
- **AND** WebSite publisher 引用同一个 Person `@id`

### Requirement: About 作者档案结构化数据
- **GIVEN** 用户或搜索引擎访问 `/about`
- **WHEN** 页面输出 JSON-LD
- **THEN** 包含 `ProfilePage` 类型的结构化数据
- **AND** `ProfilePage` 的 mainEntity 对应“吴尒红（Shadow）”Person 实体
- **AND** Person 实体与根布局使用相同 `@id`，并关联 `https://github.com/stack-wuh`

### Requirement: 文章差异化 description
- **GIVEN** 博客文章有 metadata.summary 或 body
- **WHEN** 生成页面 metadata
- **THEN** description 优先使用 summary，fallback 到正文首个有效段落
- **AND** 不在文章内容摘要中机械追加“吴尒红（Shadow）”
- **AND** 作者姓名通过 authors metadata 与 BlogPosting Person 实体表达

---

## REMOVED

无。
