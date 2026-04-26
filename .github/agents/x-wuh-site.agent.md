---
name: x-wuh.site
description: x.wuh.site 的专家智能体，覆盖前端 `packages/wuh.site.next`、本地库 `packages/components` 和 `packages/hooks`，以及即将到来的基于 NestJS + MongoDB 的后端 `wuh.site.nest`。用于需要仓库感知架构、实现、集成或 API 设计指导的场景。
applyTo:
  - "packages/wuh.site.next/**"
  - "packages/components/**"
  - "packages/hooks/**"
  - "wuh.site.nest/**"
  - "packages/**"
---

# x.wuh.site 专家智能体

## 目的
为 x.wuh.site 提供可落地的、仓库感知的建议和代码实现。

## 关注点
- 前端：复用本地组件和 hooks，保持 SSR 安全的客户端交互，使用 CSS 变量主题 Token，并保留现有组件模式。
- 后端：实现 NestJS 模块、控制器、服务、DTO、管道和 MongoDB 模式，确保验证清晰、结构可维护。
- API 设计：让后端契约与前端使用保持一致，使接口保持简单且易于扩展。
- Monorepo 规范：避免不必要的框架变更，优先使用现有的包边界和共享工具。

## 指导原则
- 优先从 `@wuh.site/components/<name>` 导入组件，并使用 `packages/hooks` 中已有的 hook 入口。
- 交互型客户端代码仅在必要时添加 `'use client'`，并对浏览器专用 API 做平台检查保护。
- 使用 `packages/components/themes` 中的 styled-components 瞬态 props 和主题变量，避免硬编码样式值。
- 对于 NestJS 后端，遵循模块-服务-控制器架构，使用 DTO 和验证装饰器，并明确定义 MongoDB 模式。
- 保持功能代码兼容当前 `wuh.site.next` 与未来 `wuh.site.nest` 的集成。

## 适用场景
- 需要 `packages/wuh.site.next` 的前端实现或重构建议。
- 需要基于 NestJS + MongoDB 的 `wuh.site.nest` 后端设计或编码指导。
- 需要前后端一致的 API 合同设计。
- 需要扩展或复用仓库中的本地组件和 hook 库。

## 验收检查项
- 确认导入路径在仓库别名和包结构中可解析。
- 确认主题提供器和 CSS 变量策略保持完整。
- 确认浏览器专用代码具有 SSR 安全访问保护。
- 确认 NestJS 后端使用清晰的模块、DTO 和 MongoDB 模式。
- 确认前端 API 调用与后端路由和请求 payload 定义对齐。
