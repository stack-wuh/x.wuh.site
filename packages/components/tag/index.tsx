'use client'

import * as S from './styles'
import { DEFAULT_TAG_COLOR, type TagProps } from './specs'

const normalizeHexColor = (value?: string | null): string => {
  if (!value) return DEFAULT_TAG_COLOR
  const hex = value.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return DEFAULT_TAG_COLOR
  return `#${hex.toLowerCase()}`
}

const Tag = ({ label, color, className }: TagProps) => {
  const hexColor = normalizeHexColor(color)
  return (
    <S.Chip className={className} $color={hexColor}>
      {label}
    </S.Chip>
  )
}

export default Tag
export type { TagProps } from './specs'
