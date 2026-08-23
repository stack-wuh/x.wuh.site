'use client'

import { useState } from 'react'
import Image from '@wuh.site/components/image'
import { formatFullDate } from '@/app/lib/date'
import {
  CoverFrame,
  CoverGradient,
  GeneratedCover,
  GeneratedOrnament,
  GeneratedTitle,
  GeneratedSummary,
  GeneratedAuthorRow,
  GeneratedAuthorInfo,
  GeneratedColophon,
} from '../../styles'
import type { PostCoverProps } from './specs'

/** 山峦/涟漪装饰线，呼应首页菱形分隔符的文艺气质 */
const MountainOrnament = () => (
  <svg viewBox='0 0 240 64' aria-hidden='true'>
    <path d='M0 48 Q 30 32, 60 48 T 120 48 T 180 48 T 240 48' fill='none' stroke='currentColor' strokeOpacity='0.4' strokeWidth='1.5' />
    <path d='M0 56 Q 30 40, 60 56 T 120 56 T 180 56 T 240 56' fill='none' stroke='currentColor' strokeOpacity='0.22' strokeWidth='1.5' />
  </svg>
)

/**
 * 博客详情封面：
 * - 有封面图：杂志卡（细边框 + 底部轻渐变过渡），加载失败时隐藏，不保留破图区域
 * - 无封面图：生成式封面，承载完整文章头图（标题/摘要/作者/日期/浏览量/落款），
 *   PostHeader 不再重复渲染
 */
export default function PostCover({
  src,
  alt,
  title,
  authorName,
  createdAt,
  viewCount,
  summary,
}: PostCoverProps) {
  const [failed, setFailed] = useState(false)

  // 加载失败：隐藏封面，不保留破图区域（PostHeader 正常展示）
  if (failed) return null

  if (!src) {
    if (!title) return null
    return (
      <GeneratedCover role='img' aria-label={alt || title}>
        <GeneratedOrnament>
          <MountainOrnament />
        </GeneratedOrnament>
        <GeneratedTitle>{title}</GeneratedTitle>
        {summary && <GeneratedSummary>{summary}</GeneratedSummary>}
        {authorName && (
          <GeneratedAuthorRow>
            <GeneratedAuthorInfo>
              <strong>{authorName}</strong>
              <span>
                {createdAt ? formatFullDate(createdAt) : ''}
                {typeof viewCount === 'number' ? ` · ${viewCount} 次阅读` : ''}
              </span>
            </GeneratedAuthorInfo>
          </GeneratedAuthorRow>
        )}
        <GeneratedColophon>wuh.site</GeneratedColophon>
      </GeneratedCover>
    )
  }

  return (
    <CoverFrame>
      <Image
        role='cover'
        borderRadius='var(--post-cover-radius)'
        src={src}
        alt={alt}
        fill
        ratio='16:9'
        priority
        onStatusChange={(status) => {
          if (status === 'error') setFailed(true)
        }}
      />
      <CoverGradient aria-hidden='true' />
    </CoverFrame>
  )
}
