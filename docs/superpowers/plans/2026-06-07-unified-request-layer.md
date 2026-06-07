# 统一请求层 + 类型迁移 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 声明式 API 端点定义 + ahooks useRequest 统一请求层，同时将重复类型迁入 shared-contracts

**Architecture:** `defineService()` 从声明式端点定义自动生成 `.server()` (Server Component) 和 `.use()` (Client Component) 两个入口，底层复用 `fetcher()`

**Tech Stack:** TypeScript, ahooks (useRequest), fetcher (已有)

**Dependency:** ahooks 已是 `wuh.site.next` 的现有依赖（AppProviders.tsx 在用 useEventListener/useExternal）

---

### Task 1: 类型迁入 shared-contracts

**Files:**
- Modify: `packages/shared-contracts/src/index.ts` — 新增 WereadBook、PostListItem、FetchError（从 fetcher 重导出）、FetchOptions
- Delete: 不需要删除 fetcher 中的 FetchError — 需要从 shared-contracts 重导出以供 fetcher 使用

> 注意：`packages/shared-contracts` 是纯类型包（emitDeclarationOnly），不能 import 运行时代码。`FetchError` 在 `fetcher.ts` 中定义，如果迁到 shared-contracts，fetcher 需要反向依赖 shared-contracts。为避免循环依赖，**不改动 fetcher 的类型**，仅在 shared-contracts 中定义 API 响应相关的类型。

- [ ] **Step 1: 在 shared-contracts/src/index.ts 末尾追加 WereadBook 类型**

```ts
// Weread
export interface WereadBook {
  bookId: string
  title: string
  author: string
  cover: string
  readUpdateTime: number
  finishReading: number
}
```

- [ ] **Step 2: 在 shared-contracts/src/index.ts 末尾追加 PostListItem 类型**

```ts
// Post list item (frontend view model derived from ContentItem)
export interface PostListItem {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string; color?: string | null }[]
}
```

- [ ] **Step 3: 在 shared-contracts/src/index.ts 末尾追加 AdjacentPost 和 PostDetail 类型**

```ts
// Post detail with adjacent navigation
export type AdjacentPost = { number: number; title: string } | null

export type PostDetail = ContentItem & {
  prev: AdjacentPost
  next: AdjacentPost
  total: number
  position: number
}
```

- [ ] **Step 4: 验证 shared-contracts 编译**

Run: `cd packages/shared-contracts && pnpm build`
Expected: 成功编译 declarations

- [ ] **Step 5: 更新 Next.js 中的类型引用 — app/weread/page.tsx**

删除 `Book` 和 `PageData` 的本地定义，改为从 shared-contracts 导入：
```ts
import type { WereadBook } from '@wuh.site/shared-contracts'
```
删除第 21-35 行的 `type Book = {...}` 和 `type PageData = {...}`。
将函数签名中的 `Book` 替换为 `WereadBook`：
```ts
async function getBooks(page: number): Promise<{ books: WereadBook[]; total: number; currentPage: number; totalPages: number }>
```

- [ ] **Step 6: 更新 Next.js 中的类型引用 — app/weread/WereadView.tsx**

删除本地 `Book` 类型（第 7-14 行），改为：
```ts
import type { WereadBook } from '@wuh.site/shared-contracts'
```
Props 中 `books: Book[]` → `books: WereadBook[]`

- [ ] **Step 7: 更新 Next.js 中的类型引用 — app/page.tsx**

删除本地 `Repo` 类型（第 27-35 行），改为导入 `RepoDto`：
```ts
import type { ContentItem, RepoDto } from '@wuh.site/shared-contracts'
```
删除本地 `PostItem` 类型（第 46-54 行），改为导入 `PostListItem`：
```ts
import type { PostListItem } from '@wuh.site/shared-contracts'
```
删除本地 `WereadBook` 类型（第 58-65 行）。
函数签名更新：`Repo` → `RepoDto`，`PostItem` → `PostListItem`。
`mapContentToPost` 返回类型改为 `PostListItem`。

- [ ] **Step 8: 更新 Next.js 中的类型引用 — app/HomeView.tsx**

删除本地 `Repo` 类型（第 14-22 行），从 shared-contracts 导入：
```ts
import type { RepoDto, WereadBook, PostListItem } from '@wuh.site/shared-contracts'
```
Props 中 `repos: Repo[]` → `repos: RepoDto[]`，`wereadBooks` 内联类型改为 `WereadBook[]`，`posts` 内联类型改为 `PostListItem[]`

- [ ] **Step 9: 更新 Next.js 中的类型引用 — app/blog/page.tsx**

删除本地 `PostItem` 类型（第 36-43 行），导入 `PostListItem`：
```ts
import type { PostListItem } from '@wuh.site/shared-contracts'
```
`mapContentToPost` 和 `getIssues` 中的 `PostItem` → `PostListItem`

- [ ] **Step 10: 更新 Next.js 中的类型引用 — app/blog/BlogListView.tsx**

删除本地 `PostItem` 类型（第 16-23 行），导入 `PostListItem`：
```ts
import type { PostListItem } from '@wuh.site/shared-contracts'
```
`groupByYear(posts: PostItem[])` → `groupByYear(posts: PostListItem[])`

- [ ] **Step 11: 更新 Next.js 中的类型引用 — app/lib/api.ts**

`AdjacentPost` 和 `PostDetail` 改为从 shared-contracts 导入：
```ts
import type { AdjacentPost, PostDetail } from '@wuh.site/shared-contracts'
```
删除本地第 25-32 行的 `type AdjacentPost` 和 `type PostDetail` 定义。

- [ ] **Step 12: 验证 TypeScript 编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 13: Commit**

```bash
git add packages/shared-contracts/src/index.ts packages/wuh.site.next/app/
git commit -m "refactor: 将重复 API 类型迁入 shared-contracts"
```

---

### Task 2: 实现 createService.ts

**Files:**
- Create: `packages/hooks/useFetch/createService.ts`
- Modify: `packages/hooks/useFetch/index.ts` (if exists, 否则创建 barrel)

- [ ] **Step 1: 创建 createService.ts 基础框架**

```ts
import { fetcher, type RequestOptions, type FetchResult, type FetchError } from './fetcher'
import { useRequest } from 'ahooks'

const API_BASE = process.env.NEST_API_URL || 'http://localhost:3200/v2'

// ---------- 类型 ----------

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type EndpointDef = {
  url: string
  method: HttpMethod
}

type EndpointsDef = Record<string, EndpointDef>

type ServiceOptions = {
  /** 全局错误处理 */
  onError?: (error: FetchError) => void
}

// ---------- 内部：路径参数替换 ----------

function resolveUrl(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/:(\w+)/g, (_, key) => {
    if (key in params) return String(params[key])
    return `:${key}`
  })
}

// ---------- 内部：server 调用 ----------

type ServerCallOptions<TQuery, TBody> = {
  query?: TQuery
  body?: TBody
  params?: Record<string, string | number>
  revalidate?: number
  headers?: Record<string, string>
}

async function serverCall<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  callOptions: ServerCallOptions<TQuery, TBody> = {}
): Promise<{ data: TResponse | null; error: FetchError | null; loading: false }> {
  const { query, body, params, revalidate, headers } = callOptions
  const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

  const fetcherOptions: RequestOptions<TBody> = {
    method: endpoint.method,
    headers: { 'Accept': 'application/json', ...headers },
    query: query as Record<string, unknown>,
    body,
  }

  if (revalidate !== undefined) {
    fetcherOptions.ext = { next: { revalidate } }
  }

  const result: FetchResult<TResponse> = await fetcher<TResponse>(url, fetcherOptions)

  if (!result.ok || !result.data) {
    return {
      data: null,
      error: result.error || { message: 'Request failed', status: 0 },
      loading: false,
    }
  }

  return { data: result.data, error: null, loading: false }
}

// ---------- 内部：use hook ----------

type UseCallOptions<TQuery, TBody> = {
  query?: TQuery
  body?: TBody
  params?: Record<string, string | number>
  headers?: Record<string, string>
  onError?: (error: FetchError) => void
}

function createUseHook<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  globalOnError?: (error: FetchError) => void
) {
  return function useEndpoint(callOptions: UseCallOptions<TQuery, TBody> = {}) {
    const { query, body, params, headers, onError: localOnError } = callOptions
    const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

    const onError = localOnError || globalOnError

    const result = useRequest<TResponse, []>(
      () =>
        fetcher<TResponse>(url, {
          method: endpoint.method,
          headers: { 'Accept': 'application/json', ...headers },
          query: query as Record<string, unknown>,
          body,
        }) as Promise<TResponse>,
      {
        onError: (e) => onError?.(e as FetchError),
      }
    )

    return {
      data: result.data ?? null,
      error: (result.error as FetchError) ?? null,
      loading: result.loading,
      run: result.run,
      refresh: result.refresh,
    }
  }
}

// ---------- defineService ----------

type ServiceEndpoint<TResponse = unknown, TQuery = Record<string, unknown>, TBody = unknown> = {
  server: (opts?: ServerCallOptions<TQuery, TBody>) => Promise<{ data: TResponse | null; error: FetchError | null; loading: false }>
  use: ReturnType<typeof createUseHook<TResponse, TQuery, TBody>>
}

type Service<T extends EndpointsDef> = {
  [K in keyof T]: ServiceEndpoint<any, any, any>
}

// ---------- 全局配置 ----------

let globalConfig: ServiceOptions = {}

export function configureService(config: ServiceOptions) {
  globalConfig = { ...globalConfig, ...config }
}

// ---------- 工厂 ----------

export function defineService<T extends EndpointsDef>(endpoints: T): Service<T> {
  const service: Record<string, ServiceEndpoint> = {}

  for (const [key, endpoint] of Object.entries(endpoints)) {
    service[key] = {
      server: (opts) => serverCall(endpoint, opts),
      use: createUseHook(endpoint, globalConfig.onError),
    }
  }

  return service as Service<T>
}
```

- [ ] **Step 2: 检查 createService.ts 是否有未使用的 import**

确认文件中没有未使用的 import（如 `FetchResult` 只用于类型标注，确认已正确使用）

- [ ] **Step 3: Commit**

```bash
git add packages/hooks/useFetch/createService.ts
git commit -m "feat: 新增 createService — 声明式 API 端点定义与双通道调用"
```

---

### Task 3: 创建 endpoints.ts 端点声明

**Files:**
- Create: `packages/shared-contracts/src/endpoints.ts`
- Modify: `packages/shared-contracts/tsconfig.build.json` — 排除 endpoints.ts

> 注意：`endpoints.ts` 用相对路径 import `packages/hooks/useFetch/createService.ts`。由于 Next.js 直接通过 path alias import shared-contracts 源码（不经过 build），运行时没问题。但 shared-contracts 自己的 `tsc -p tsconfig.build.json` 找不到 hooks 模块，需要排除 endpoints.ts。

- [ ] **Step 1: 修改 shared-contracts/tsconfig.build.json 排除 endpoints.ts**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["src/endpoints.ts"]
}
```

- [ ] **Step 2: 创建 shared-contracts/src/endpoints.ts**

```ts
import { defineService, configureService } from '../../hooks/useFetch/createService'

// ---- 全局错误处理（客户端入口调用一次即可） ----
configureService({
  onError: (error) => {
    console.error('[API]', error.message, error.status)
  },
})

// ---- 端点定义 ----

export const contentService = defineService({
  getPosts:    { url: '/content/posts',       method: 'GET' },
  getPost:     { url: '/content/posts/:slug', method: 'GET' },
  getProjects: { url: '/content/projects',    method: 'GET' },
})

export const reposService = defineService({
  getAll: { url: '/repos', method: 'GET' },
})

export const commentsService = defineService({
  getByIssue: { url: '/comments', method: 'GET' },
})

export const wereadService = defineService({
  getBooks: { url: '/weread/books', method: 'GET' },
})
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add packages/shared-contracts/src/endpoints.ts packages/shared-contracts/tsconfig.build.json
git commit -m "feat: 声明 API 端点 — content/repos/comments/weread services"
```

---

### Task 4: 试点替换 /weread

**Files:**
- Modify: `packages/wuh.site.next/app/weread/page.tsx`
- Modify: `packages/wuh.site.next/app/weread/WereadView.tsx`

- [ ] **Step 1: 替换 app/weread/page.tsx 的数据获取**

```tsx
import type { Metadata } from 'next'
import { wereadService } from '@wuh.site/shared-contracts/endpoints'
import type { WereadBook } from '@wuh.site/shared-contracts'
import WereadView from './WereadView'

const SITE_URL = 'https://wuh.site'
const PER_PAGE = 10

export const metadata: Metadata = {
  title: '微信读书 · wuh.site',
  description: 'stack-wuh 的微信读书书架',
  alternates: { canonical: `${SITE_URL}/weread` },
  openGraph: {
    title: '微信读书 · wuh.site',
    description: 'stack-wuh 的微信读书书架',
    url: `${SITE_URL}/weread`,
    siteName: 'wuh.site',
    type: 'website',
  },
}

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getBooks(page: number) {
  const { data, error } = await wereadService.getBooks.server({
    query: { page: String(page), limit: String(PER_PAGE) },
    revalidate: 3600,
  })

  if (error || !data) {
    return { books: [] as WereadBook[], total: 0, currentPage: page, totalPages: 1 }
  }

  const result = data as any
  return {
    books: (result.data || []) as WereadBook[],
    total: result.pagination?.total || 0,
    currentPage: result.pagination?.page || page,
    totalPages: result.pagination?.totalPages || 1,
  }
}

export default async function Page({
  searchParams
}: {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = toPageNumber(resolvedSearchParams?.page)
  const { books, total, totalPages } = await getBooks(currentPage)

  return <WereadView books={books} total={total} currentPage={currentPage} totalPages={totalPages} />
}
```

删除 `import api from '../lib/api'`。

- [ ] **Step 2: 更新 WereadView.tsx — 确保类型从 shared-contracts 导入**

```tsx
import type { WereadBook } from '@wuh.site/shared-contracts'

type Props = {
  books: WereadBook[]
  total: number
  currentPage: number
  totalPages: number
}
```

删除本地 `type Book = {...}` 定义。

- [ ] **Step 3: 验证编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/weread/
git commit -m "refactor(weread): 改用 wereadService 请求，类型从 shared-contracts 导入"
```

---

### Task 5: 替换 blog 页面

**Files:**
- Modify: `packages/wuh.site.next/app/blog/page.tsx`
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx`

- [ ] **Step 1: 替换 app/blog/page.tsx**

```tsx
import type { Metadata } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, PostListItem } from '@wuh.site/shared-contracts'
import BlogListView from './BlogListView'

const SITE_URL = 'https://wuh.site'
const PER_PAGE = 10

export const metadata: Metadata = {
  title: '博客 · wuh.site',
  description: '收录 GitHub Issues 中的全部博客文章',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'wuh.site 博客',
    description: '收录 GitHub Issues 中的全部博客文章',
    url: `${SITE_URL}/blog`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'wuh.site 博客',
    description: '收录 GitHub Issues 中的全部博客文章',
  },
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getIssues(page: number) {
  const { data, error } = await contentService.getPosts.server({
    query: { page: String(page), limit: String(PER_PAGE), state: 'open' },
    revalidate: 600,
  })

  if (error || !data) {
    return {
      posts: [] as PostListItem[],
      pagination: { currentPage: page, lastPage: page, hasPrev: page > 1, hasNext: false }
    }
  }

  const result = data as any
  const { pagination } = result
  return {
    posts: result.data.map(mapContentToPost) as PostListItem[],
    pagination: {
      currentPage: pagination.page,
      lastPage: pagination.totalPages,
      hasPrev: pagination.hasPreviousPage,
      hasNext: pagination.hasNextPage,
    },
  }
}

export default async function Page({
  searchParams
}: {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = toPageNumber(resolvedSearchParams?.page)
  const { posts, pagination } = await getIssues(currentPage)

  return <BlogListView posts={posts} pagination={pagination} />
}
```

删除 `import api from '../lib/api'`。

- [ ] **Step 2: 更新 BlogListView.tsx 类型**

删除本地 `PostItem` 类型定义，从 shared-contracts 导入 `PostListItem`：
```tsx
import type { PostListItem } from '@wuh.site/shared-contracts'
```
`groupByYear(posts: PostItem[])` → `groupByYear(posts: PostListItem[])`

- [ ] **Step 3: 验证编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/blog/
git commit -m "refactor(blog): 改用 contentService 请求，类型从 shared-contracts 导入"
```

---

### Task 6: 替换首页 home

**Files:**
- Modify: `packages/wuh.site.next/app/page.tsx`

- [ ] **Step 1: 替换 app/page.tsx**

```tsx
import { Metadata } from 'next'
import { contentService, reposService, wereadService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, PostListItem, RepoDto, WereadBook } from '@wuh.site/shared-contracts'
import HomeView from './HomeView'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: 'wuh.site · 朝朝如念',
  description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'wuh.site · 朝朝如念',
    description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
    url: SITE_URL,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'wuh.site · 朝朝如念',
    description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
  },
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

async function getRepos(): Promise<RepoDto[]> {
  const { data } = await reposService.getAll.server({ revalidate: 3600 })
  if (!data) return []
  return (data as any).repos.slice(0, 6) as RepoDto[]
}

async function getFeaturedIssues(): Promise<PostListItem[]> {
  const { data } = await contentService.getPosts.server({
    query: { limit: '6', state: 'open' },
    revalidate: 1800,
  })
  if (!data) return []
  return (data as any).data.map(mapContentToPost) as PostListItem[]
}

async function getYearlySummaries(): Promise<PostListItem[]> {
  const { data } = await contentService.getPosts.server({
    query: { limit: '50', state: 'open' },
    revalidate: 1800,
  })
  if (!data) return []
  return (data as any).data
    .map(mapContentToPost)
    .filter((post: PostListItem) => post.title.includes('年度总结'))
    .slice(0, 3) as PostListItem[]
}

async function getWereadBooks(): Promise<WereadBook[]> {
  const { data } = await wereadService.getBooks.server({
    query: { page: '5', limit: '10' },
    revalidate: 3600,
  })
  if (!data) return []
  return ((data as any).data || []) as WereadBook[]
}

export default async function Home() {
  const [repos, posts, yearlySummaries, wereadBooks] = await Promise.all([
    getRepos(),
    getFeaturedIssues(),
    getYearlySummaries(),
    getWereadBooks(),
  ])
  return <HomeView repos={repos} posts={posts} yearlySummaries={yearlySummaries} wereadBooks={wereadBooks} />
}
```

删除 `import api from './lib/api'`。

- [ ] **Step 2: 验证编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: Commit**

```bash
git add packages/wuh.site.next/app/page.tsx
git commit -m "refactor(home): 改用 contentService/reposService/wereadService 请求"
```

---

### Task 7: 替换 post 详情页和 sitemap

**Files:**
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx`
- Modify: `packages/wuh.site.next/app/sitemap.ts`

- [ ] **Step 1: 替换 app/post/[number]/page.tsx**

```tsx
import { cache } from 'react'
import type { Metadata } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import { renderMarkdown } from '../../lib/markdown'
import type { ContentItem, AdjacentPost } from '@wuh.site/shared-contracts'
import PostView from '../PostView'
import type { Issue } from '../PostView.types'
import JsonLd from '../../components/JsonLd'

const SITE_URL = 'https://wuh.site'

function buildDescription(issue: Issue): string {
  if (issue.metadata?.summary) return issue.metadata.summary
  if (issue.body) {
    const plain = issue.body.replace(/[#*`\[\]()>!|-]/g, '').replace(/\s+/g, ' ').trim()
    return plain.length > 160 ? plain.slice(0, 157) + '...' : plain
  }
  return '阅读这篇博客文章'
}

const FALLBACK_METADATA: Metadata = {
  title: '博客详情 · wuh.site',
  description: '阅读这篇博客文章',
}

const mapContentToIssue = (item: ContentItem): Issue => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/stack-wuh/blog/issues/${item.number}`,
  repository_url: 'https://api.github.com/repos/stack-wuh/blog',
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  updated_at: item.updatedAtGitHub || item.createdAtGitHub || '',
  user: item.author ? {
    login: item.author.login,
    userName: item.author.login,
    avatarUrl: item.author.avatarUrl || null,
  } : null,
  labels: item.labels.map((l) => ({ name: l })),
  body: item.body || '',
  body_html: item.bodyHtml || '',
  metadata: item.metadata ? {
    cover: item.metadata.cover || null,
    summary: item.metadata.summary || null,
    slug: item.metadata.slug || null,
    keywords: item.metadata.keywords || null,
  } : null,
})

type IssueData = {
  issue: Issue | null
  prev: AdjacentPost
  next: AdjacentPost
  total: number
  position: number
}

const getIssue = cache(async (num: string): Promise<IssueData> => {
  const { data, error } = await contentService.getPost.server({
    params: { slug: num },
    revalidate: 1800,
  })

  if (error || !data) {
    return { issue: null, prev: null, next: null, total: 0, position: 0 }
  }

  const content = data as any
  const issue = mapContentToIssue(content)
  if (issue.body) {
    issue.body_html = await renderMarkdown(issue.body)
  }
  return {
    issue,
    prev: content.prev ? { number: content.prev.number, title: content.prev.title } : null,
    next: content.next ? { number: content.next.number, title: content.next.title } : null,
    total: content.total,
    position: content.position,
  }
})

// generateMetadata 和 Page 组件保持不变（仅改 import）
```

> 注意：post 详情页的 `generateMetadata` 和 `Page` 组件逻辑不变，只替换 import 和数据获取函数的实现。

删除 `import api from '../../lib/api'`。

- [ ] **Step 2: 替换 app/sitemap.ts**

```ts
import { type MetadataRoute } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'

const SITE_URL = 'https://wuh.site'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/design/system-color`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await contentService.getPosts.server({
    query: { limit: '9999', state: 'open' },
  })

  if (error || !data) {
    console.error('[sitemap] Failed to fetch posts from API:', error)
    return staticRoutes
  }

  const result = data as any
  const postRoutes: MetadataRoute.Sitemap = (result.data || []).map((post: any) => ({
    url: `${SITE_URL}/post/${post.number}`,
    lastModified: new Date(post.updatedAtGitHub || post.createdAtGitHub),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes]
}
```

删除 `import api from './lib/api'`。

- [ ] **Step 3: 验证编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/post/ packages/wuh.site.next/app/sitemap.ts
git commit -m "refactor(post,sitemap): 改用 contentService 请求"
```

---

### Task 8: 替换客户端组件

**Files:**
- Modify: `packages/wuh.site.next/app/components/AppProviders.tsx`
- Modify: `packages/wuh.site.next/app/components/player/GlobalAudioPlayer.tsx`

- [ ] **Step 1: 替换 AppProviders.tsx 的 resolveTrackSource**

只改 `resolveTrackSource`，从 `useCallback` + 裸 fetch 改为 `useRequest` 的 `runAsync`：

```tsx
// 旧代码（删除）：
import { useCallback, useRef } from 'react'
...
const resolveTrackSource = useCallback(async (trackId: number) => {
  const response = await fetch(`/api/music/track?id=${trackId}`)
  if (!response.ok) throw new Error('无法获取音频资源')
  return response.json()
}, [])

// 新代码（替换）：
import { useRef } from 'react'  // 去掉 useCallback
import { useEventListener, useExternal, useRequest } from 'ahooks'  // 加 useRequest
...
const { runAsync: resolveTrackSource } = useRequest(
  async (trackId: number) => {
    const response = await fetch(`/api/music/track?id=${trackId}`)
    if (!response.ok) throw new Error('无法获取音频资源')
    return response.json()
  },
  { manual: true }
)
```

其余代码不变。

- [ ] **Step 2: 替换 GlobalAudioPlayer.tsx 的歌单加载**

```tsx
'use client'

import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import {
  AudioMiniPlayer,
  AudioPlayerPanel,
  useAudioPlayer,
  type Track
} from '@wuh.site/components/audio-player'

const FALLBACK_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

export const GlobalAudioPlayer = () => {
  const {
    queue,
    actions: { loadQueue }
  } = useAudioPlayer()
  const playlistId = FALLBACK_PLAYLIST_ID

  const { run: fetchPlaylist } = useRequest(
    async (id: string) => {
      const res = await fetch(`/api/music/playlist?playlistId=${id}`)
      if (!res.ok) throw new Error('无法加载歌单')
      return res.json()
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (Array.isArray(data?.tracks) && data.tracks.length) {
          const normalized: Track[] = data.tracks.map((track: Track) => ({
            ...track,
            duration: typeof track.duration === 'number' ? track.duration : undefined
          }))
          loadQueue(normalized)
        }
      },
      onError: (error) => {
        if ((error as Error).name === 'AbortError') return
        console.error('[player] 歌单初始化失败', error)
      },
    }
  )

  useEffect(() => {
    if (queue.length > 0) return
    const idleId = requestIdleCallback(() => fetchPlaylist(playlistId), { timeout: 2000 })
    return () => {
      cancelIdleCallback(idleId)
    }
  }, [queue.length, fetchPlaylist, playlistId])

  return (
    <>
      <AudioMiniPlayer />
      <AudioPlayerPanel />
    </>
  )
}
```

> 注意：AbortController 移除 — ahooks `useRequest` 内部管理请求取消（组件卸载时自动取消）。原代码中的 `cancelled` 变量也由 `onError` 中检查 `AbortError` 替代。

- [ ] **Step 3: 验证编译**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/components/
git commit -m "refactor(player): 客户端裸 fetch 改为 useRequest"
```

---

### Task 9: 清理

**Files:**
- Delete: `packages/wuh.site.next/app/lib/api.ts`
- Delete: `packages/hooks/useFetch/useFetch.ts`

- [ ] **Step 1: 确认 api.ts 无残留引用**

Run: `cd packages/wuh.site.next && grep -r "from.*['\"].*\/api['\"]\|from.*['\"].*\/lib\/api['\"]" app/ --include="*.ts" --include="*.tsx"`
Expected: 无输出

- [ ] **Step 2: 确认 useFetch.ts 无残留引用**

Run: `cd packages/wuh.site.next && grep -r "from.*useFetch" app/ --include="*.ts" --include="*.tsx"`
Expected: 无输出

- [ ] **Step 3: 删除文件**

```bash
rm packages/wuh.site.next/app/lib/api.ts
rm packages/hooks/useFetch/useFetch.ts
```

- [ ] **Step 4: 最终验证 — TypeScript 类型检查**

Run: `cd packages/wuh.site.next && pnpm exec tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 5: 最终验证 — Next.js build**

Run: `cd packages/wuh.site.next && pnpm build:next`
Expected: 构建成功

- [ ] **Step 6: Commit**

```bash
git rm packages/wuh.site.next/app/lib/api.ts packages/hooks/useFetch/useFetch.ts
git commit -m "chore: 删除废弃的 api.ts 和 useFetch.ts"
```

---

## 依赖关系

```
Task 1 (类型迁移) ──┐
                    ├──> Task 4 (试点 /weread) ──> Task 5 (blog) ──> Task 6 (home) ──> Task 7 (post/sitemap)
Task 2 (createService) ──┤
                    │
Task 3 (endpoints) ──┘
                                                        │
                                                        └──> Task 8 (客户端组件)
                                                                  │
                                                                  └──> Task 9 (清理)
```

- Task 1-3 互相独立，可并行
- Task 4-7 依赖 Task 1-3 完成
- Task 8 依赖 Task 3 完成（但客户端组件不依赖 shared-contracts 类型，可独立做）
- Task 9 依赖所有前序任务完成
