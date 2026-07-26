# SEO 内容发现与站内导航任务

> 本文件由历史实施计划迁移而来，仅记录制品对应的实施边界；代码已在原计划对应变更中完成，归档前以现有实现和测试结果为准。

## Phase 1：URL、metadata 与 sitemap 基础

- [x] 规范化文章 URL 并对非 canonical 路径永久重定向。  
  文件：`packages/wuh.site.next/app/lib/slug.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 为公开文章启用 ISR，移除 SEO 渲染的 Cookie 依赖。  
  文件：`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录
- [x] 分页生成 canonical sitemap，排除调试页并为调试页设置 noindex。  
  文件：`packages/wuh.site.next/app/sitemap.ts`、`packages/wuh.site.next/app/design/system-color/layout.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 补齐全局 metadata 默认值。  
  文件：`packages/wuh.site.next/app/layout.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录

## Phase 2：结构化数据

- [x] 建立 WebSite、Person、BlogPosting 与 BreadcrumbList builder。  
  文件：`packages/wuh.site.next/app/lib/structured-data.ts`、`packages/wuh.site.next/app/layout.tsx`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：2 小时；实际耗时：历史实施，未记录
- [x] 在文章页渲染可访问面包屑。  
  文件：`packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/styles/`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 为主题页和归档页输出 CollectionPage 与 ItemList。  
  文件：`packages/wuh.site.next/app/lib/structured-data.ts`、`packages/wuh.site.next/app/topics/[label]/page.tsx`、`packages/wuh.site.next/app/archive/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录

## Phase 3：内容发现与站内链接

- [x] 选择、去重和排序最多三篇相关文章。  
  文件：`packages/wuh.site.next/app/lib/related-posts.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 建立可索引主题页并统一标签链接。  
  文件：`packages/wuh.site.next/app/lib/topic-url.ts`、`packages/wuh.site.next/app/topics/[label]/page.tsx`、`packages/wuh.site.next/app/blog/BlogListView.tsx`、`packages/wuh.site.next/app/post/PostView.tsx`  
  预计耗时：2 小时；实际耗时：历史实施，未记录
- [x] 将主题页加入 sitemap，并将旧标签 query 页设为 noindex/follow。  
  文件：`packages/wuh.site.next/app/lib/sitemap.ts`、`packages/wuh.site.next/app/sitemap.ts`、`packages/wuh.site.next/app/blog/page.tsx`  
  预计耗时：1 小时；实际耗时：历史实施，未记录
- [x] 建立年份归档页、sitemap 条目和博客入口。  
  文件：`packages/wuh.site.next/app/archive/page.tsx`、`packages/wuh.site.next/app/lib/sitemap.ts`、`packages/wuh.site.next/app/blog/BlogListView.tsx`  
  预计耗时：2 小时；实际耗时：历史实施，未记录
- [x] 区分 Alert 站内与站外链接行为。  
  文件：`packages/components/alert/index.tsx`  
  预计耗时：30 分钟；实际耗时：历史实施，未记录

## Phase 4：验证

- [x] 运行对应 SEO Node 测试、前端 lint、TypeScript 与 diff 检查。  
  文件：`packages/wuh.site.next/test/seo-*.test.mjs`、`packages/wuh.site.next/test/topic-url.test.mjs`、`packages/wuh.site.next/test/related-posts.test.mjs`  
  预计耗时：1 小时；实际耗时：历史实施，详见原提交记录
