'use client'

import { DiamondDivider } from '@wuh.site/components/icons'
import { formatFullDate } from '@/app/lib/date'
import Image from '@wuh.site/components/image'
import { AuthorRow, AuthorAvatarFrame, AuthorInfo, Header, Title, Summary, OrnamentDivider } from '../../styles'
import type { PostHeaderProps } from './specs'

export default function PostHeader({ issue }: PostHeaderProps) {
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
            <AuthorAvatarFrame>
              <Image role='avatar' src={avatarUrl} alt={userName} width={32} height={32} />
            </AuthorAvatarFrame>
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
