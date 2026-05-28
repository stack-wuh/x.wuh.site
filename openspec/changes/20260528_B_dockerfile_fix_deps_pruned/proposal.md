# Dockerfile 依赖方案修复

## 问题

`runner-next` 容器 4 天前构建后一直 unhealthy，健康检查 `curl -f http://localhost:3000/` 失败。
日志显示 `uncaughtException: Cannot write headers after they are sent to the client` 和 React 渲染错误。

## 根因

Dockerfile 使用了 `pnpm deploy --prod` 方案：runner 混合了 deploy 输出的 node_modules（独立部署结构）和 deps 阶段的 workspace 源文件，两套来源的依赖解析路径不一致，导致运行时缺少依赖。

## 方案

将 `deploy-next` / `deploy-nest` 阶段替换为统一的 `deps-pruned` 阶段（`pnpm prune --prod --ignore-scripts`），runner 从 deps-pruned 复制完整的 node_modules + packages，保持 workspace 结构和依赖完整性。

## 影响

- runner-next / runner-nest 镜像体积增大 ~150-200MB（各自包含对方的生产依赖）
- 稳定性优先，后续可优化体积
