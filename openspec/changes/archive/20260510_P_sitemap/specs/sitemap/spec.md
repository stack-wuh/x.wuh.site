# Spec: sitemap

## ADDED

### Requirement: 站点地图生成

GIVEN 站点部署到 https://wuh.site
WHEN Googlebot 或其他爬虫请求 `/sitemap.xml`
THEN 返回包含所有可索引页面的标准 XML 站点地图
AND 每个 URL 条目包含 `lastModified`、`changeFrequency`、`priority`

### Requirement: robots.txt 引导

GIVEN 站点正常运行
WHEN 爬虫请求 `/robots.txt`
THEN 返回包含 `Sitemap: https://wuh.site/sitemap.xml` 的 robots 文件
AND `User-agent: *` 允许所有爬虫抓取全部路径

### Requirement: 静态页面索引

GIVEN sitemap.xml 生成
WHEN 检查 URL 列表
THEN 包含 `/`、`/blog`、`/about`、`/design/system-color` 四个静态页面
AND 各自带有合理的 `priority` 和 `changeFrequency`

### Requirement: 动态博客详情索引

GIVEN api.content.getPosts() 正常返回文章数据
WHEN sitemap.ts 执行
THEN 为每篇 `state: 'open'` 的文章生成 `/post/[number]` 条目
AND `lastModified` 使用 `updatedAtGitHub` 字段
