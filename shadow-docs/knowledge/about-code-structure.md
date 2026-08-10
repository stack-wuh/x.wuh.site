---
title: About 页面代码拆分
domain: about
keywords: [代码拆分, About页, page.tsx, 文件职责, TypeScript, 行数约束]
scope:
  - packages/wuh.site.next/app/about
status: active
source:
  - changes/archive/2026-05-04-about-code-split/brief.md
verified: 2026-08-08
---

# About 页面代码拆分

## 当前结论

About 页面 `page.tsx` 控制在 80 行以内，每个文件职责单一。拆分后功能与拆分前完全一致，无回归，TypeScript 类型检查通过。新增文件应遵循单一职责原则，避免将多个无关逻辑放在同一文件中。

## 执行约束

- About 页面入口只负责组合；数据获取、展示区块和样式按职责拆分，禁止把已拆分逻辑重新堆回 `page.tsx`。

## 适用边界

仅约束 About 页面文件职责，不对其他 App Router 页面设置 80 行硬上限。

## 验证方式

检查 `packages/wuh.site.next/app/about/page.tsx` 及其直接组件依赖，确认入口不包含区块内部实现。

## 关联知识

- [about activity](./about-activity.md)
- [first load performance](./first-load-performance.md)
