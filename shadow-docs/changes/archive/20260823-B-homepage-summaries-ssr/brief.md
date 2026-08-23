# 年度总结数据从客户端请求改为 SSR

## 动机

`HomeView` 是 `'use client'` 组件，通过 `contentService.getPosts.use({ query: { limit: '50', state: 'open' } })` 从客户端请求 `/api/content/posts?limit=50&state=open` 来筛选"年度总结"文章。这个请求不应暴露为客户端 API 调用，改为服务端 SSR 获取。

## 决策

把年度总结数据获取从 `HomeView` 移到 `page.tsx` 服务端，通过 `yearlySummaries` prop 传入。

`page.tsx` 已有 `yearlySummaries` prop 但传的是空数组 `[]`。在服务端新增 `getYearlySummaries()` 函数，复用现有 `getFeaturedIssues` 的模式，通过 `contentService.getPosts.server` 获取文章后过滤"年度总结"标题。

`HomeView` 中移除 `summariesData` 的 `.use()` 调用，直接使用 `yearlySummaries` prop。

## 受影响文件

- `apps/site/app/page.tsx` — 新增 `getYearlySummaries` 服务端函数
- `apps/site/app/HomeView/index.tsx` — 移除 `.use()` 客户端请求，用 prop 替代

## 任务

- [x] `page.tsx` 新增 `getYearlySummaries` 服务端获取
- [x] `HomeView` 移除 `contentService.getPosts.use` 调用
- [x] 验证首页"年度总结"区块正常渲染

## 结果

2 个文件变更：

- `apps/site/app/page.tsx` — 新增 `getYearlySummaries()`，服务端通过 `contentService.getPosts.server` 获取数据，随首页 SSR/ISR 输出
- `apps/site/app/HomeView/index.tsx` — 移除 `contentService.getPosts.use({ query: { limit: '50', state: 'open' } })` 客户端请求，改用 `yearlySummaries` prop

验证：dev 启动正常；`node apps/site/test/image-role-migration.test.mjs` 10/10 通过。