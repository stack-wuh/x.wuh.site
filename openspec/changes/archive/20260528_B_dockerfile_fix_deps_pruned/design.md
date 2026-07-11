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
