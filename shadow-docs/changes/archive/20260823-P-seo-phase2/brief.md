# SEO Phase 2: 缓存策略与低价值页面清理

## 动机

Issue #233 中 P0 索引与规范化已全部完成（URL canonical 统一、301 重定向、sitemap 分页、robots、结构化数据等），但 P0 缓存策略和低价值页面处理仍有剩余项。

## 决策

### P0: 首页缓存策略

**现状**: `apps/site/app/page.tsx` 第 7 行 `export const dynamic = 'force-dynamic'`，首页每次都实时渲染，不利用缓存。

**问题**: 首页数据（最新 6 篇文章）获取本身已使用 `revalidate: 1800`，但 `force-dynamic` 导致整个页面不可缓存，CDN 和浏览器缓存均失效。

**方案**: 移除 `force-dynamic`，依赖数据请求层的 `revalidate: 1800` 控制缓存。首页无用户态依赖，无 Cookie 读取，适合 ISR。

### P0: 低价值页面索引控制

**`/design/system-color`**: 已有 layout metadata 设置 `robots: { index: false, follow: false }`，无需改动。

**`/weread`**: 个人读书书架数据，不具独立搜索价值，建议 `noindex, follow`。保留 follow 以允许爬虫通过链接发现其他页面。

**`/footprint`**: 纯客户端渲染（`"use client"`），地图 + 照片展示，无 SEO 价值。建议 `noindex, nofollow`。

**`/guestbook`**: 留言板，用户生成内容，页面本身无独立搜索价值。建议 `noindex, follow`。

### P1: 文章 wordCount

`structured-data.ts` 中 `createArticleStructuredData` 缺少 `wordCount` 字段。可在 `buildArticleDescription` 同级计算 `wordCount` 并传入 JSON-LD。

## 任务

- [x] 移除首页 `force-dynamic`，验证 ISR 行为
- [x] `/design/system-color` 添加 `noindex, nofollow` metadata（已有，无需改动）
- [x] `/weread` 添加 `noindex, follow` metadata
- [x] `/footprint` 添加 `noindex, nofollow` metadata
- [x] `/guestbook` 添加 `noindex, follow` metadata
- [x] 文章 JSON-LD 补充 `wordCount`
- [x] 验证所有页面 canonical、robots 策略正确

## 结果

7 个文件变更，19 行新增，2 行删除：

- `apps/site/app/page.tsx` — 移除 `export const dynamic = 'force-dynamic'`，首页改为依赖数据层 ISR（`revalidate: 1800`）
- `apps/site/app/footprint/layout.tsx` — 添加 `robots: { index: false, follow: false }`
- `apps/site/app/guestbook/page.tsx` — 添加 `robots: { index: false, follow: true }`
- `apps/site/app/weread/page.tsx` — 添加 `robots: { index: false, follow: true }`
- `apps/site/app/lib/seo.ts` — 新增 `getArticleWordCount()`，`buildBlogPostingJsonLd` 补充 `wordCount`
- `apps/site/app/lib/structured-data.ts` — `createArticleStructuredData` 接收并输出 `wordCount`
- `apps/site/app/post/[number]/page.tsx` — 传入 `wordCount` 到 `createArticleStructuredData`

`/design/system-color` 已有 layout metadata 设置 `noindex, nofollow`，无需改动。

TypeScript 类型检查：本次改动文件零新增错误。dev 启动正常。