# 任务拆分

## Phase 1 — sitemap + robots 创建

- [ ] T1: 创建 `app/robots.ts`
  - 涉及文件: `packages/wuh.site.next/app/robots.ts`
  - 产出: `MetadataRoute.Robots` 配置，指向 sitemap URL

- [ ] T2: 创建 `app/sitemap.ts`
  - 涉及文件: `packages/wuh.site.next/app/sitemap.ts`
  - 产出: 静态页面 + 动态博客详情的 `MetadataRoute.Sitemap`

## Phase 2 — 验证

- [ ] T3: 验证 `/sitemap.xml` 和 `/robots.txt` 可正常访问
  - `next dev` 后 curl 验证 XML 格式和 robots 内容
