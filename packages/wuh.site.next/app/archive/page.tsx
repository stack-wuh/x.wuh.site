import type { Metadata } from 'next'
import Empty from '@wuh.site/components/empty'
import Tag from '@wuh.site/components/tag'
import { IconBookOpen } from '@wuh.site/components/icons'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, PostListItem } from '@wuh.site/shared-contracts'
import BackHomeLink from '@/app/components/BackHomeLink'
import { buildPostUrl } from '@/app/lib/slug'
import { buildTopicUrl } from '@/app/lib/topic-url'
import { formatShortDate } from '@/app/lib/date'
import * as S from '@/app/blog/styles'

const SITE_URL = 'https://wuh.site'
const ARCHIVE_PAGE_SIZE = 100

export const metadata: Metadata = {
  title: '归档',
  description: '按年份浏览 wuh.site 的全部博客文章。',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/archive` },
  openGraph: {
    title: 'wuh.site 文章归档',
    description: '按年份浏览 wuh.site 的全部博客文章。',
    url: `${SITE_URL}/archive`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'wuh.site 文章归档',
    description: '按年份浏览 wuh.site 的全部博客文章。',
  },
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: item.viewCount ?? 0,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((label) => ({ name: label })),
})

function groupPostsByYear(posts: PostListItem[]) {
  const map = new Map<number, PostListItem[]>()
  posts.forEach((post) => {
    const year = new Date(post.created_at).getFullYear()
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  })
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
}

async function getArchivePosts() {
  const posts: PostListItem[] = []
  let page = 1

  while (true) {
    const { data, error } = await contentService.getPosts.server({
      query: { page: String(page), limit: String(ARCHIVE_PAGE_SIZE), state: 'open' },
      revalidate: 3600,
    })

    if (error || !data) {
      throw new Error(`Failed to load archive posts on page ${page}`)
    }

    const result = data as any
    posts.push(...(((result.data || []) as ContentItem[]).map(mapContentToPost)))

    if (!result.pagination?.hasNextPage) break
    page += 1
  }

  return posts
}

export default async function ArchivePage() {
  const posts = await getArchivePosts()
  const yearGroups = groupPostsByYear(posts)

  return (
    <S.Root>
      <S.Main>
        <S.Header>
          <S.TitleGroup>
            <S.Title>文章归档</S.Title>
            <S.Subtitle>按年份浏览全部 {posts.length} 篇博客文章</S.Subtitle>
          </S.TitleGroup>
          <S.HeaderActions>
            <BackHomeLink href='/blog' label='返回博客' />
          </S.HeaderActions>
        </S.Header>

        {posts.length === 0 ? (
          <Empty icon={<IconBookOpen />} title='暂无归档' description='暂时没有可展示的博客文章' actions={[{ label: '返回博客', href: '/blog' }]} />
        ) : (
          <S.Timeline>
            {yearGroups.map(([year, yearPosts]) => (
              <S.YearGroup key={year}>
                <S.YearLabel>{year}</S.YearLabel>
                {yearPosts.map((post) => (
                  <S.PostRow key={post.id}>
                    <S.InkDot />
                    <S.PostTitleLink href={buildPostUrl(post.number, post.title)}>
                      <span>{post.title}</span>
                    </S.PostTitleLink>
                    <S.IssueNumber>#{post.number}</S.IssueNumber>
                    {post.labels?.length > 0 && (
                      <S.PostTags>
                        {post.labels.slice(0, 3).map((label) => (
                          <S.PostTagLink key={`${post.id}-${label.name}`} href={buildTopicUrl(label.name)} aria-label={`查看 ${label.name} 主题文章`}>
                            <Tag label={label.name} color={label.color} />
                          </S.PostTagLink>
                        ))}
                      </S.PostTags>
                    )}
                    <S.PostMeta>
                      <span>{formatShortDate(post.created_at)}</span>
                      <S.MetaDot />
                      <span>{post.views} 浏览</span>
                    </S.PostMeta>
                  </S.PostRow>
                ))}
              </S.YearGroup>
            ))}
          </S.Timeline>
        )}
      </S.Main>
    </S.Root>
  )
}
