'use client'

import styled, { css, keyframes } from 'styled-components'

const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const dialogSurfaceBase = css<{ $fullScreen: boolean; $width: number | string; $height?: number | string; $disableAnimation: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ $width, $fullScreen }) => ($fullScreen ? '100vw' : typeof $width === 'number' ? `${$width}px` : $width)};
  height: ${({ $height, $fullScreen }) => {
    if ($fullScreen) return '100vh'
    if (!$height) return 'auto'
    return typeof $height === 'number' ? `${$height}px` : $height
  }};
  max-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : 'calc(100vh - 80px)')};
  border-radius: ${({ $fullScreen }) => ($fullScreen ? '0' : 'var(--radius-card)')};
  background-color: var(--background-100, #fff);
  color: var(--text-primary, #0f172a);
  border: ${({ $fullScreen }) => ($fullScreen ? 'none' : '1px solid rgba(0, 0, 0, 0.06)')};
  box-shadow: ${({ $fullScreen }) =>
    $fullScreen
      ? 'none'
      : 'var(--elevation-card), 0 8px 40px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)'};
  outline: none;
  pointer-events: auto;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: var(--background-100, #fff);
    border-color: ${({ $fullScreen }) => ($fullScreen ? 'none' : 'color-mix(in oklab, var(--normal-700) 60%, transparent)')};
    box-shadow: ${({ $fullScreen }) =>
      $fullScreen
        ? 'none'
        : 'var(--elevation-card), 0 8px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)'};
  }

  ${({ $disableAnimation }) =>
    !$disableAnimation &&
    css`
      animation: ${enterAnimation} 180ms ease forwards;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`

export const Barrier = styled.div<{ $zIndex: number; $fullScreen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: ${({ $fullScreen }) => ($fullScreen ? 'stretch' : 'center')};
  justify-content: center;
  padding: ${({ $fullScreen }) => ($fullScreen ? '0' : 'clamp(16px, 4vw, 48px)')};
  pointer-events: auto;
  background: transparent;
`

export const DialogSurface = styled.div<{ $fullScreen: boolean; $width: number | string; $height?: number | string; $disableAnimation: boolean }>`
  ${dialogSurfaceBase}
`

export const DialogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md, 16px);
  padding: var(--space-lg, 24px) var(--space-xl, 32px) 0;
`

export const DialogTitle = styled.h3`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-xl, 20px);
  font-weight: 700;
  color: inherit;
`

export const CloseButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-secondary, #475569);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: var(--background-200, rgba(15, 23, 42, 0.04));
    color: var(--text-primary, #0f172a);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color, #2563eb);
    outline-offset: 2px;
  }
`

export const DialogBody = styled.div`
  flex: 1;
  padding: var(--space-lg, 24px) var(--space-xl, 32px);
  overflow-y: auto;
  color: inherit;

  @media (max-width: 640px) {
    padding: 20px;
  }
`

export const DialogFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm, 12px);
  padding: var(--space-md, 16px) var(--space-xl, 32px);
  border-top: 1px solid color-mix(in oklab, var(--normal-200) 40%, transparent);
  background: var(--background-100, #fff);

  @media (prefers-color-scheme: dark) {
    border-top-color: color-mix(in oklab, var(--normal-700) 30%, transparent);
  }
`
