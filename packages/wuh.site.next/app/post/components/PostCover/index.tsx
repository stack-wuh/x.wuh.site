'use client'

import Image from '@wuh.site/components/image'
import { CoverImage } from '../../styles'
import type { PostCoverProps } from './specs'

export default function PostCover({ src, alt }: PostCoverProps) {
  if (!src) return null

  return (
    <CoverImage>
      <Image role='cover' borderRadius='var(--post-cover-radius)' src={src} alt={alt} fill ratio='16:9' priority />
    </CoverImage>
  )
}
