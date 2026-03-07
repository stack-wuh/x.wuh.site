'use client';

import styled from 'styled-components'

const DEFAULT_TAG_BACKGROUND = '#d0d7de'
const DEFAULT_TAG_TEXT = '#1f2328'

export type TagProps = {
  label: string
  color?: string | null
  className?: string
}

const Chip = styled.span<{ $bg: string; $text: string }>`
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  border: 1px solid ${({ $bg }) => $bg};
  white-space: nowrap;
  transition: transform var(--transition-fast) ease, color var(--transition-fast) ease, background-color var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    transform: translateY(-1px) scale(1.05);
    background-color: ${({ $text }) => $text};
    color: ${({ $bg }) => $bg};
    border-color: ${({ $text }) => $text};
  }
`

const normalizeHexColor = (value?: string | null): string | null => {
  if (!value) return null
  const hex = value.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return `#${hex.toLowerCase()}`
}

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

const getReadableTextColor = (hex: string) => {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? DEFAULT_TAG_TEXT : '#ffffff'
}

const resolvePalette = (color?: string | null) => {
  const background = normalizeHexColor(color) ?? DEFAULT_TAG_BACKGROUND
  const text = getReadableTextColor(background)
  return { background, text }
}

const Tag = ({ label, color, className }: TagProps) => {
  const palette = resolvePalette(color)
  return (
    <Chip className={className} $bg={palette.background} $text={palette.text}>
      {label}
    </Chip>
  )
}

export default Tag
