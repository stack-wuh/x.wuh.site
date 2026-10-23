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
  $blur: boolean
}>`
  display: block;
  object-fit: ${(p) => p.$objectFit};
  /* blur 模式下图片以模糊占位打底自挂载即可见（next/image 原生 placeholder），
     不走 opacity 门；非 blur 保持加载完成后淡入揭示 */
  opacity: ${(p) => (p.$blur || p.$status === 'loaded' ? 1 : 0)};
  transition: opacity 0.3s ease-out;
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
  transition: opacity var(--motion-dur-quick, 150ms) var(--motion-ease-out-soft, ease-out);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: rgba(0, 0, 0, 0.08);
  }
`

// 失败态「装裱题注」（构 A，D1）：纸底 + 内界格发丝线 + 衬线图题 + 朱砂「佚」印。
// 纯静态（阅读区与组件库均不动画）；plain 外观无界格（透明底上留白更静）
export const Fallback = styled.div<{ $compactFallback: boolean; $appearance: ImageAppearance }>`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.$compactFallback ? '4px' : '24px 40px')};
  overflow: hidden;
  color: var(--text-secondary, #475467);
  background-color: ${(p) => (p.$appearance === 'plain' ? 'transparent' : p.$appearance === 'qr' ? '#fff' : 'var(--background-100, #fff)')};
  ${(p) =>
    p.$appearance !== 'plain' &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset: ${(inner) => (inner.$compactFallback ? '4px' : '9px')};
        border: 1px solid color-mix(in oklab, var(--text-color, #2a1e16) 9%, transparent);
        border-radius: inherit;
        pointer-events: none;
      }
    `}
`

export const FallbackCaption = styled.span`
  font-family: var(--font-serif, Georgia, 'Songti SC', SimSun, serif);
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--text-secondary, #8a6e5c);
  text-align: center;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FallbackSeal = styled.span<{ $compactFallback: boolean }>`
  position: absolute;
  ${(p) =>
    p.$compactFallback
      ? css`
          right: 50%;
          bottom: 50%;
          transform: translate(50%, 50%);
        `
      : css`
          right: 16px;
          bottom: 13px;
        `}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.$compactFallback ? '13px' : '16px')};
  height: ${(p) => (p.$compactFallback ? '13px' : '16px')};
  border: 1px solid color-mix(in oklab, var(--primary-color, #c94a44) 55%, transparent);
  border-radius: var(--border-radius-xs, 2px);
  color: var(--primary-color, #c94a44);
  background-color: color-mix(in oklab, var(--primary-color, #c94a44) 6%, transparent);
  font-family: var(--font-serif, Georgia, 'Songti SC', SimSun, serif);
  font-size: ${(p) => (p.$compactFallback ? '8px' : '10px')};
  line-height: 1;
`

export const FallbackVisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`
