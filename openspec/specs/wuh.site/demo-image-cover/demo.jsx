// ============================================
// 文章封面图 — 文章卡片 / 详情头部
// import 路径：
//   Image  → @wuh.site/components/image
// ============================================

import Image from '@wuh.site/components/image'

// 文章卡片封面（16:9 宽高比）
export function PostCover({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      ratio="16:9"
      variant="cover"
      borderRadius={12}
      appearance="polished"
    />
  )
}

// 文章详情头部大图（自定义宽高）
export function PostHeroImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={675}
      variant="cover"
      borderRadius={16}
    />
  )
}
