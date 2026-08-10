---
title: 首页数据获取
domain: performance
keywords: [首页, 数据获取, 运行时请求, 生产构建, SSR, 日志, ISR]
scope:
  - packages/wuh.site.next/app/page.tsx
  - packages/wuh.site.next/app/HomeView.tsx
  - packages/wuh.site.next/app/services
status: active
source:
  - changes/archive/20260705-B-fix-homepage-build-empty-data/brief.md
verified: 2026-08-08
---

# 首页数据获取

## 当前结论

首页在运行时请求内容、仓库和微信读书数据，不使用构建阶段 API 失败产生的空数组作为最终页面数据。这意味着数据请求发生在 Server Component 渲染阶段而非构建阶段，确保用户看到的是最新数据。

任一服务端数据请求失败时，服务端日志需包含失败模块名和错误信息，页面返回 fallback 空数组以保证可降级渲染。

## 执行约束

- 首页不得把构建阶段 API 失败得到的空数组固化为生产结果；运行时请求失败必须记录模块并可降级渲染。

## 适用边界

不要求所有首页区块同时阻塞首屏，加载优先级由性能卡片约束。

## 验证方式

检查 page 的 dynamic/cache 设置和 service 错误日志；模拟单一服务失败确认其他区块仍渲染。

## 关联知识

- [first load performance](./first-load-performance.md)
- [repos api](./repos-api.md)
- [weread shelf order](./weread-shelf-order.md)
