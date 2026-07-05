# 修复构建后首页数据模块为空

## 背景

生产构建后，首页多个服务端数据模块显示为空。首页数据来自内容 API、仓库 API、微信读书 API，但这些请求在构建阶段失败后被转换为空数组，导致空数据被写入构建产物。

## 目标

- 首页不在 `next build` 阶段固化空数据。
- 服务端 API base 在生产环境默认指向 Docker 内部 Nest 服务。
- 首页数据请求失败时输出可诊断日志。

## 非目标（明确不做）

- 不改后端 API 业务逻辑。
- 不改首页视觉结构。
- 不引入新的缓存系统。

## 影响范围

- `packages/hooks/useFetch/createService.ts` — 修正生产环境 API base fallback。
- `packages/wuh.site.next/app/page.tsx` — 强制首页运行时动态渲染，并记录请求失败日志。
- `openspec/specs/build-config/spec.md` — 记录生产 API base fallback 规则。
- `openspec/specs/homepage-data/spec.md` — 记录首页运行时数据获取规则。
