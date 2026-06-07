# 统一请求层 + 类型迁移

## 背景

Next.js 项目中 HTTP 请求存在以下问题：

1. **错误处理不统一** — 有的 try-catch，有的 if-ok，有的不检查
2. **loading 状态管理不一致** — 客户端组件裸 fetch()，无统一 loading/error 状态
3. **API 方法签名不统一** — api.ts 中每个方法手动拼接 URLSearchParams，新增 API 无模板
4. **端点/参数散落** — URL 和参数序列化各自实现
5. **类型重复** — Book、Repo、PostItem 等类型在多个文件中重复定义 2-3 次
6. **类型错位** — shared-contracts 已有 RepoDto，Next.js 又定义了相同的 Repo

## 方案

采用声明式 API 定义 + ahooks useRequest，统一 Server Component 和 Client Component 的请求方式。

### 核心思路

- 声明式定义 API 端点（`defineService()`），自动生成 `.server()` 和 `.use()` 两个入口
- Server Component 使用 `.server()` — 保持 SSR/ISR 能力
- Client Component 使用 `.use()` — 基于 ahooks `useRequest`，获得 loading/error 状态管理
- 底层复用 `fetcher()`，不改动
- 全局 toast + 局部 UI 双通道错误处理

### 类型迁移

将 Next.js 中重复定义的 API 响应类型迁入 `shared-contracts`，消除 2-3 次重复：
- `Book`（2 次重复）→ `WereadBook`
- `Repo`（2 次重复）→ 合并到已有 `RepoDto`
- `PostItem`（3 次重复）→ `PostListItem`

## 改动范围

- `packages/shared-contracts/src/` — 新增 `endpoints.ts`（端点声明）、`index.ts` 新增 API 响应类型
- `packages/hooks/src/useFetch/` — 新增 `createService.ts`（运行时实现）、删除 `useFetch.ts`
- `packages/wuh.site.next/app/` — 各页面改用 service、从 shared-contracts 导入类型、删除 `api.ts`
- `packages/hooks/` — 安装 ahooks 依赖
