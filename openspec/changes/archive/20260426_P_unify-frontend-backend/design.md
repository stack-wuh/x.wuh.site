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
