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
