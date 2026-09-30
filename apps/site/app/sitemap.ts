import { type MetadataRoute } from 'next'
import { contentService } from '@wuh.site/core/endpoints'
import {
  buildPostSitemapEntry,
  buildStaticSitemapRoutes,
  buildTopicSitemapEntry,
  type SitemapPost,
  type SitemapTopic,
} from './lib/sitemap-utils'

// Docker build 阶段容器内没有 nest 服务，静态生成的 Metadata Route 会把「fetch 失败
// 的部分结果」烘焙进产物（与首页同一失效模式）。必须运行时生成；上游不可用时整体
// 返回 500，而不是静默输出只剩静态路由的残缺 sitemap。
export const dynamic = 'force-dynamic'

const SITEMAP_PAGE_SIZE = 100

type SitemapLabelsResponse = SitemapTopic[]

type SitemapPostsResponse = {
  data: SitemapPost[]
  pagination?: {
    hasNextPage?: boolean
  }
}

function logSitemapFetchError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error)
  process.stderr.write(`[sitemap] Failed to fetch ${scope}: ${message}\n`)
}

async function getOpenLabels(): Promise<SitemapTopic[]> {
  const { data, error } = await contentService.getLabels.server({
    query: { state: 'open' },
    revalidate: 3600,
  })

  if (error || !data) {
    logSitemapFetchError('open labels', error || new Error('empty response'))
    throw new Error('sitemap upstream fetch failed: open labels')
  }

  return (data as SitemapLabelsResponse).filter((label) => label.name?.trim())
}

async function getPublishedPosts(): Promise<SitemapPost[]> {
  const posts: SitemapPost[] = []
  let page = 1

  while (true) {
    const { data, error } = await contentService.getPosts.server({
      query: {
        page: String(page),
        limit: String(SITEMAP_PAGE_SIZE),
        state: 'open',
      },
      revalidate: 3600,
    })

    if (error || !data) {
      logSitemapFetchError(`open posts page ${page}`, error || new Error('empty response'))
      throw new Error('sitemap upstream fetch failed: open posts')
    }

    const result = data as SitemapPostsResponse
    posts.push(...(result.data || []))

    if (!result.pagination?.hasNextPage) break
    page += 1
  }

  return posts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [labels, posts] = await Promise.all([getOpenLabels(), getPublishedPosts()])
  return [
    ...buildStaticSitemapRoutes(),
    ...labels.map(buildTopicSitemapEntry),
    ...posts.map(buildPostSitemapEntry),
  ]
}
