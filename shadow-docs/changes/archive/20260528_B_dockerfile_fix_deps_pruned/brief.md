# Dockerfile 依赖方案修复

> 原始变更名：`20260528_B_dockerfile_fix_deps_pruned`

## 元数据
- 日期：2026-05-28
- 类型：B
- 状态：archived
- Issue：历史记录未提供

## 动机
`runner-next` 容器 4 天前构建后一直 unhealthy，健康检查 `curl -f http://localhost:3000/` 失败。
日志显示 `uncaughtException: Cannot write headers after they are sent to the client` 和 React 渲染错误。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# Dockerfile 方案对比

## deps-pruned（当前方案）

```
base (node:20-alpine)
  └─ deps (pnpm install 全量 + COPY packages)
       ├─ builder-next → dist
       ├─ builder-nest → dist
       └─ deps-pruned (pnpm prune --prod --ignore-scripts)
            ├─ runner-next (COPY deps-pruned + builder-next dist)
            └─ runner-nest (COPY deps-pruned + builder-nest dist)
```

- 每个 runner 包含全部 packages 的生产依赖
- 镜像 ~300-500MB，简单可靠

## deploy --prod（未来优化方向）

```
deps → deploy-next (pnpm deploy --prod)
     → runner-next (完整使用 deploy 输出)
```

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: dockerfile-fix-deps-pruned
date: 2026-05-28
type: B
status: archived
```

### `design.md`
# Dockerfile 方案对比

## deps-pruned（当前方案）

```
base (node:20-alpine)
  └─ deps (pnpm install 全量 + COPY packages)
       ├─ builder-next → dist
       ├─ builder-nest → dist
       └─ deps-pruned (pnpm prune --prod --ignore-scripts)
            ├─ runner-next (COPY deps-pruned + builder-next dist)
            └─ runner-nest (COPY deps-pruned + builder-nest dist)
```

- 每个 runner 包含全部 packages 的生产依赖
- 镜像 ~300-500MB，简单可靠

## deploy --prod（未来优化方向）

```
deps → deploy-next (pnpm deploy --prod)
     → runner-next (完整使用 deploy 输出)
```

### `proposal.md`
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

### `tasks.md`
# 任务清单

| # | 任务 | 状态 | 涉及文件 |
|---|------|------|----------|
| 1 | Dockerfile 回退至 deps-pruned 方案 | ✓ | `Dockerfile` |
| 2 | VPS 构建部署验证 | ⏳ | - |
