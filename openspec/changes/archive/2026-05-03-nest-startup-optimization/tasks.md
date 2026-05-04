# Tasks: nest 服务端启动耗时优化

## Phase 1: MongoDB 连接优化

- [x] `app.module.ts` 添加连接超时和连接池配置 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/src/app.module.ts`

## Phase 2: Sentry + Swagger 优化

- [x] `main.ts` Sentry 按需初始化 + Swagger 环境判断 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/src/main.ts`

## Phase 3: SWC 编译器切换

- [x] `nest-cli.json` 配置 swc builder，`package.json` 新增 swc 依赖 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/nest-cli.json`, `packages/wuh.site.nest/package.json`
