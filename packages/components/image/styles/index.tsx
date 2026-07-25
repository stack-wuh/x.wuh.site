'use client'

import NextImage from 'next/image'
import styled, { css, keyframes } from 'styled-components'

import type { ImageRole } from '../index'

export type ImageStatus = 'idle' | 'visible' | 'loaded' | 'error'
export type ImageVariant = 'cover' | 'contain' | 'fill'
export type ImageAppearance = 'default' | 'plain' | 'qr'

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

export const Wrapper = styled.div<{
  $inline: boolean
  $appearance: ImageAppearance
  $radius: string
  $hasExplicitSize: boolean
  $role: ImageRole | undefined
}>`
  display: ${(p) => (p.$inline ? 'inline-block' : 'block')};
  position: relative;
  overflow: hidden;
  border-radius: ${(p) => p.$radius};
  background-color: ${(p) => {
    if (p.$appearance === 'plain') return 'transparent'
    if (p.$appearance === 'qr') return '#fff'
    if (p.$role === 'book-cover') return 'color-mix(in oklab, var(--background-100, #fff) 92%, #d8cdbf 8%)'
    return 'var(--background-200, #f5f5f5)'
  }};
  border: ${(p) => {
    if (p.$appearance === 'plain') return 'none'
    if (p.$appearance === 'qr') return '6px solid #fff'
    return '1px solid var(--normal-200, rgba(15, 23, 42, 0.08))'
  }};
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
  border-radius: inherit;
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

export const Fallback = styled.div<{ $compactFallback: boolean; $appearance: ImageAppearance }>`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => (p.$compactFallback ? '0' : '8px')};
  text-align: center;
  padding: ${(p) => (p.$compactFallback ? '4px' : '16px')};
  color: var(--text-secondary, #475467);
  background-color: ${(p) => (p.$appearance === 'plain' ? 'transparent' : p.$appearance === 'qr' ? '#fff' : 'var(--background-100, #fff)')};
`
