'use client'

import Image from '@wuh.site/components/image'
import { CoverImage } from '../styles'

type Props = {
  src?: string | null
  alt: string
}

export default function PostCover({ src, alt }: Props) {
  if (!src) return null

  return (
    <CoverImage>
      <Image role='cover' borderRadius='var(--post-cover-radius)' src={src} alt={alt} fill ratio='16:9' priority />
    </CoverImage>
  )
}
