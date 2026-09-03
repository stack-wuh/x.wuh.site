import styled, { keyframes } from 'styled-components'
import Button from '@wuh.site/components/button'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

export const CanvasPreview = styled.canvas<{ $hidden: boolean }>`
  display: ${(p) => (p.$hidden ? 'none' : 'block')};
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--normal-300);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
  }
`

export const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid var(--normal-300);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-top-color: var(--normal-300);
  }
`

export const ErrorWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`

export const RetryButton = styled(Button)`
  margin-top: 4px;
`

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
`

export const ActionButton = styled(Button)`
  border-radius: 999px;
`
