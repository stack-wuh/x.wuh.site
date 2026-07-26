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
