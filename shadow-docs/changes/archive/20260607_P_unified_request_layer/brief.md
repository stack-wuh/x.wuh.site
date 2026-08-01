# 统一请求层 + 类型迁移

> 原始变更名：`20260607_P_unified_request_layer`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
Next.js 项目中 HTTP 请求存在以下问题：

1. **错误处理不统一** — 有的 try-catch，有的 if-ok，有的不检查
2. **loading 状态管理不一致** — 客户端组件裸 fetch()，无统一 loading/error 状态
3. **API 方法签名不统一** — api.ts 中每个方法手动拼接 URLSearchParams，新增 API 无模板
4. **端点/参数散落** — URL 和参数序列化各自实现
5. **类型重复** — Book、Repo、PostItem 等类型在多个文件中重复定义 2-3 次
6. **类型错位** — shared-contracts 已有 RepoDto，Next.js 又定义了相同的 Repo

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
```
                    endpoints.ts（纯类型声明）
                    shared-contracts
                         │
                    ┌────┴────┐
                    ▼         ▼
              .server()     .use()
              (async fn)   (useRequest hook)
                    │         │
                    ▼         ▼
            Server Comp    Client Comp
              (SSR/ISR)    (交互/状态)
                    │         │
                    └────┬────┘
                         ▼
                     fetcher()
                   packages/hooks
                         │
                         ▼
                      fetch()
```

三层结构：

- **fetcher()** — 底层，统一请求/响应序列化，返回 `{ data, error, status, ok }`（已有，不改）
- **defineService()** — 中层，声明式端点定义 → 自动生成 `.server()` 和 `.use()` 两个入口
- **组件层** — Server Component `await .server()`，Client Component 调用 `.use()`

## 任务
### Phase 1：历史任务
- [ ] 将 `Book` → `WereadBook` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `Repo` 合并到已有 `RepoDto`
- [ ] 将 `PostItem` → `PostListItem` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `AdjacentPost`, `PostDetail`, `FetchOptions` 迁入 `shared-contracts/src/index.ts`
- [ ] Next.js 中删除重复类型，改为从 shared-contracts 导入
- [ ] 验证 TypeScript 编译通过
- [ ] `packages/hooks` 安装 ahooks 依赖
- [ ] 实现 `defineService()` — 端点定义 → 生成 `.server()` + `.use()`
- [ ] 实现 `configureService()` — 设置全局 onError
- [ ] `.server()` 返回 `Promise<{ data, error, loading }>`
- [ ] `.use()` 封装 ahooks `useRequest`，返回 `{ data, error, loading, run, refresh }`
- [ ] 创建 `packages/shared-contracts/src/endpoints.ts`
- [ ] 声明 contentService（getPosts, getPost, getProjects）
- [ ] 声明 reposService（getAll）
- [ ] 声明 wereadService（getBooks）
- [ ] 声明 commentsService（getByIssue）
- [ ] `app/weread/page.tsx` 改用 `wereadService.getBooks.server()`
- [ ] `app/weread/WereadView.tsx` 类型改为从 shared-contracts 导入
- [ ] 确认列表渲染和分页功能正常
- [ ] `app/blog/page.tsx` 改用 `contentService.getPosts.server()`
- [ ] `app/page.tsx` 改用 contentService + reposService + wereadService
- [ ] `app/post/[number]/page.tsx` 改用 `contentService.getPost.server()`
- [ ] `app/sitemap.ts` 改用 service
- [ ] 确认各页面 ISR revalidate 配置不变
- [ ] `app/components/AppProviders.tsx` 裸 fetch → service
- [ ] `app/components/player/GlobalAudioPlayer.tsx` 裸 fetch → service
- [ ] 确认 loading/error 状态正常
- [ ] 删除 `app/lib/api.ts`
- [ ] 删除 `packages/hooks/src/useFetch/useFetch.ts`
- [ ] TypeScript 类型检查通过
- [ ] Next.js build 通过

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: unified-request-layer
date: 2026-06-07
type: P
status: applied
```

### `design.md`
# 设计文档：统一请求层 + 类型迁移

## 架构

```
                    endpoints.ts（纯类型声明）
                    shared-contracts
                         │
                    ┌────┴────┐
                    ▼         ▼
              .server()     .use()
              (async fn)   (useRequest hook)
                    │         │
                    ▼         ▼
            Server Comp    Client Comp
              (SSR/ISR)    (交互/状态)
                    │         │
                    └────┬────┘
                         ▼
                     fetcher()
                   packages/hooks
                         │
                         ▼
                      fetch()
```

三层结构：

- **fetcher()** — 底层，统一请求/响应序列化，返回 `{ data, error, status, ok }`（已有，不改）
- **defineService()** — 中层，声明式端点定义 → 自动生成 `.server()` 和 `.use()` 两个入口
- **组件层** — Server Component `await .server()`，Client Component 调用 `.use()`

## API 端点定义

声明在 `packages/shared-contracts/src/endpoints.ts`（纯类型，零运行时依赖）：

```ts
export const contentService = defineService({
  getPosts:    { url: '/content/posts',       method: 'GET' },
  getPost:     { url: '/content/posts/:slug', method: 'GET' },
  getProjects: { url: '/content/projects',    method: 'GET' },
})

export const reposService = defineService({
  getAll: { url: '/repos', method: 'GET' },
})

export const wereadService = defineService({
  getBooks: { url: '/weread/books', method: 'GET' },
})

export const commentsService = defineService({
  getByIssue: { url: '/comments', method: 'GET' },
})
```

端点定义要点：
- `:param` 路径参数自动替换（如 `:slug`）
- Query 参数通过 `{ query: { page: 1 } }` 传入，自动序列化
- Body 参数通过 `{ body: {...} }` 传入（POST/PATCH）
- ISR `revalidate` 仅 `.server()` 支持

## 使用方式

### Server Component（`.server()`）

```tsx
// app/blog/page.tsx
import { contentService } from '@wuh.site/shared-contracts'

export default async function Page({ searchParams }) {
  const { data, error } = await contentService.getPosts.server({
    query: { page: 1, limit: 10, state: 'open' },
    revalidate: 600,
  })

  if (error || !data) return <ErrorView message={error?.message} />
  return <BlogListView posts={data.data} total={data.total} />
}
```

- 返回 `Promise<{ data, error, loading }>`
- 支持 ISR `revalidate`
- 调用方负责错误 UI

### Client Component（`.use()`）

```tsx
import { musicService } from '@wuh.site/shared-contracts'

export default function GlobalAudioPlayer({ playlistId }) {
  const { data, error, loading } = musicService.getPlaylist.use({
    query: { playlistId },
  })

  if (loading) return <Spinner />
  if (error) return null  // 全局已 toast
  return <TrackList tracks={data} />
}
```

- 返回 `{ data, error, loading, run, refresh }`（useRequest 提供）
- 自动受全局 `onError` 管理

## 错误处理

全局 toast + 局部 UI 双通道：

```ts
// 入口配置一次
configureService({
  onError: (error) => toast.error(error.message || '请求失败'),
})

// 三种处理模式：

// 1. 只靠全局 toast
const { data, loading } = service.list.use({ query: { page: 1 } })

// 2. 全局 toast + 组件 Error UI
const { data, error, loading } = service.list.use({ query: { page: 1 } })
if (error) return <ErrorView message={error.message} />

// 3. 覆盖全局 onError
const { data } = service.list.use({
  query: { page: 1 },
  onError: (error) => { /* 自定义 */ },
})
```

## 类型迁移

### 迁入 shared-contracts/src/index.ts

| 来源 | 原类型 | 新类型名 | 说明 |
|------|--------|----------|------|
| `weread/page.tsx` + `WereadView.tsx` | `Book` (2 次重复) | `WereadBook` | 微信读书书籍 |
| `page.tsx` + `HomeView.tsx` | `Repo` (2 次重复) | 合并到已有 `RepoDto` | GitHub 仓库 |
| `page.tsx` + `blog/page.tsx` + `BlogListView` | `PostItem` (3 次重复) | `PostListItem` | 博客列表项 |
| `lib/api.ts` | `AdjacentPost`, `PostDetail`, `FetchOptions` | 同名迁移 | API 响应/配置类型 |

### 留在原地的类型

- React 组件 Props（纯 UI 关注）
- 派生视图模型（`TagItem`, `YearlySummary`）— 从 API 类型派生
- API Route 专用类型（`NetEaseArtist/Track/Album`）— 仅 route handler 内使用

## 文件结构

```
packages/shared-contracts/src/
├── index.ts              # 原有 DTO + 迁入的 API 响应类型
└── endpoints.ts          # 新增：端点定义（纯类型声明）

packages/hooks/src/useFetch/
├── fetcher.ts             # 不改动
├── createService.ts       # 新增：defineService + configureService 运行时
└── useFetch.ts            # 删除（ahooks useRequest 替代）

packages/wuh.site.next/app/
├── lib/api.ts             # 删除
└── ...                    # 各页面从 shared-contracts 导入 + 使用 service
```

## 不改变的部分

- `fetcher.ts` — 底层实现不变
- API Route Handlers（`/api/music/*`）— 服务端到外部 API，不受影响
- 组件 props、view model 类型 — 留在原地

### `proposal.md`
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

### `tasks.md`
# 任务清单

## Task 1: 类型迁移到 shared-contracts
- [ ] 将 `Book` → `WereadBook` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `Repo` 合并到已有 `RepoDto`
- [ ] 将 `PostItem` → `PostListItem` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `AdjacentPost`, `PostDetail`, `FetchOptions` 迁入 `shared-contracts/src/index.ts`
- [ ] Next.js 中删除重复类型，改为从 shared-contracts 导入
- [ ] 验证 TypeScript 编译通过

## Task 2: 运行时实现 createService.ts
- [ ] `packages/hooks` 安装 ahooks 依赖
- [ ] 实现 `defineService()` — 端点定义 → 生成 `.server()` + `.use()`
- [ ] 实现 `configureService()` — 设置全局 onError
- [ ] `.server()` 返回 `Promise<{ data, error, loading }>`
- [ ] `.use()` 封装 ahooks `useRequest`，返回 `{ data, error, loading, run, refresh }`

## Task 3: 端点声明 endpoints.ts
- [ ] 创建 `packages/shared-contracts/src/endpoints.ts`
- [ ] 声明 contentService（getPosts, getPost, getProjects）
- [ ] 声明 reposService（getAll）
- [ ] 声明 wereadService（getBooks）
- [ ] 声明 commentsService（getByIssue）

## Task 4: 试点替换 /weread
- [ ] `app/weread/page.tsx` 改用 `wereadService.getBooks.server()`
- [ ] `app/weread/WereadView.tsx` 类型改为从 shared-contracts 导入
- [ ] 确认列表渲染和分页功能正常

## Task 5: 替换剩余 Server Components
- [ ] `app/blog/page.tsx` 改用 `contentService.getPosts.server()`
- [ ] `app/page.tsx` 改用 contentService + reposService + wereadService
- [ ] `app/post/[number]/page.tsx` 改用 `contentService.getPost.server()`
- [ ] `app/sitemap.ts` 改用 service
- [ ] 确认各页面 ISR revalidate 配置不变

## Task 6: 替换 Client Components
- [ ] `app/components/AppProviders.tsx` 裸 fetch → service
- [ ] `app/components/player/GlobalAudioPlayer.tsx` 裸 fetch → service
- [ ] 确认 loading/error 状态正常

## Task 7: 清理
- [ ] 删除 `app/lib/api.ts`
- [ ] 删除 `packages/hooks/src/useFetch/useFetch.ts`
- [ ] TypeScript 类型检查通过
- [ ] Next.js build 通过
