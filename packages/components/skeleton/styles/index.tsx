'use client'

import styled, { css, keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`

export const SkeletonRoot = styled.div<{
  $width: string
  $height: string
  $radius: string
  $shimmer: boolean
}>`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  border-radius: ${(p) => p.$radius};
  background: linear-gradient(90deg, var(--primary-100) 0%, var(--primary-300) 50%, var(--primary-100) 100%);
  background-size: 400% 100%;
  animation: ${(p) => (p.$shimmer ? css`${shimmer} 1.6s ease-in-out infinite` : 'none')};
  animation-delay: 0.15s;
  opacity: 0.85;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
