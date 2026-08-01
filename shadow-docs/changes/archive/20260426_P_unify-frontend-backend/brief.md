# 前后端统一与 Monorepo 策略

> 原始变更名：`20260426_P_unify-frontend-backend`

## 元数据
- 日期：2026-04-26
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：前后端统一与 Monorepo 策略

## 方案

### 1. 包结构

```
packages/
├── wuh.site.next      # 前端 Next.js 15
├── wuh.site.nest      # 后端 NestJS 10
├── components         # UI 组件库
├── hooks              # 共享 hooks
├── shared-contracts   # 前后端共享 DTO 类型
└── config             # 类型/配置包
```

### 2. shared-contracts

```ts
// packages/shared-contracts/src/
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostDto {
  number: number
  title: string
  body: string
  bodyHtml?: string
  labels: string[]
  metadata: PostMetadata
  // ...
}
```

### 3. CI 策略

- pnpm workspaces 增量构建
- 每个包独立 pipeline + 缓存
- PR 检查: lint + typecheck + build

## 依赖

- 不新增第三方 monorepo 工具（仅 pnpm workspaces）

## 任务
### Phase 0 — 仓库分析
- [ ] T1: 分析仓库别名、包边界、构建配置
### Phase 1 — 共享契约
- [ ] T2: 创建 shared-contracts 包
- [ ] T3: 设置 CI 增量构建
### Phase 2 — 后端骨架
- [ ] T4: 创建 NestJS 模块骨架
### Phase 3 — 前端迁移
- [ ] T5: 前端导入 shared-contracts
- [ ] T6: SSR 安全性审计
### Phase 4 — 集成
- [ ] T7: 集成测试
- [ ] T8: 部署流程完善

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 前后端统一
change: unify-frontend-backend
date: 2026-04-26
type: P
status: applied
```

### `design.md`
# 设计：前后端统一与 Monorepo 策略

## 方案

### 1. 包结构

```
packages/
├── wuh.site.next      # 前端 Next.js 15
├── wuh.site.nest      # 后端 NestJS 10
├── components         # UI 组件库
├── hooks              # 共享 hooks
├── shared-contracts   # 前后端共享 DTO 类型
└── config             # 类型/配置包
```

### 2. shared-contracts

```ts
// packages/shared-contracts/src/
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostDto {
  number: number
  title: string
  body: string
  bodyHtml?: string
  labels: string[]
  metadata: PostMetadata
  // ...
}
```

### 3. CI 策略

- pnpm workspaces 增量构建
- 每个包独立 pipeline + 缓存
- PR 检查: lint + typecheck + build

## 依赖

- 不新增第三方 monorepo 工具（仅 pnpm workspaces）

### `proposal.md`
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

### `tasks.md`
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
