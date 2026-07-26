# Console 生产部署任务

> 任务基于 `docs/superpowers/specs/2026-07-25-console-deployment-design.md` 提取，优先级由首次上线顺序与可独立验证程度决定。

## Phase 1：CI 与镜像准备

- [ ] 在 `Dockerfile` 中增加 Console deps、builder 与 runner-console 阶段。
  文件：`Dockerfile`  
  预计耗时：1.5 小时；实际耗时：待记录
- [ ] 在 `docker-compose.yml` 与 `docker-compose.staging.yml` 中增加 console 服务（3300/3301）。
  文件：`docker-compose.yml`、`docker-compose.staging.yml`  
  预计耗时：1 小时；实际耗时：待记录
- [ ] 在 `.github/workflows/` 增加 Console quality gate（`pnpm run build:console`）与镜像构建/推送步骤。
  文件：`.github/workflows/deploy.yml`  
  预计耗时：1 小时；实际耗时：待记录

## Phase 2：部署脚本

- [ ] 在 `scripts/deploy-docker.sh` 增加 `build-console` 命令。
- [ ] 在 staging 阶段增加 `127.0.0.1:3301` 健康检查。
- [ ] 在 `diagnose` 中检查 Console 容器状态。
- [ ] 在 `cancel` 中清理 staging Console 容器。
- [ ] 在 `switch-traffic` 中启动生产 Console 容器。
  文件：`scripts/deploy-docker.sh`  
  预计耗时：2 小时；实际耗时：待记录

## Phase 3：Console 容器内配置

- [ ] 容器内 Nginx 配置 SPA fallback（`try_files $uri $uri/ /index.html`）。
- [ ] `index.html` 不长期缓存；带 hash 的 JS/CSS/字体使用长期缓存。
- [ ] 生产 `VITE_API_BASE_URL=/v2` 构建时注入；本地开发通过 `.env.local` 覆盖为 `http://localhost:3200/v2`。
  文件：`packages/wuh.site.console/`、Console Dockerfile  
  预计耗时：1 小时；实际耗时：待记录

## Phase 4：外部 Nginx、DNS 与 TLS

- [ ] 配置 `console.wuh.site` DNS A 记录。
- [ ] 新增 Nginx server block：HTTP → HTTPS 重定向、TLS 终止、`/` → `127.0.0.1:3300`、`/v2/` → `127.0.0.1:3200`。
- [ ] 传递 `Host`、`X-Real-IP`、`X-Forwarded-For`、`X-Forwarded-Proto`。
- [ ] `/v2/` 使用不带路径追加的 `proxy_pass`，保留原始请求路径。
  文件：服务器 Nginx 配置、DNS 记录、TLS 证书  
  预计耗时：1.5 小时；实际耗时：待记录

## Phase 5：生产环境变量与 OAuth

- [ ] 配置生产 GitHub OAuth App（Homepage URL、callback URL 指向 `console.wuh.site`）。
- [ ] 配置 NestJS 生产环境变量（`GITHUB_OAUTH_*`、`CONSOLE_URL`、`JWT_SECRET`、`CORS_ORIGIN` 包含 console.wuh.site）。
- [ ] 确认 Console 前端仅注入 `VITE_API_BASE_URL`，无 secret 泄漏。
  文件：`.env`（服务器端）、GitHub OAuth App 设置  
  预计耗时：1 小时；实际耗时：待记录

## Phase 6：首次上线与验收

- [ ] 合并 Console 与 NestJS 变更到 `main`。
- [ ] 构建 Next、Nest、Console 三个镜像并推送。
- [ ] 在服务器上启动 staging 三服务并通过健康检查。
- [ ] 切换生产流量。
- [ ] 验证 `console.wuh.site/` 返回登录页，SPA 路由刷新不 404，无 mixed content。
- [ ] 验证 OAuth 登录、HttpOnly Secure Cookie、`/v2/auth/me`、root/reader 权限与登出。
  预计耗时：2 小时；实际耗时：待记录
