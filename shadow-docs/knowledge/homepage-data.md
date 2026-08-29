---
title: 首页数据获取
domain: performance
keywords: [首页, 数据获取, 运行时请求, 生产构建, SSR, 日志, ISR]
scope:
  - apps/site/app/page.tsx
  - apps/site/app/HomeView
status: active
source:
  - changes/archive/2026-07-05-B-fix-homepage-build-empty-data/brief.md
  - changes/20260829-fix-homepage-empty-data/brief.md
verified: 2026-08-29
---

# 首页数据获取

## 当前结论

首页为 force-dynamic 动态渲染（`export const dynamic = 'force-dynamic'`），构建期不预渲染、不请求数据。结构性原因：Docker build 阶段容器内没有 nest 服务，预渲染时的 fetch 必然失败，失败的空数组会被烘焙进 ISR 初始缓存，导致每次部署后首页「精选博客」「年度总结」空数据约 30 分钟（s-maxage=1800）。首页数据请求发生在每次请求的 Server Component 渲染阶段，确保用户看到的是最新数据。

任一服务端数据请求失败时，服务端日志需包含失败模块名和错误信息，页面返回 fallback 空数组以保证可降级渲染。

## 执行约束

- 首页必须保持 force-dynamic；不得恢复构建期预渲染或 fetch 级 revalidate（构建环境无 nest 连接，任何预渲染都会烘焙空数据）。
- 首页不得把构建阶段 API 失败得到的空数组固化为生产结果；运行时请求失败必须记录模块并可降级渲染。

## 适用边界

不要求所有首页区块同时阻塞首屏，加载优先级由性能卡片约束。

## 验证方式

检查 page 的 dynamic/cache 设置和 service 错误日志；模拟单一服务失败确认其他区块仍渲染。

## 关联知识

- [first load performance](./first-load-performance.md)
- [repos api](./repos-api.md)
- [weread shelf order](./weread-shelf-order.md)
