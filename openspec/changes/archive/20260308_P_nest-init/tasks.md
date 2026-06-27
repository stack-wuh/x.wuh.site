# 任务拆分

## Phase 1 — 基础设施

- [ ] T1: 初始化 NestJS 项目与模块结构
  - 涉及文件: `packages/wuh.site.nest/`
  - 产出: App Module + Mongoose + Config + Throttler

- [ ] T2: 创建 Content/Comment/User Schema
  - 涉及文件: `packages/wuh.site.nest/src/modules/content/schemas/` 等

## Phase 2 — 核心功能

- [ ] T3: 实现 Sync Service（全量/增量同步）
  - 涉及文件: `packages/wuh.site.nest/src/modules/sync/`

- [ ] T4: 实现 Content/Comment API
  - 涉及文件: `packages/wuh.site.nest/src/modules/content/`, `comment/`

- [ ] T5: 实现 Webhook 模块（签名校验 + 事件处理）

## Phase 3 — 辅助功能

- [ ] T6: 实现 RSS 模块
- [ ] T7: 集成 Pino + Sentry
- [ ] T8: 实现 User/Auth/Admin 模块

## Phase 4 — 脚本与验证

- [ ] T9: 实现 sync:init 脚本
- [ ] T10: 全链路验证
  - `pnpm --filter @wuh.site/nest lint && pnpm --filter @wuh.site/nest build`
  - 手动验证 API 端点、Webhook、RSS
