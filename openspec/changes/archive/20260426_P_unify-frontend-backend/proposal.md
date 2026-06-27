# 前后端统一与 Monorepo 策略

## 为什么做

需要将前端 (wuh.site.next) 和后端 (wuh.site.nest) 统一到 monorepo 策略下，保持包边界清晰、复用本地组件/hooks、保证 SSR 安全、定义清晰的 API 契约和 CI/部署流程。

## 做什么

### Phase 0: 仓库分析与门禁
- 验证导入别名、包边界、构建配置

### Phase 1: 共享契约 + CI
- 创建 packages/shared-contracts（types/DTOs/OpenAPI schemas）
- 设置 CI 增量构建策略（pnpm workspaces）

### Phase 2: 后端骨架
- NestJS module/service/controller/DTO + Mongo schemas
- 对齐 shared-contracts

### Phase 3: 前端迁移
- 前端消费 shared-contracts 和本地组件
- SSR 安全性审计

### Phase 4: 集成测试与部署
- 端到端测试验证 API 契约
- 完善 CI/CD 部署流程

## 影响范围

- `packages/shared-contracts/` — 新增
- `packages/wuh.site.nest/` — 新建
- `packages/wuh.site.next/` — 迁移
- CI/CD workflows — 更新
