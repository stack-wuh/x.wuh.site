# Console 项目生产部署设计

## 状态

- 状态：已确认设计，等待实施计划
- 日期：2026-07-25
- 目标域名：`https://console.wuh.site`
- 适用项目：`x.wuh.site` monorepo

## 1. 背景与现状

项目当前使用 GitHub Actions + SSH + Docker Compose 部署 Next.js 主站和 NestJS API。生产部署在服务器 `/github/x.wuh.site` 执行，现有服务为：

- `next`：监听容器端口 `3000`
- `nest`：监听容器端口 `3200`

后台 Console 的实现是独立的 Vite + React SPA，目标 package 为 `packages/wuh.site.console`。Console 当前实现位于后台 Console 的工作分支，正式部署前必须合并到 `main`，因为现有 CI/CD 只监听 `main` 分支。

仓库现有 `scripts/deploy-docker.sh` 已支持镜像构建、staging 启动、健康检查和生产切流，因此 Console 应接入现有发布链路，而不是新增一套独立部署系统。

## 2. 目标与非目标

### 2.1 目标

1. 通过 `https://console.wuh.site` 访问 Console。
2. Console 以独立静态资源容器运行，不集成到主站 Next.js 路由。
3. 通过 Nginx 统一提供 HTTPS 和反向代理。
4. Console 使用同源 `/v2/*` API，降低跨域、Cookie 和 OAuth 配置复杂度。
5. 首次上线时让 Console 和 NestJS 一起发布，确保 OAuth/API 契约一致。
6. 后续纯前端静态变更可以独立发布；涉及 API、认证或权限契约的变更与 NestJS 同步发布。
7. 保留现有 staging、健康检查和回滚能力。

### 2.2 非目标

1. 本次不迁移到 Vercel、Cloudflare Pages 等托管平台。
2. 本次不把 Console 集成到 `packages/wuh.site.next` 的 `/admin` 路由。
3. 本次不实现完整的蓝绿零停机发布；沿用现有切流机制，后续按需要升级。
4. 本次不把 GitHub OAuth secret、JWT secret 或 MongoDB 连接串暴露到 Console 前端。
5. 本次不改变公开主站的域名和现有页面部署方式。

## 3. 部署架构

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

## 4. Console 镜像设计

Console 使用 Vite 构建，构建产物位于：

```text
packages/wuh.site.console/dist
```

Dockerfile 增加以下构建阶段：

1. `deps` 阶段复制 `packages/wuh.site.console/package.json` 并安装 workspace 依赖。
2. `builder-console` 阶段执行 `pnpm run build:console`。
3. `runner-console` 阶段使用 `nginx:alpine`，将 `dist` 复制到 `/usr/share/nginx/html`。

Console 容器的内部 Nginx 必须支持 SPA fallback：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

容器健康检查使用首页请求：

```text
GET http://localhost/
```

Console 是纯静态应用，生产运行阶段不需要 Node.js 进程。

## 5. Nginx 外部代理

`console.wuh.site` 的外部 Nginx 负责：

1. HTTP 重定向到 HTTPS。
2. TLS 证书终止。
3. `/` 转发至 `127.0.0.1:3300`。
4. `/v2/` 转发至 `127.0.0.1:3200`。
5. 传递 `Host`、`X-Real-IP`、`X-Forwarded-For` 和 `X-Forwarded-Proto`。

关键代理关系必须保持原始路径：

```text
/v2/auth/me → http://127.0.0.1:3200/v2/auth/me
```

因此 `/v2/` location 使用不追加路径的 `proxy_pass`。Console 前端路由刷新必须由 Console 容器回退到 `index.html`。

静态资源缓存策略：

- `index.html` 不进行长期缓存；
- 带 hash 的 JS/CSS/字体等静态资源可以使用长期缓存；
- 发布新版本时通过新的资源 hash 避免旧资源冲突。

## 6. API、OAuth 与 Cookie

### 6.1 Console API 地址

生产环境使用同源 API：

```text
VITE_API_BASE_URL=/v2
```

前端代码的默认 fallback 也应为 `/v2`，本地开发再通过 `.env.local` 覆盖为：

```text
http://localhost:3200/v2
```

Vite 的 `VITE_*` 变量在构建阶段注入，不依赖容器启动时的环境变量。生产部署不向前端注入任何 secret。

### 6.2 GitHub OAuth

生产 GitHub OAuth App 配置：

```text
Homepage URL:
https://console.wuh.site

Authorization callback URL:
https://console.wuh.site/v2/auth/github/callback
```

建议本地开发使用单独 OAuth App：

```text
http://localhost:3200/v2/auth/github/callback
```

生产环境变量：

```env
GITHUB_OAUTH_CLIENT_ID=<production-client-id>
GITHUB_OAUTH_CLIENT_SECRET=<production-client-secret>
GITHUB_OAUTH_CALLBACK_URL=https://console.wuh.site/v2/auth/github/callback
CONSOLE_URL=https://console.wuh.site
```

OAuth 登录流程为：

1. 浏览器访问 `/v2/auth/github`。
2. NestJS 设置 OAuth state Cookie 并跳转 GitHub。
3. GitHub 回调 `/v2/auth/github/callback`。
4. NestJS 校验 state、交换 GitHub code、读取用户资料。
5. 用户数据写入 MongoDB，`stack-wuh` 为 root，其他用户为 reader。
6. NestJS 写入 HttpOnly `access_token` Cookie。
7. 重定向到 `https://console.wuh.site/`。

生产 Cookie 要求：

```text
HttpOnly=true
Secure=true
SameSite=Lax
Path=/
```

### 6.3 CORS

由于 Console 和 API 同源，Console 的正常请求不依赖 CORS。NestJS 仍需保留现有主站允许源，并补充 Console 源：

```env
CORS_ORIGIN=https://wuh.site,https://console.wuh.site
```

最终允许列表以线上实际仍需浏览器直接访问 API 的站点为准。

## 7. 环境变量边界

### 7.1 仅注入 NestJS 容器

```env
MONGO_URI
GITHUB_PERSONAL_TOKEN
GITHUB_OAUTH_CLIENT_ID
GITHUB_OAUTH_CLIENT_SECRET
GITHUB_OAUTH_CALLBACK_URL
CONSOLE_URL
JWT_SECRET
JWT_EXPIRATION
CORS_ORIGIN
```

### 7.2 Console 构建阶段

```env
VITE_API_BASE_URL=/v2
```

### 7.3 禁止注入 Console 前端

以下变量不能通过 `VITE_*` 传入：

```text
GITHUB_OAUTH_CLIENT_SECRET
JWT_SECRET
MONGO_URI
GITHUB_PERSONAL_TOKEN
```

## 8. CI/CD 设计

现有流水线调整为：

```text
quality-gate
    ↓
prepare
    ↓
prepare-deps
    ├── build-next
    ├── build-nest
    └── build-console
            ↓
       staging-test
            ↓
       switch-traffic
```

### 8.1 quality-gate

增加 Console 构建验证：

```bash
pnpm run build:console
```

保留现有：

```bash
pnpm exec tsc --noEmit
pnpm run lint:next
```

### 8.2 Docker 构建

`Dockerfile` 的依赖阶段必须复制 Console package manifest，确保 Vite 及其插件进入 lockfile 安装范围。新增 `builder-console` 和 `runner-console` target。

### 8.3 部署脚本

`scripts/deploy-docker.sh` 增加：

- `build-console`：构建 Console 镜像；
- `staging-test` 中检查 `127.0.0.1:3301`；
- `diagnose` 中检查 Console 容器状态；
- `cancel` 中清理 staging Console；
- `switch-traffic` 中启动生产 Console。

staging 端口规划：

```text
next    → 3001
nest    → 3201
console → 3301
```

staging 健康检查：

```bash
curl -f http://127.0.0.1:3201/v2/health
curl -f http://127.0.0.1:3001/
curl -f http://127.0.0.1:3301/
```

正式域名在 staging 阶段不切换，避免用户访问到尚未验收的 staging 服务。

## 9. 发布策略

### 9.1 首次上线

首次上线必须让 NestJS 和 Console 一起发布，因为两者同时引入 OAuth、Cookie 和 `/v2/admin` 契约。上线顺序：

1. 合并 Console 和 NestJS 变更到 `main`。
2. 创建生产 GitHub OAuth App。
3. 在服务器配置生产 `.env`。
4. 配置 DNS `console.wuh.site`。
5. 配置 Nginx 和 HTTPS 证书。
6. 构建 Next、Nest、Console 三个镜像。
7. 启动 staging 并完成健康检查。
8. 切换生产流量。
9. 手动验证 OAuth、root/reader 权限和管理 API。

### 9.2 后续发布

以下变更可以只发布 Console：

- 样式调整；
- 页面布局调整；
- 文案调整；
- 不改变 API 请求和认证流程的前端交互变更。

以下变更应与 NestJS 一起发布：

- API 路径、参数或响应结构变更；
- OAuth、Cookie、JWT 逻辑变更；
- root/reader 权限逻辑变更；
- 共享 DTO 变更；
- `/v2/admin/*` 管理接口变更。

### 9.3 回滚

Console 使用独立镜像，可按镜像版本回滚。NestJS 保留上一版本镜像。当前发布流程仍然是停止旧容器后启动新容器，存在短暂中断；蓝绿容器和 Nginx upstream 切换作为后续优化，不作为首次上线阻塞条件。

## 10. DNS、证书和服务器准备

服务器上线前需要完成：

- `console.wuh.site` A 记录指向生产服务器 IPv4；
- 如使用 IPv6，配置 AAAA 记录；
- 防火墙允许 80/443；
- Nginx 新增 `console.wuh.site` 配置；
- 使用 Certbot 或现有证书系统申请 HTTPS；
- Nginx 代理目标为 `127.0.0.1:3300` 和 `127.0.0.1:3200`；
- Docker 服务端口绑定本机，避免绕过 Nginx 直接暴露。

## 11. 验收标准

### 基础访问

- `https://console.wuh.site/` 返回 Console 登录页面；
- 刷新 `/content`、`/comments` 等前端路由不返回 404；
- 静态资源加载无 mixed content 或跨域错误；
- Nest 健康检查和 Console 健康检查均通过。

### OAuth

- 未登录访问受保护页面会进入登录流程；
- GitHub callback 地址使用 HTTPS 且与 OAuth App 完全一致；
- 登录后 `access_token` 为 HttpOnly、Secure Cookie；
- `/v2/auth/me` 返回当前用户信息；
- 登出后 Cookie 失效。

### 权限

- GitHub login 为 `stack-wuh` 的用户获得 root；
- 其他 GitHub 用户获得 reader；
- reader 可以读取后台列表和详情；
- reader 调用任意后台写 API 返回 403；
- root 可以执行允许的后台管理操作。

### 发布

- `pnpm run build:console` 通过；
- Docker 可以构建 `runner-console`；
- staging 三个服务的健康检查通过；
- 正式切流后 Console、Nest 和 Next 均可访问；
- 失败时可以回滚到上一版镜像。

## 12. 设计结论

采用“独立 Console 镜像 + Nginx 同域反向代理”的部署方式：

- `console.wuh.site/` 提供静态 Console；
- `console.wuh.site/v2/*` 反代到 NestJS；
- Console 与 Nest 首次一起发布；
- 纯静态前端变更允许独立发布；
- API、认证和权限变更与 NestJS 绑定发布；
- 首次上线沿用现有 staging 和切流流程，暂不引入蓝绿发布复杂度。
