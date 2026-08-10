---
title: 错误页面设计
domain: frontend
keywords: [404, 500, 错误页面, editorial, 错误状态, 重试]
scope:
  - packages/wuh.site.next/app/error.tsx
  - packages/wuh.site.next/app/not-found.tsx
  - packages/wuh.site.next/app/post/[number]/error.tsx
status: active
source:
  - changes/archive/20260510_P_redesign-error-pages/brief.md
verified: 2026-08-08
---

# 错误页面设计

## 当前结论

404 和 500 页面采用 editorial 风格：大号数字作为视觉焦点（primary-color 点缀）、标题+描述分层、无边卡无阴影融入整体氛围。不依赖 Result 组件。

500 页面提供 reset() 重试按钮。post/[number] 下的 500 使用博客相关文案。错误页面不覆盖 body 全局样式，信任根 layout。

## 执行约束

- 错误页保持 editorial 无卡片视觉；500 必须提供 reset，路由级错误文案应匹配业务上下文，禁止覆盖全局 body。

## 适用边界

不约束 API JSON 错误响应。

## 验证方式

检查三个错误页面是否复用主题变量、500 reset 绑定和无全局 body 样式。

## 关联知识

- [design system](./design-system.md)
- [api standardization](./api-standardization.md)
