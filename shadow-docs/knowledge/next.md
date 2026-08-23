---
title: Next.js 前端构建
domain: build
keywords: [Next.js, Next.js 16, Turbopack, proxy, 导入路径, 路径别名, core, 前端构建]
scope:
  - apps/site/tsconfig.json
  - apps/site
  - packages/components/package.json
status: active
source:
  - changes/archive/20260524_P_build_optimization/brief.md
  - changes/archive/20260607_P_ts_config_redesign/brief.md
  - changes/archive/20260823-feature-upgrade-next-16/brief.md
verified: 2026-08-23
---

# Next.js 前端构建

## 当前结论

Next.js 16.3.2（App Router，Turbopack 默认用于 `next dev` 与 `next build`）。请求拦截使用 `proxy.ts`（Next 16 官方约定，替代已废弃的 `middleware.ts`，nodejs 运行时）。

导入路径规范：所有 `@wuh.site/components/*/index` 统一为 `@wuh.site/components/*`。前端文件引用内部模块优先使用 `@/*` 路径别名（映射到 Next.js 项目根目录），避免深层相对路径。仅在引用同层或相邻子目录时使用 `./xxx` 相对路径。`@wuh.site/core` 通过 tsconfig paths 解析。

## 执行约束

- 组件导入不得带 `/index`；跨目录优先使用已配置别名，不能创建未在 tsconfig/exports 中声明的伪路径。

## 适用边界

同层和相邻子目录可使用相对导入。

## 验证方式

搜索 `@wuh.site/components/.+/index`，并对照 tsconfig paths 与 package exports 检查所有别名。

## 关联知识

- [build config](./build-config.md)
- [components](./components.md)
