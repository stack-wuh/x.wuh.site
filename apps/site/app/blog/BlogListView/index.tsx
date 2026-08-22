'use client'

import { useEffect, useMemo, useState } from 'react'
import Tag from '@wuh.site/components/tag'
import Pagination from '@wuh.site/components/pagination'
import Empty from '@wuh.site/components/empty'
import { IconBookOpen } from '@wuh.site/components/icons'
import TitleWithTooltip from '../components/TitleWithTooltip'
import BackHomeLink from '@/app/components/BackHomeLink'
import type { ContentLabelSummary, PostListItem } from '@wuh.site/core'
import { contentService } from '@wuh.site/core/endpoints'
import { buildPostUrl } from '../../lib/slug'
import { buildTopicUrl } from '../../lib/topic-url'
import { formatShortDate } from '../../lib/date'
import { buildBlogUrl, formatFilterOptionLabel, getFilterSummaryLabel, toggleLabel } from '../blog-filter-utils'
import * as S from './styles'
import { TAG_DISPLAY_LIMIT, type BlogListViewProps } from './specs'

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

export default function BlogListView({ posts, pagination, activeLabels, availableLabels }: BlogListViewProps) {
  const [loadedLabels, setLoadedLabels] = useState<ContentLabelSummary[]>(availableLabels)
  const { data: labelsData } = contentService.getLabels.use({ query: { state: 'open' } })
  useEffect(() => {
    if (Array.isArray(labelsData)) setLoadedLabels(labelsData as ContentLabelSummary[])
  }, [labelsData])

  const yearGroups = useMemo(() => groupByYear(posts), [posts])
  const hasLabels = loadedLabels.length > 0
  const filteredTotal = pagination.total ?? posts.length

  return (
    <S.Root>
      <S.Main>
        <S.Header>
          <S.TitleGroup>
            <S.Title>全部博客</S.Title>
            <S.Subtitle>收录 GitHub Issues 中的全部博客文章</S.Subtitle>
          </S.TitleGroup>
          <S.HeaderActions>
            <BackHomeLink href='/' />
          </S.HeaderActions>
        </S.Header>

        <S.FilterBar aria-label='博客分类过滤'>
          <S.FilterToolbar>
            <S.FilterMenu>
              <S.FilterSummary>{getFilterSummaryLabel(loadedLabels, activeLabels, filteredTotal)}</S.FilterSummary>
              <S.FilterMenuList>
                {hasLabels ? (
                  loadedLabels.map(label => (
                    <S.FilterOption
                      key={label.name}
                      href={buildBlogUrl(1, toggleLabel(activeLabels, label.name))}
                      $active={activeLabels.includes(label.name)}
                    >
                      <span>{formatFilterOptionLabel(label)}</span>
                    </S.FilterOption>
                  ))
                ) : (
                  <S.FilterEmpty>暂无分类</S.FilterEmpty>
                )}
              </S.FilterMenuList>
            </S.FilterMenu>
            {activeLabels.map((label) => (
              <S.FilterToken
                key={label}
                href={buildBlogUrl(1, activeLabels.filter((item) => item !== label))}
                aria-label={`清除 ${label} 分类筛选`}
              >
                {label}
                <span aria-hidden='true'>×</span>
              </S.FilterToken>
            ))}
          </S.FilterToolbar>
        </S.FilterBar>

        {posts.length === 0 ? (
          <Empty icon={<IconBookOpen />} title='暂无内容' description='暂时没有可展示的博客' actions={[{ label: '返回首页', href: '/' }]} />
        ) : (
          <S.Timeline>
            {yearGroups.map(([year, yearPosts]) => (
              <S.YearGroup key={year}>
                <S.YearLabel>{year}</S.YearLabel>
                {yearPosts.map(post => (
                  <S.PostRow key={post.id}>
                    <S.InkDot />
                    <S.PostTitleLink href={buildPostUrl(post.number)}>
                      <TitleWithTooltip text={post.title} />
                    </S.PostTitleLink>
                    <S.IssueNumber>#{post.number}</S.IssueNumber>
                    {post.labels?.length > 0 && (
                      <S.PostTags>
                        {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
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

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          getPageUrl={(page) => buildBlogUrl(page, activeLabels)}
        />
      </S.Main>
    </S.Root>
  )
}
