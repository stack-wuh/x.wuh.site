# sitemap 站点地图

> 原始变更名：`20260510_P_sitemap`

## 元数据
- 日期：2026-05-10
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/sitemap/spec.md`

## 决策
# 设计：sitemap 站点地图

## 方案

### 1. sitemap.ts

使用 Next.js 15 内置 `MetadataRoute.Sitemap` 类型：

```ts
import { type MetadataRoute } from 'next'
import api from './lib/api'

const SITE_URL = 'https://wuh.site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面 + 动态博客详情
}
```

**静态条目**：

```ts
const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/design/system-color`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]
```

**动态条目**：通过 `api.content.getPosts()` 全量拉取，映射 `updatedAtGitHub` 为 `lastModified`：

```ts
const { data: posts } = await api.content.getPosts({ limit: 9999, state: 'open' })
const postRoutes = posts.map((post) => ({
  url: `${SITE_URL}/post/${post.number}`,
  lastModified: new Date(post.updatedAtGitHub || post.createdAtGitHub),
  changeFrequency: 'weekly' as const,
  priority: 0.6,
}))
```

`limit` 设为足够大的值覆盖全部文章（当前实际文章量远小于此值），避免实现分页拉取逻辑。

### 2. robots.ts

```ts
import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://wuh.site/sitemap.xml',
  }
}
```

### 3. 数据获取

复用现有 `api.content.getPosts()` ，不新建数据源。该函数已支持 ISR revalidate，sitemap 请求会走 Next.js 服务端的 fetch 缓存。

## 路由覆盖

| 路径 | 类型 | priority | changeFrequency |
|------|------|----------|-----------------|
| `/` | 静态 | 1.0 | daily |
| `/blog` | 静态 | 0.8 | daily |
| `/about` | 静态 | 0.5 | monthly |
| `/design/system-color` | 静态 | 0.3 | monthly |
| `/post/[number]` | 动态 | 0.6 | weekly |

## 依赖

- 零新依赖，仅使用 Next.js 内置 `MetadataRoute` 类型
- 数据复用现有 `app/lib/api.ts`

## 任务
### Phase 1 — sitemap + robots 创建
- [ ] T1: 创建 `app/robots.ts`
- [ ] T2: 创建 `app/sitemap.ts`
### Phase 2 — 验证
- [ ] T3: 验证 `/sitemap.xml` 和 `/robots.txt` 可正常访问

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: sitemap 站点地图
change: sitemap
date: 2026-05-10
type: P
status: applied
```

### `design.md`
# 设计：sitemap 站点地图

## 方案

### 1. sitemap.ts

使用 Next.js 15 内置 `MetadataRoute.Sitemap` 类型：

```ts
import { type MetadataRoute } from 'next'
import api from './lib/api'

const SITE_URL = 'https://wuh.site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面 + 动态博客详情
}
```

**静态条目**：

```ts
const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/design/system-color`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]
```

**动态条目**：通过 `api.content.getPosts()` 全量拉取，映射 `updatedAtGitHub` 为 `lastModified`：

```ts
const { data: posts } = await api.content.getPosts({ limit: 9999, state: 'open' })
const postRoutes = posts.map((post) => ({
  url: `${SITE_URL}/post/${post.number}`,
  lastModified: new Date(post.updatedAtGitHub || post.createdAtGitHub),
  changeFrequency: 'weekly' as const,
  priority: 0.6,
}))
```

`limit` 设为足够大的值覆盖全部文章（当前实际文章量远小于此值），避免实现分页拉取逻辑。

### 2. robots.ts

```ts
import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://wuh.site/sitemap.xml',
  }
}
```

### 3. 数据获取

复用现有 `api.content.getPosts()` ，不新建数据源。该函数已支持 ISR revalidate，sitemap 请求会走 Next.js 服务端的 fetch 缓存。

## 路由覆盖

| 路径 | 类型 | priority | changeFrequency |
|------|------|----------|-----------------|
| `/` | 静态 | 1.0 | daily |
| `/blog` | 静态 | 0.8 | daily |
| `/about` | 静态 | 0.5 | monthly |
| `/design/system-color` | 静态 | 0.3 | monthly |
| `/post/[number]` | 动态 | 0.6 | weekly |

## 依赖

- 零新依赖，仅使用 Next.js 内置 `MetadataRoute` 类型
- 数据复用现有 `app/lib/api.ts`

### `proposal.md`
# sitemap 站点地图

## 为什么做

当前站点没有任何 sitemap.xml 或 robots.txt，Google 爬虫只能靠页面内链接发现内容，抓取效率低、遗漏风险高。需要为所有可索引页面生成标准化站点地图，提升 SEO 可见性。

## 做什么

- 创建 `app/sitemap.ts` — Next.js 15 内置 `MetadataRoute.Sitemap`，涵盖静态页面和动态博客详情页
- 创建 `app/robots.ts` — 指向 sitemap URL

## 覆盖范围

**静态页面**（4个）：
- `/` — 首页（priority: 1.0）
- `/blog` — 博客列表（priority: 0.8）
- `/about` — 关于页（priority: 0.5）
- `/design/system-color` — 配色演示（priority: 0.3）

**动态页面**（N个）：
- `/post/[number]` — 博客详情，通过 `api.content.getPosts()` 全量拉取，`updatedAtGitHub` 作为 `lastModified`

## 影响范围

- `packages/wuh.site.next/app/sitemap.ts` — 新增
- `packages/wuh.site.next/app/robots.ts` — 新增
- 无现有文件修改

## 不改什么

- 不包含博客分页页面（`/blog?page=2` 等），Google 不建议在 sitemap 中列出分页
- 不包含 API 路由（`/api/music/*`）
- 不改变现有 metadata 配置

### `specs/sitemap/spec.md`
# Spec: sitemap

## ADDED

### Requirement: 站点地图生成

GIVEN 站点部署到 https://wuh.site
WHEN Googlebot 或其他爬虫请求 `/sitemap.xml`
THEN 返回包含所有可索引页面的标准 XML 站点地图
AND 每个 URL 条目包含 `lastModified`、`changeFrequency`、`priority`

### Requirement: robots.txt 引导

GIVEN 站点正常运行
WHEN 爬虫请求 `/robots.txt`
THEN 返回包含 `Sitemap: https://wuh.site/sitemap.xml` 的 robots 文件
AND `User-agent: *` 允许所有爬虫抓取全部路径

### Requirement: 静态页面索引

GIVEN sitemap.xml 生成
WHEN 检查 URL 列表
THEN 包含 `/`、`/blog`、`/about`、`/design/system-color` 四个静态页面
AND 各自带有合理的 `priority` 和 `changeFrequency`

### Requirement: 动态博客详情索引

GIVEN api.content.getPosts() 正常返回文章数据
WHEN sitemap.ts 执行
THEN 为每篇 `state: 'open'` 的文章生成 `/post/[number]` 条目
AND `lastModified` 使用 `updatedAtGitHub` 字段

### `tasks.md`
# 任务拆分

## Phase 1 — sitemap + robots 创建

- [ ] T1: 创建 `app/robots.ts`
  - 涉及文件: `packages/wuh.site.next/app/robots.ts`
  - 产出: `MetadataRoute.Robots` 配置，指向 sitemap URL

- [ ] T2: 创建 `app/sitemap.ts`
  - 涉及文件: `packages/wuh.site.next/app/sitemap.ts`
  - 产出: 静态页面 + 动态博客详情的 `MetadataRoute.Sitemap`

## Phase 2 — 验证

- [ ] T3: 验证 `/sitemap.xml` 和 `/robots.txt` 可正常访问
  - `next dev` 后 curl 验证 XML 格式和 robots 内容
