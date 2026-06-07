'use client'

import { useMemo } from 'react'
import Tag from '@wuh.site/components/tag'
import Pagination from '@wuh.site/components/pagination'
import TitleWithTooltip from './components/TitleWithTooltip'
import type { PostListItem } from '@wuh.site/shared-contracts'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type TagItem = {
  name: string
  color?: string | null
}

type Props = {
  posts: PostListItem[]
  pagination: { currentPage: number; lastPage: number }
}

const groupByYear = (posts: PostListItem[]) => {
  const map = new Map<number, PostListItem[]>()
  posts.forEach(post => {
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

/**
 * 博客列表视图，按年份分组展示博客文章，支持分页。
 */
export default function BlogListView({ posts, pagination }: Props) {
  const yearGroups = useMemo(() => groupByYear(posts), [posts])

  return (
    <S.Root>
      <S.Main>
        <S.Header>
          <S.TitleGroup>
            <S.Title>全部博客</S.Title>
            <S.Subtitle>收录 GitHub Issues 中的全部博客文章</S.Subtitle>
          </S.TitleGroup>
          <S.HeaderActions>
            <S.BackLink href='/'>返回首页</S.BackLink>
          </S.HeaderActions>
        </S.Header>

        {posts.length === 0 ? (
          <S.EmptyHint>暂时没有可展示的博客内容</S.EmptyHint>
        ) : (
          <S.Timeline>
            {yearGroups.map(([year, yearPosts]) => (
              <S.YearGroup key={year}>
                <S.YearLabel>{year}</S.YearLabel>
                {yearPosts.map(post => (
                  <S.PostRow key={post.id} href={`/post/${post.number}`}>
                    <S.InkDot />
                    <TitleWithTooltip text={post.title} />
                    <S.IssueNumber>#{post.number}</S.IssueNumber>
                    {post.labels?.length > 0 && (
                      <S.PostTags>
                        {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                          <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                        ))}
                      </S.PostTags>
                    )}
                    <S.PostMeta>
                      <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      <S.MetaDot />
                      <span>{post.comments}</span>
                    </S.PostMeta>
                  </S.PostRow>
                ))}
              </S.YearGroup>
            ))}
          </S.Timeline>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          getPageUrl={(page) => (page <= 1 ? '/blog' : `/blog?page=${page}`)}
        />
      </S.Main>
    </S.Root>
  )
}
