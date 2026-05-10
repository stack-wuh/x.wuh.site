# sitemap 站点地图

## 为什么做

当前站点没有任何 sitemap.xml 或 robots.txt，Google 爬虫只能靠页面内链接发现内容，抓取效率低、遗漏风险高。需要为所有可索引页面生成标准化站点地图，提升 SEO 可见性。

## 做什么

- 创建 `app/sitemap.ts` — Next.js 15 内置 `MetadataRoute.Sitemap`，涵盖静态页面和动态博客详情页
- 创建 `app/robots.ts` — 指向 sitemap URL

## 覆盖范围

**静态页面**（4个）：
- `/` — 首页（priority: 1.0）
- `/blog` — 博客列表（priority: 0.8）
- `/about` — 关于页（priority: 0.5）
- `/design/system-color` — 配色演示（priority: 0.3）

**动态页面**（N个）：
- `/post/[number]` — 博客详情，通过 `api.content.getPosts()` 全量拉取，`updatedAtGitHub` 作为 `lastModified`

## 影响范围

- `packages/wuh.site.next/app/sitemap.ts` — 新增
- `packages/wuh.site.next/app/robots.ts` — 新增
- 无现有文件修改

## 不改什么

- 不包含博客分页页面（`/blog?page=2` 等），Google 不建议在 sitemap 中列出分页
- 不包含 API 路由（`/api/music/*`）
- 不改变现有 metadata 配置
