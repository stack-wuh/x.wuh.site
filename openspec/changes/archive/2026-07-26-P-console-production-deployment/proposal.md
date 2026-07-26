# Console 项目生产部署

## 背景

独立后台 Console、GitHub OAuth、root/reader 权限与后台 API 已由 `2026-07-19-P-admin-console` 实现并归档，但生产环境尚未定义 Console 的独立静态容器、`console.wuh.site` 入口、同源 `/v2/*` 代理、OAuth/Cookie 环境变量和发布回滚流程。

项目现有 GitHub Actions、Docker Compose 和 `scripts/deploy-docker.sh` 已支持 Next/Nest 镜像构建、staging 健康检查与生产切流。Console 应接入该链路，避免建设第二套部署系统。

本提案由原 `docs/superpowers/specs/2026-07-25-console-deployment-design.md` 迁移而来，并以已归档的 Admin Console 需求作为前置依赖。

## 目标

- 通过 `https://console.wuh.site` 独立访问 Console SPA。
- 将 Vite 构建产物发布为 Nginx 静态容器，生产绑定 `127.0.0.1:3300`。
- 外层 Nginx 为 Console 提供 HTTPS、SPA 路由和同源 `/v2/*` Nest API 代理。
- 配置生产 GitHub OAuth callback、HttpOnly Cookie、Console URL 和允许源。
- 将 Console 镜像纳入现有 CI/CD、staging、健康检查、切流、诊断与回滚流程。
- 首次上线时 Console 与 NestJS 同步发布；后续纯静态变更允许独立发布。
- 明确 DNS、证书、服务器环境变量与首次上线验收清单。

## 非目标（明确不做）

- 不迁移到 Vercel、Cloudflare Pages 等托管平台。
- 不将 Console 合并进主站 `/admin` 路由。
- 不重新实现 Console 业务、OAuth、root/reader 权限或后台 API。
- 不在首次上线引入完整蓝绿零停机发布。
- 不向 Console 前端注入 OAuth secret、JWT secret、MongoDB URI 或 GitHub token。
- 不改变公开主站域名与现有 Next/Nest 对外行为。

## 影响范围

- `Dockerfile` — 新增 Console deps、builder 和 Nginx runner target。
- `docker-compose*.yml` — 新增 Console 生产/预发布服务与 3300/3301 端口。
- `packages/wuh.site.console/` — 生产 API base、构建脚本和容器内 SPA fallback 配置。
- `.github/workflows/` — 增加 Console quality gate、镜像构建和发布依赖。
- `scripts/deploy-docker.sh` — 增加 Console build、staging health、switch、diagnose、cancel 和 rollback。
- 服务器 Nginx/DNS/TLS — 新增 `console.wuh.site` 和 `/v2/*` 原路径代理。
- `packages/wuh.site.nest/` 环境配置 — OAuth callback、Console URL、Cookie 和 CORS 生产配置。
- 影响包：`@wuh.site/console`、`@wuh.site/nest`；主站部署配置仅增加健康检查协同。
