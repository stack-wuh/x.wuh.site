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
