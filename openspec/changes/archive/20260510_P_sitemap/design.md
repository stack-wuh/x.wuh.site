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
