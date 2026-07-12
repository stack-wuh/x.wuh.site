import styled, { keyframes } from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 25%, transparent); }
  50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--primary-color) 12%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 25%, transparent); }
`

const heartBeat = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`

export const FloatingButton = styled(Button)`
  will-change: transform;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
    animation: ${pulse} 1s ease;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }
`

export const LikeButton = styled(Button)`
  will-change: transform;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
    animation: ${pulse} 1s ease;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }

  &:hover:not(:disabled) svg {
    animation: ${heartBeat} 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover:not(:disabled) svg {
      animation: none;
    }
  }
`

export const FloatingButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`
