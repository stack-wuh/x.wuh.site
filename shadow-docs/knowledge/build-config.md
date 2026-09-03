---
title: 构建与部署配置
domain: build
keywords: [构建配置, Docker, NestJS, MongoDB, dotenv, 部署, Console, nginx, 健康检查, CI, release, 触发]
scope:
  - Dockerfile
  - docker-compose.yml
  - .github/workflows
  - packages/wuh.site.nest/src/main.ts
status: active
source:
  - changes/archive/20260504_P_docker-deployment/brief.md
  - changes/archive/20260607_P_rolling_deploy/brief.md
  - changes/archive/20260524_P_build_optimization/brief.md
  - changes/archive/20260822-build-release-trigger-deploy/brief.md
  - changes/archive/20260822-build-release-script/brief.md
  - changes/archive/20260823-feature-upgrade-next-16/brief.md
verified: 2026-08-23
---

# 构建与部署配置

## 当前结论

NestJS 通过 dotenv 自动加载项目根目录 `.env` 文件。MongooseModule 使用 `forRootAsync` + `useFactory` 从 ConfigService 获取 URI。`/health` 端点返回 MongoDB 连接状态（200 正常 / 503 异常）。sync 仅同步 `state: 'open'` 的 issues。

生产环境 Next.js Server Component 请求 Nest API 的默认 base 为 `http://nest:3200/v2`（Docker 内部服务名）。

Docker 多阶段构建：deps、builder、runner。Console 使用 `nginx:alpine` 运行 Vite 构建产物，支持 SPA 路由 fallback（`try_files $uri $uri/ /index.html`）。端口规划：生产 next:3000、nest:3200、console:3300；staging 对应 3001、3201、3301。部署脚本提供 build、staging health、switch、diagnose、cancel 和 rollback 能力。

CI 触发策略：push 到 main 只运行 quality-gate（typecheck + lint）；GitHub Release 发布（`release: types: [published]`）才触发完整部署链（prepare → build → staging-test → switch-traffic）。concurrency 按事件分组：push main 用 `ci-quality`，release 用 `ci-deploy-<ref>`，互不取消。

发布流程：`pnpm release`（即 `bash scripts/release.sh [major|minor|patch]`，默认 patch）一键完成 版本提升（standard-version + CHANGELOG + tag）→ push main → `gh release create`（触发部署链）。发布前置校验：工作区干净、分支为 main、不落后于 origin/main。

Next.js 16 起 `next build` 默认使用 Turbopack（原 webpack），构建产物工具链变化，Docker 构建需在 CI 验证。本机 `pnpm build:next`（脚本内置 `NODE_OPTIONS=--max-old-space-size=2048`）在高 swap 压力下会 SIGSEGV，去掉上限直跑 `apps/site/node_modules/.bin/next build` 稳定；CI/Docker 环境不受影响。

类型检查按 workspace 分治：仓库根的 `pnpm exec tsc --noEmit` 使用根 `tsconfig.json`（include 仅 `packages/*/src`，面向 console），**不覆盖 `apps/site`**——检查站点必须用 `cd apps/site && pnpm exec tsc --noEmit`（或 `pnpm --filter @wuh.site/site exec tsc`）。2026-09 曾因根命令验证空转，导致合并引入的 `SharedLinkGroup is not defined`（TS2304）漏检直达生产；site 尚有约 43 个存量类型错误（FontPrefetch/GlobalAudioPlayer/TypewriterMotto 等），清理前 tsc 通过只能说明"未引入新错误"，需配合 grep 目标文件确认。

## 执行约束

- 构建和部署必须保持 workspace 路径、健康检查、运行端口与环境变量一致；Docker COPY 必须保留 `packages/` 层级。

## 适用边界

不约束本地页面功能实现。

## 验证方式

检查 Dockerfile、compose、CI workflow 和 `/health`；构建命令需在实际部署环境单独验证。

## 关联知识

- [next](./next.md)
- [admin console](./admin-console.md)
