---
title: Next.js 前端构建
domain: build
keywords: [Next.js, 导入路径, 路径别名, shared-contracts, 前端构建]
scope:
  - packages/wuh.site.next/tsconfig.json
  - packages/wuh.site.next
  - packages/components/package.json
status: active
source:
  - changes/archive/20260524-P-build_optimization/brief.md
  - changes/archive/20260607-P-ts_config_redesign/brief.md
verified: 2026-08-08
---

# Next.js 前端构建

## 当前结论

导入路径规范：所有 `@wuh.site/components/*/index` 统一为 `@wuh.site/components/*`。前端文件引用内部模块优先使用 `@/*` 路径别名（映射到 Next.js 项目根目录），避免深层相对路径。仅在引用同层或相邻子目录时使用 `./xxx` 相对路径。`@wuh.site/shared-contracts` 通过 tsconfig paths 正确解析到源码目录。

## 执行约束

- 组件导入不得带 `/index`；跨目录优先使用已配置别名，不能创建未在 tsconfig/exports 中声明的伪路径。

## 适用边界

同层和相邻子目录可使用相对导入。

## 验证方式

搜索 `@wuh.site/components/.+/index`，并对照 tsconfig paths 与 package exports 检查所有别名。

## 关联知识

- [build config](./build-config.md)
- [components](./components.md)
