'use client'

import { DiamondDivider } from '@wuh.site/components/icons'
import type { Issue } from '../PostView.types'
import { formatFullDate } from '@/app/lib/date'
import { AuthorRow, AuthorAvatar, AuthorInfo, Header, Title, Summary, OrnamentDivider } from '../styles'

type Props = {
  issue: Issue
}

export default function PostHeader({ issue }: Props) {
  const date = formatFullDate(issue.created_at)
  const avatarUrl = issue.user?.avatarUrl
  const userName = issue.user?.userName?.trim() || issue.user?.login?.trim() || '匿名作者'

  return (
    <>
      {/* 标题 + Meta */}
      <Header>
        <Title>{issue.title}</Title>

        {/* 作者行 */}
        {avatarUrl && (
          <AuthorRow>
            <AuthorAvatar src={avatarUrl} alt={userName} width={36} height={36} />
            <AuthorInfo>
              <strong>{userName}</strong>
              <span>{date} · {issue.viewCount ?? 0} 次阅读</span>
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
