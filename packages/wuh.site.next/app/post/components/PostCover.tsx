'use client'

import { useEffect, useState } from 'react'
import { CoverImage } from '../styles'

type Props = {
  src?: string | null
  alt: string
}

export default function PostCover({ src, alt }: Props) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setHidden(false)
  }, [src])

  if (!src || hidden) return null

  return (
    <CoverImage>
      <img
        src={src}
        alt={alt}
        loading='lazy'
        onError={() => {
          setHidden(true)
        }}
      />
    </CoverImage>
  )
}
