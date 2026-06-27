# 任务拆分

## Phase 0 — 仓库分析

- [ ] T1: 分析仓库别名、包边界、构建配置
  - 产出: path/alias 修复清单

## Phase 1 — 共享契约

- [ ] T2: 创建 shared-contracts 包
  - 涉及文件: `packages/shared-contracts/`
  - 产出: TypeScript DTOs / OpenAPI 定义

- [ ] T3: 设置 CI 增量构建
  - 涉及文件: `.github/workflows/`

## Phase 2 — 后端骨架

- [ ] T4: 创建 NestJS 模块骨架
  - 涉及文件: `packages/wuh.site.nest/`
  - 产出: Module/Service/Controller/DTO + Mongo Schema

## Phase 3 — 前端迁移

- [ ] T5: 前端导入 shared-contracts
  - 涉及文件: `packages/wuh.site.next/`

- [ ] T6: SSR 安全性审计
  - 审计 'use client' 和浏览器 API guard

## Phase 4 — 集成

- [ ] T7: 集成测试
- [ ] T8: 部署流程完善
