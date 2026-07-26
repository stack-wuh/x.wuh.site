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
