# Console 项目生产部署

> 原始变更名：`2026-07-26-P-console-production-deployment`

## 元数据
- 日期：2026-07-26
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
独立后台 Console、GitHub OAuth、root/reader 权限与后台 API 已由 `2026-07-19-P-admin-console` 实现并归档，但生产环境尚未定义 Console 的独立静态容器、`console.wuh.site` 入口、同源 `/v2/*` 代理、OAuth/Cookie 环境变量和发布回滚流程。

项目现有 GitHub Actions、Docker Compose 和 `scripts/deploy-docker.sh` 已支持 Next/Nest 镜像构建、staging 健康检查与生产切流。Console 应接入该链路，避免建设第二套部署系统。

本提案由原 `docs/superpowers/specs/2026-07-25-console-deployment-design.md` 迁移而来，并以已归档的 Admin Console 需求作为前置依赖。

## 引用规范
- `specs/admin-console/spec.md`
- `specs/build-config/spec.md`

## 决策
```text
浏览器
  │
  │ HTTPS
  ▼
Nginx:443 (console.wuh.site)
  │
  ├── /       ──► 127.0.0.1:3300 ──► Console 静态资源容器
  │
  └── /v2/*   ──► 127.0.0.1:3200 ──► NestJS API 容器
```

Docker Compose 服务规划：

| 服务 | 容器端口 | 主机绑定 | 说明 |
|---|---:|---:|---|
| `next` | 3000 | `127.0.0.1:3000` | 现有主站 |
| `nest` | 3200 | `127.0.0.1:3200` | 认证与 API |
| `console` | 80 | `127.0.0.1:3300` | Vite 构建后的静态资源 |

NestJS 和 Console 不直接暴露公网，公网入口统一由 Nginx 提供。主站现有 Nginx 配置保持不变，仅新增 `console.wuh.site` 的 server block。

| 维度 | 选择 | 理由 |
|------|------|------|
| Console 静态容器 | Nginx Alpine + Vite dist | 无需 Node.js 进程，复用仓库现有 Nginx 部署经验 |
| API 前端地址 | `VITE_API_BASE_URL=/v2`（构建时注入） | 同源避免跨域；Vite 环境变量构建时固定，不依赖容器运行时 |
| OAuth 流程 | NestJS GitHub OAuth + HttpOnly Cookie | 与已归档 admin-console 相同的认证链路 |
| 容器编排 | Docker Compose（新增 console service） | 复用现有 Next/Nest 的 Compose 文件 |
| CI/CD | GitHub Actions + `deploy-docker.sh` 扩展 | 不引入第二套发布系统 |
| staging 端口 | console:3301 / nest:3201 / next:3001 | 三套 staging 保持隔离，正式域名仅在 cutover 后指向生产容器 |

## 任务
### Phase 1：CI 与镜像准备
- [ ] 在 `Dockerfile` 中增加 Console deps、builder 与 runner-console 阶段。
- [ ] 在 `docker-compose.yml` 与 `docker-compose.staging.yml` 中增加 console 服务（3300/3301）。
- [ ] 在 `.github/workflows/` 增加 Console quality gate（`pnpm run build:console`）与镜像构建/推送步骤。
### Phase 2：部署脚本
- [ ] 在 `scripts/deploy-docker.sh` 增加 `build-console` 命令。
- [ ] 在 staging 阶段增加 `127.0.0.1:3301` 健康检查。
- [ ] 在 `diagnose` 中检查 Console 容器状态。
- [ ] 在 `cancel` 中清理 staging Console 容器。
- [ ] 在 `switch-traffic` 中启动生产 Console 容器。
### Phase 3：Console 容器内配置
- [ ] 容器内 Nginx 配置 SPA fallback（`try_files $uri $uri/ /index.html`）。
- [ ] `index.html` 不长期缓存；带 hash 的 JS/CSS/字体使用长期缓存。
- [ ] 生产 `VITE_API_BASE_URL=/v2` 构建时注入；本地开发通过 `.env.local` 覆盖为 `http://localhost:3200/v2`。
### Phase 4：外部 Nginx、DNS 与 TLS
- [ ] 配置 `console.wuh.site` DNS A 记录。
- [ ] 新增 Nginx server block：HTTP → HTTPS 重定向、TLS 终止、`/` → `127.0.0.1:3300`、`/v2/` → `127.0.0.1:3200`。
- [ ] 传递 `Host`、`X-Real-IP`、`X-Forwarded-For`、`X-Forwarded-Proto`。
- [ ] `/v2/` 使用不带路径追加的 `proxy_pass`，保留原始请求路径。
### Phase 5：生产环境变量与 OAuth
- [ ] 配置生产 GitHub OAuth App（Homepage URL、callback URL 指向 `console.wuh.site`）。
- [ ] 配置 NestJS 生产环境变量（`GITHUB_OAUTH_*`、`CONSOLE_URL`、`JWT_SECRET`、`CORS_ORIGIN` 包含 console.wuh.site）。
- [ ] 确认 Console 前端仅注入 `VITE_API_BASE_URL`，无 secret 泄漏。
### Phase 6：首次上线与验收
- [ ] 合并 Console 与 NestJS 变更到 `main`。
- [ ] 构建 Next、Nest、Console 三个镜像并推送。
- [ ] 在服务器上启动 staging 三服务并通过健康检查。
- [ ] 切换生产流量。
- [ ] 验证 `console.wuh.site/` 返回登录页，SPA 路由刷新不 404，无 mixed content。
- [ ] 验证 OAuth 登录、HttpOnly Secure Cookie、`/v2/auth/me`、root/reader 权限与登出。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: console-production-deployment
date: 2026-07-26
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/227
```

### `design.md`
# Console 生产部署设计

## 架构

```text
浏览器
  │
  │ HTTPS
  ▼
Nginx:443 (console.wuh.site)
  │
  ├── /       ──► 127.0.0.1:3300 ──► Console 静态资源容器
  │
  └── /v2/*   ──► 127.0.0.1:3200 ──► NestJS API 容器
```

Docker Compose 服务规划：

| 服务 | 容器端口 | 主机绑定 | 说明 |
|---|---:|---:|---|
| `next` | 3000 | `127.0.0.1:3000` | 现有主站 |
| `nest` | 3200 | `127.0.0.1:3200` | 认证与 API |
| `console` | 80 | `127.0.0.1:3300` | Vite 构建后的静态资源 |

NestJS 和 Console 不直接暴露公网，公网入口统一由 Nginx 提供。主站现有 Nginx 配置保持不变，仅新增 `console.wuh.site` 的 server block。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Console 静态容器 | Nginx Alpine + Vite dist | 无需 Node.js 进程，复用仓库现有 Nginx 部署经验 |
| API 前端地址 | `VITE_API_BASE_URL=/v2`（构建时注入） | 同源避免跨域；Vite 环境变量构建时固定，不依赖容器运行时 |
| OAuth 流程 | NestJS GitHub OAuth + HttpOnly Cookie | 与已归档 admin-console 相同的认证链路 |
| 容器编排 | Docker Compose（新增 console service） | 复用现有 Next/Nest 的 Compose 文件 |
| CI/CD | GitHub Actions + `deploy-docker.sh` 扩展 | 不引入第二套发布系统 |
| staging 端口 | console:3301 / nest:3201 / next:3001 | 三套 staging 保持隔离，正式域名仅在 cutover 后指向生产容器 |

## 复用分析

| 复用项 | 当前状态 | 说明 |
|-------|--------|------|
| `scripts/deploy-docker.sh` | 扩展 | 增加 build-console、staging health、switch、diagnose、cancel |
| `Dockerfile` | 扩展 | 增加 deps、builder-console、runner-console 阶段 |
| `docker-compose.yml` | 扩展 | 增加 console 生产与 staging 服务定义 |
| `.github/workflows/` | 扩展 | quality gate 增加 `build:console`，发布依赖增加 console 镜像 |
| NestJS 认证模块 | 复用 | OAuth callback、Cookie、CORS 均为已有能力，仅增加生产配置 |
| Nginx 外部代理 | 新建 server block | 仅新增 `console.wuh.site`，不变更主站 Nginx 配置 |

## 影响分析

- **新增依赖:** 无新 npm 依赖；Console 构建依赖已存在于 workspace。
- **破坏性变更:** 无；主站 Next/Nest 公开行为不变，Console 作为独立域名上线。
- **环境变量边界:** Console 前端仅注入 `VITE_API_BASE_URL`；所有 secret 仅注入 NestJS 容器。
- **首次发布:** Console 与 NestJS 必须同步发布，确保 OAuth/API 契约一致。
- **后续发布:** 纯静态前端变更可独立发布；API、认证、权限契约变更需与 NestJS 绑定发布。
- **回滚:** Console 使用独立镜像，可按镜像版本回滚；NestJS 保留上一版本镜像。
- **性能影响:** 纯静态应用，仅外层 Nginx 增加一个 server block 的代理开销。

### `proposal.md`
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

### `specs/admin-console/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^#### Scenario: .+'
---

# Spec: 后台 Console 生产部署

## ADDED

### Requirement: Console 以独立静态镜像发布
Console 生产环境 SHALL 以 Nginx Alpine 容器运行 Vite 构建产物，与 Next.js 主站保持独立部署。

#### Scenario: Console 镜像构建与端口绑定
- **GIVEN** `packages/wuh.site.console` 的 `pnpm run build:console` 成功生成 `dist/`
- **WHEN** 构建 runner-console 镜像
- **THEN** 镜像使用 `nginx:alpine` 基础镜像
- **AND** `dist/` 内容复制到 `/usr/share/nginx/html`
- **AND** 生产容器端口绑定在 `127.0.0.1:3300`

### Requirement: Console 容器支持 SPA 路由
Console 容器内 Nginx SHALL 为前端路由提供 SPA fallback。

#### Scenario: SPA 路由刷新不返回 404
- **GIVEN** 用户访问 `https://console.wuh.site/content` 等前端路由
- **WHEN** 浏览器刷新或直接访问该路径
- **THEN** 容器内 Nginx 通过 `try_files $uri $uri/ /index.html` 回退到 `index.html`
- **AND** 不返回 Nginx 404 页面

### Requirement: 外部 Nginx 代理保持原始路径
外层 Nginx SHALL 将 `/v2/` 请求以原始路径转发至 NestJS，不修改请求路径。

#### Scenario: /v2 请求原路径转发
- **GIVEN** 外部 Nginx 配置 `location /v2/`
- **WHEN** 请求 `https://console.wuh.site/v2/auth/me` 到达
- **THEN** 代理至 `http://127.0.0.1:3200/v2/auth/me`，路径保持原样
- **AND** 不因 `proxy_pass` 配置导致路径被截断或改变

### Requirement: Console 使用同源 API
Console 前端 SHALL 通过同源路径 `/v2` 访问 NestJS API，避免跨域和 Cookie 配置复杂度。

#### Scenario: 生产环境 API 地址
- **GIVEN** 生产构建
- **WHEN** Vite 构建 Console
- **THEN** `VITE_API_BASE_URL` 为 `/v2`
- **AND** 不依赖容器运行时环境变量或全局注入

#### Scenario: 本地开发覆盖
- **GIVEN** 本地开发环境
- **WHEN** 启动 Console 开发服务器
- **THEN** 可通过 `.env.local` 覆盖为 `http://localhost:3200/v2`

### Requirement: 生产 OAuth Callback 使用 Console 域名
生产 GitHub OAuth SHALL 回调至 `https://console.wuh.site/v2/auth/github/callback` 且 Cookie 满足安全属性。

#### Scenario: 生产环境 OAuth 配置
- **GIVEN** 生产 GitHub OAuth App 配置完成
- **WHEN** 用户通过 Console 登录
- **THEN** NestJS 校验 state、交换 GitHub code 并写入用户记录
- **AND** `access_token` Cookie 为 `HttpOnly=true; Secure=true; SameSite=Lax; Path=/`
- **AND** 登录后重定向到 `https://console.wuh.site/`

### Requirement: 环境变量不向 Console 前端注入 Secret
Console 构建阶段注入的环境变量 SHALL 不包含任何 Secret。

#### Scenario: 禁止注入前端的变量
- **GIVEN** Console 的 `VITE_*` 环境变量在构建时注入
- **WHEN** 检查构建产物
- **THEN** 不得包含 `GITHUB_OAUTH_CLIENT_SECRET`、`JWT_SECRET`、`MONGO_URI` 或 `GITHUB_PERSONAL_TOKEN`

### Requirement: CI/CD 中 Console 参与构建与发布
CI/CD 流水线 SHALL 将 Console 纳入质量门禁、镜像构建、staging 和发布流程。

#### Scenario: quality gate 包含 Console 构建
- **GIVEN** GitHub Actions 执行 quality gate
- **WHEN** 运行 `pnpm run build:console`
- **THEN** 构建失败阻断后续流程

#### Scenario: staging 三服务健康检查
- **GIVEN** staging 容器启动
- **WHEN** 执行健康检查
- **THEN** `curl -f http://127.0.0.1:3301/` 返回成功
- **AND** `curl -f http://127.0.0.1:3201/v2/health` 返回成功
- **AND** `curl -f http://127.0.0.1:3001/` 返回成功

### Requirement: 首次上线 Console 与 NestJS 同步发布
Console 首次上线 SHALL 与 NestJS 同步发布，确保 OAuth、API 和权限契约一致。

#### Scenario: 首次上线发布序列
- **GIVEN** Console 与 NestJS 变更为首次生产部署
- **WHEN** 合并到 `main` 并触发发布
- **THEN** 两个服务在同一发布中构建与切换
- **AND** 发布含 Console 容器、NestJS 容器与生产 GitHub OAuth App 配置

### Requirement: 后续纯静态变更独立发布
Console 纯前端静态变更 SHALL 可独立发布，不影响 NestJS。

#### Scenario: 独立发布条件
- **GIVEN** Console 变更仅涉及样式、布局、文案或前端交互
- **WHEN** 打包 Console 镜像并部署
- **THEN** NestJS 不强制同步发布
- **AND** 不改变 API 请求格式、OAuth 流程或权限逻辑

### Requirement: 静态资源缓存策略
Console 静态资源 SHALL 按文件类型区分缓存策略。

#### Scenario: HTML 与带 hash 资源分别缓存
- **GIVEN** Console 的 Nginx 配置
- **WHEN** 响应请求
- **THEN** `index.html` 不进行长期缓存
- **AND** 带 hash 的 JS、CSS 与字体使用长期缓存

### `specs/build-config/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^#### Scenario: .+'
---

# Spec: 构建配置

## ADDED

### Requirement: Dockerfile 支持 Console 构建
Dockerfile SHALL 提供 deps、builder 和 runner 阶段以构建 Console 静态镜像。

#### Scenario: Console 多阶段构建
- **GIVEN** pnpm workspace 中包含 `packages/wuh.site.console`
- **WHEN** 执行 Docker 构建
- **THEN** deps 阶段复制 Console `package.json` 并安装 workspace 依赖
- **AND** builder-console 阶段执行 `pnpm run build:console`
- **AND** runner-console 阶段使用 `nginx:alpine` 提供静态文件服务

### Requirement: Docker Compose 包含 Console 服务
Docker Compose 配置 SHALL 定义生产与 staging Console 服务。

#### Scenario: 生产与 staging 端口规划
- **GIVEN** Compose 文件包含 next、nest、console 服务
- **WHEN** 启动生产容器
- **THEN** console 绑定 `127.0.0.1:3300`
- **WHEN** 启动 staging 容器
- **THEN** console staging 绑定 `127.0.0.1:3301`、nest staging 绑定 `127.0.0.1:3201`、next staging 绑定 `127.0.0.1:3001`

### Requirement: 部署脚本管理 Console 生命周期
`deploy-docker.sh` SHALL 为 Console 提供 build、staging health、switch、diagnose、cancel 和 rollback 能力。

#### Scenario: deploy-docker.sh Console 命令
- **GIVEN** 部署脚本已扩展 Console 支持
- **WHEN** 执行 `build-console`
- **THEN** 构建 Console 镜像
- **WHEN** 执行 `diagnose`
- **THEN** 包含 Console 容器状态检查
- **WHEN** 执行 `cancel`
- **THEN** 清理 staging Console 容器

### `tasks.md`
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
