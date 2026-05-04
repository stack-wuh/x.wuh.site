'use client'

import { DiamondDivider } from '@wuh.site/components/icons'
import type { Issue } from '../PostView.types'
import { CoverImage, AuthorRow, AuthorAvatar, AuthorInfo, Header, Title, Summary, OrnamentDivider } from '../styles'

type Props = {
  issue: Issue
}

export default function PostHeader({ issue }: Props) {
  const date = new Date(issue.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

      {/* 标题 + Meta */}
      <Header>
        <Title>{issue.title}</Title>

        {/* 作者行 */}
        {avatarUrl && (
          <AuthorRow>
            <AuthorAvatar src={avatarUrl} alt={userName} width={36} height={36} />
            <AuthorInfo>
              <strong>{userName}</strong>
              <span>
                发布于 {date}, {issue.comments}条评论
              </span>
            </AuthorInfo>
          </AuthorRow>
        )}

        {issue.metadata?.summary && <Summary>{issue.metadata.summary}</Summary>}
      </Header>

      {/* 装饰分隔线 */}
      <OrnamentDivider aria-hidden='true'>
        <span className='divider-line' />
        <DiamondDivider />
        <span className='divider-line' />
      </OrnamentDivider>
    </>
  )
}
