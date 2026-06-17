'use client'

import NextImage from 'next/image'
import styled, { css, keyframes } from 'styled-components'

export type ImageStatus = 'loading' | 'loaded' | 'error'

export type ImageVariant = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
export type ImageAppearance = 'default' | 'plain'

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`

export const Figure = styled.figure<{ $inline: boolean; $hasCaption: boolean; $hasExplicitSize: boolean }>`
  margin: 0;
  display: ${(p) => (p.$inline ? 'inline-flex' : 'flex')};
  flex-direction: column;
  gap: ${(p) => (p.$hasCaption ? '8px' : '0')};
  width: ${(p) => {
    if (p.$inline) return 'auto';
    if (p.$hasExplicitSize) return undefined;
    return '100%';
  }};
`

export const Frame = styled.div<{
  $radius: string
  $ratio?: number
  $hasExplicitSize: boolean
  $inline: boolean
  $appearance: ImageAppearance
}>`
  position: relative;
  width: ${(p) => {
    if (p.$ratio) return '100%'
    if (p.$hasExplicitSize) return p.$inline ? 'max-content' : undefined
    if (p.$inline) return 'auto'
    return '100%'
  }};
  border-radius: ${(p) => p.$radius};
  overflow: hidden;
  background-color: ${(p) => (p.$appearance === 'default' ? 'var(--background-200, #f5f5f5)' : 'transparent')};
  border: ${(p) => (p.$appearance === 'default' ? '1px solid var(--normal-200, rgba(15, 23, 42, 0.08))' : 'none')};
  isolation: isolate;
  color: var(--text-secondary, #475467);

  ${(p) =>
    p.$ratio
      ? css`
          aspect-ratio: ${p.$ratio};
          @supports not (aspect-ratio: ${p.$ratio}) {
            &::before {
              content: '';
              display: block;
              width: 100%;
              padding-bottom: ${(1 / p.$ratio) * 100}%;
            }
          }
        `
      : !p.$hasExplicitSize
        ? css`
            min-height: 120px;
          `
        : null}
`

export const StyledNextImage = styled(NextImage)<{
  $objectFit: ImageVariant
  $status: ImageStatus
  $disableTransition: boolean
  $stretch: boolean
}>`
  object-fit: ${(p) => p.$objectFit};
  ${(p) =>
    p.$stretch
      ? css`
          width: 100%;
          height: 100%;
        `
      : css`
          width: auto;
          height: auto;
          display: block;
          max-width: 100%;
        `}
  transition: ${(p) => (p.$disableTransition ? 'none' : 'opacity 0.35s ease, transform 0.35s ease')};
  opacity: ${(p) => (p.$status === 'loaded' ? 1 : 0)};
  transform: ${(p) => (p.$status === 'loaded' ? 'scale(1)' : 'scale(1.01)')};
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.15s linear;
    transform: none;
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

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  padding: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  color: #fff;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;

  ${Frame}:hover &,
  ${Frame}:focus-within & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }
`

export const Caption = styled.figcaption`
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--text-secondary, #475467);
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
