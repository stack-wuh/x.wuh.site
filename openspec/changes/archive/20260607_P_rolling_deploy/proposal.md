# 滚动部署 + 自动回滚

## 背景

当前部署流程（`deploy-docker.sh restart`）是 `down → build → up`。如果新镜像构建成功但容器启动失败（health check 不过），旧容器已被 down，导致服务中断。

## 方案

采用"先启后切"的滚动部署策略：

1. 构建新镜像，打时间戳 tag
2. 用临时端口（3001/3201）启动 staging 容器
3. 轮询 health check（最长 120s）
4. 通过 → 停旧容器 → staging 容器用正式端口重启 → 删旧镜像
5. 失败 → 删 staging 容器 → 旧容器继续运行

旧容器在整个过程中保持运行，只有在验证通过后才切换，保证零停机。

## 改动范围

- `docker-compose.yml` — 端口从硬编码改为 `${PORT_NEXT:-3000}` / `${PORT_NEST:-3200}`
- `scripts/deploy-docker.sh` — 新增 `deploy` 命令，`restart` 改为调用 `deploy`
- `.github/workflows/ci-cd.yml` — `restart` 改为 `deploy`
