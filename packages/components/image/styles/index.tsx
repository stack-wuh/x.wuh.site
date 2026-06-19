'use client'

import NextImage from 'next/image'
import styled, { css, keyframes } from 'styled-components'

export type ImageStatus = 'idle' | 'visible' | 'loaded' | 'error'
export type ImageVariant = 'cover' | 'contain' | 'fill'
export type ImageAppearance = 'default' | 'plain'

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

export const Wrapper = styled.div<{
  $inline: boolean
  $appearance: ImageAppearance
  $radius: string
  $hasExplicitSize: boolean
}>`
  display: ${(p) => (p.$inline ? 'inline-block' : 'block')};
  position: relative;
  overflow: hidden;
  border-radius: ${(p) => p.$radius};
  background-color: ${(p) => (p.$appearance === 'default' ? 'var(--background-200, #f5f5f5)' : 'transparent')};
  border: ${(p) => (p.$appearance === 'default' ? '1px solid var(--normal-200, rgba(15, 23, 42, 0.08))' : 'none')};
  isolation: isolate;
  color: var(--text-secondary, #475467);
  width: ${(p) => (p.$hasExplicitSize ? undefined : '100%')};
`

export const ImgWrapper = styled(NextImage)<{
  $objectFit: ImageVariant
  $status: ImageStatus
  $stretch: boolean
}>`
  display: block;
  object-fit: ${(p) => p.$objectFit};
  opacity: ${(p) => (p.$status === 'loaded' ? 1 : 0)};
  transition: opacity 0.35s ease;
  ${(p) =>
    p.$stretch
      ? css`
          width: 100%;
          height: 100%;
        `
      : null}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Skeleton = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 100%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: rgba(0, 0, 0, 0.08);
  }
`

export const Fallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 16px;
  color: var(--text-secondary, #475467);
  background-color: var(--background-100, #fff);
`
