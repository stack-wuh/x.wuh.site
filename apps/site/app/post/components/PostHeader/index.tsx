'use client'

import type { CSSProperties } from 'react'
import { formatFullDate } from '@/app/lib/date'
import { buildTopicUrl } from '@/app/lib/topic-url'
import { Header, TopRow, MetaLine, TagGroup, Title, Summary, HeadRule } from '../../styles'
import type { PostHeaderProps } from './specs'

/** 藏印微旋档位：由标签名确定性推导（禁用 Math.random，保证 SSR 与客户端一致） */
const TILT_STEPS = [-1.6, -0.8, 0, 0.8, 1.6]

const sealTilt = (name: string): CSSProperties => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997
  }
  return { '--tilt': `${TILT_STEPS[hash % TILT_STEPS.length]}deg` } as CSSProperties
}

export default function PostHeader({ issue }: PostHeaderProps) {
  const date = formatFullDate(issue.created_at)
  const userName = issue.user?.userName?.trim() || issue.user?.login?.trim() || '匿名作者'

  return (
    <Header>
      <TopRow>
        <MetaLine>
          <span className='author'>{userName}</span>
          <span className='dot' aria-hidden='true'>·</span>
          <span>{date}</span>
          <span className='dot' aria-hidden='true'>·</span>
          <span>{issue.viewCount ?? 0} 次阅读</span>
        </MetaLine>

        {issue.labels.length > 0 && (
          <TagGroup aria-label='文章标签'>
            {issue.labels.map((label) => (
              <a key={label.name} href={buildTopicUrl(label.name)} style={sealTilt(label.name)}>
                {label.name}
              </a>
            ))}
          </TagGroup>
        )}
      </TopRow>

      <Title>{issue.title}</Title>

      {issue.metadata?.summary && <Summary>{issue.metadata.summary}</Summary>}

      <HeadRule aria-hidden='true' />
    </Header>
  )
}
