import styled, { css, keyframes } from 'styled-components'

import type { MessagePlacement, MessageType } from '../types'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-6px);
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const placementStyles: Record<MessagePlacement, ReturnType<typeof css>> = {
  top: css`
    top: var(--message-top);
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  `,
  topLeft: css`
    top: var(--message-top);
    left: var(--message-side);
    align-items: flex-start;
  `,
  topRight: css`
    top: var(--message-top);
    right: var(--message-side);
    align-items: flex-end;
  `,
  bottom: css`
    bottom: var(--message-bottom);
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  `,
  bottomLeft: css`
    bottom: var(--message-bottom);
    left: var(--message-side);
    align-items: flex-start;
  `,
  bottomRight: css`
    bottom: var(--message-bottom);
    right: var(--message-side);
    align-items: flex-end;
  `,
}

export const MessageHost = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
`

export const MessagePlacementWrap = styled.div<{ $placement: MessagePlacement }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  ${(props) => placementStyles[props.$placement]}
`

export const MessageItem = styled.div<{ $type: MessageType; $leaving: boolean }>`
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--background-color);
  border: 1px solid color-mix(in srgb, var(--text-color) 12%, transparent);
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.5;
  max-width: min(560px, calc(100vw - 32px));
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  animation: ${(props) => (props.$leaving ? fadeOut : fadeIn)} 0.22s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in srgb, var(--text-color) 18%, transparent);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
  }
`

export const MessageIcon = styled.span<{ $type: MessageType }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  color: ${(props) => {
    switch (props.$type) {
      case 'success':
        return 'var(--success-color)'
      case 'warning':
        return 'var(--warning-color)'
      case 'error':
        return 'var(--danger-color)'
      case 'loading':
        return 'var(--primary-color)'
      default:
        return 'var(--info-color)'
    }
  }};

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

export const MessageSpinner = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, currentColor 35%, transparent);
  border-top-color: currentColor;
  animation: ${spin} 0.9s linear infinite;
`

export const MessageContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
  word-break: break-word;
`

export const MessageCloseButton = styled.button`
  border: none;
  background: transparent;
  color: var(--text-muted);
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 0 0 auto;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    color: var(--text-color);
    background: color-mix(in srgb, var(--text-color) 8%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      color: var(--text-color);
      background: color-mix(in srgb, var(--text-color) 16%, transparent);
    }
  }
`
