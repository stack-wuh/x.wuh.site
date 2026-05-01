'use client'

import Link from 'next/link'
import Tag from '@wuh.site/components/tag'
import type { Issue } from '../PostView.types'
import {
  CoverImage,
  AuthorRow,
  AuthorAvatar,
  AuthorInfo,
  Header,
  Title,
  MetaRow,
  TagGroup,
  Summary,
  OrnamentDivider,
} from '../styles'

type Props = {
  issue: Issue
}

const TAG_DISPLAY_LIMIT = 5

export default function PostHeader({ issue }: Props) {
  const date = new Date(issue.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const avatarUrl = issue.user?.avatarUrl
  const userName = issue.user?.userName?.trim() || issue.user?.login?.trim() || '匿名作者'

  return (
    <>
      {/* 封面图 */}
      {issue.metadata?.cover && (
        <CoverImage>
          <img src={issue.metadata.cover} alt={issue.title} loading='lazy' />
        </CoverImage>
      )}

      {/* 作者行 */}
      {avatarUrl && (
        <AuthorRow>
          <AuthorAvatar src={avatarUrl} alt={userName} width={36} height={36} />
          <AuthorInfo>
            <strong>{userName}</strong>
            <span>{date}</span>
          </AuthorInfo>
        </AuthorRow>
      )}

      {/* 标题 + Meta */}
      <Header>
        <Title>{issue.title}</Title>

        {!avatarUrl && (
          <MetaRow>
            <span>发布于 {date}</span>
            <span>&middot;</span>
            <span>{issue.comments} 条评论</span>
          </MetaRow>
        )}

        {issue.metadata?.summary && (
          <Summary>{issue.metadata.summary}</Summary>
        )}

        {/* 标签 */}
        {issue.labels.length > 0 && (
          <TagGroup>
            {issue.labels.slice(0, TAG_DISPLAY_LIMIT).map((label) => (
              <Link
                key={label.name}
                href={`https://github.com/stack-wuh/blog/issues?q=is:issue+label:"${encodeURIComponent(label.name)}"`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Tag label={label.name} color={label.color} />
              </Link>
            ))}
          </TagGroup>
        )}
      </Header>

      {/* 装饰分隔线 */}
      <OrnamentDivider aria-hidden='true'>
        <span className='divider-line' />
        <svg className='divider-diamond' viewBox='0 0 12 12' aria-hidden='true'>
          <polygon points='6,0 12,6 6,12 0,6' fill='currentColor' opacity='0.35' />
        </svg>
        <span className='divider-line' />
      </OrnamentDivider>
    </>
  )
}
