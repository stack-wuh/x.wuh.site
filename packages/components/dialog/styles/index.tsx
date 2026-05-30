'use client'

import styled, { css, keyframes } from 'styled-components'

// Enter animations
const enterCenter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const enterBottom = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`

// Exit animations
const exitCenter = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
`

const exitBottom = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`

const dialogSurfaceBase = css<{
  $fullScreen: boolean
  $placement: 'center' | 'bottom'
  $width: number | string
  $height?: number | string
  $disableAnimation: boolean
  $closing: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ $width, $fullScreen, $placement }) => {
    if ($fullScreen || $placement === 'bottom') return '100vw'
    return typeof $width === 'number' ? `${$width}px` : $width
  }};
  height: ${({ $height, $fullScreen, $placement }) => {
    if ($fullScreen) return '100vh'
    if ($placement === 'bottom') return 'auto'
    if (!$height) return 'auto'
    return typeof $height === 'number' ? `${$height}px` : $height
  }};
  max-height: ${({ $fullScreen, $placement }) => {
    if ($fullScreen) return '100vh'
    if ($placement === 'bottom') return '80vh'
    return 'calc(100vh - 80px)'
  }};
  border-radius: ${({ $fullScreen, $placement }) => {
    if ($fullScreen) return '0'
    if ($placement === 'bottom') return '16px 16px 0 0'
    return '16px'
  }};
  background-color: var(--background-100, #fff);
  color: var(--text-primary, #0f172a);
  border: ${({ $fullScreen }) => ($fullScreen ? 'none' : '1px solid rgba(0, 0, 0, 0.06)')};
  box-shadow: ${({ $fullScreen, $placement }) => {
    if ($fullScreen) return 'none'
    if ($placement === 'bottom') return '0 -4px 30px rgba(15, 23, 42, 0.15)'
    return '0 12px 50px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
  }};
  outline: none;
  pointer-events: auto;
  overflow: ${({ $placement }) => ($placement === 'bottom' ? 'hidden auto' : 'hidden')};
  overscroll-behavior: ${({ $placement }) => ($placement === 'bottom' ? 'contain' : 'auto')};

  @media (prefers-color-scheme: dark) {
    background-color: var(--background-100, #fff);
    border-color: ${({ $fullScreen }) =>
      $fullScreen ? 'none' : 'color-mix(in oklab, var(--normal-700) 60%, transparent)'};
    box-shadow: ${({ $fullScreen, $placement }) => {
      if ($fullScreen) return 'none'
      if ($placement === 'bottom') return '0 -4px 30px rgba(0, 0, 0, 0.3)'
      return '0 12px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
    }};
  }

  ${({ $disableAnimation, $placement, $closing }) =>
    !$disableAnimation &&
    css`
      animation: ${$closing
          ? $placement === 'bottom'
            ? exitBottom
            : exitCenter
          : $placement === 'bottom'
            ? enterBottom
            : enterCenter}
        ${$closing
          ? $placement === 'bottom' ? '200ms' : '150ms'
          : $placement === 'bottom' ? '300ms' : '250ms'}
        ${$placement === 'bottom' && !$closing
          ? 'cubic-bezier(0.32, 0.72, 0, 1)'
          : $closing
            ? 'ease'
            : 'cubic-bezier(0.34, 1.56, 0.64, 1)'}
        forwards;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`

export const Barrier = styled.div<{ $zIndex: number; $fullScreen: boolean; $closing: boolean; $placement: 'center' | 'bottom' }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: ${({ $fullScreen, $placement }) => {
    if ($fullScreen) return 'stretch'
    if ($placement === 'bottom') return 'flex-end'
    return 'center'
  }};
  justify-content: center;
  padding: ${({ $fullScreen, $placement }) => {
    if ($fullScreen || $placement === 'bottom') return '0'
    return 'clamp(16px, 4vw, 48px)'
  }};
  pointer-events: auto;
  background: ${({ $closing }) => ($closing ? 'transparent' : 'rgba(0, 0, 0, 0.4)')};
  backdrop-filter: ${({ $closing }) => ($closing ? 'blur(0)' : 'blur(2px)')};
  transition: background 250ms ease, backdrop-filter 250ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const DialogSurface = styled.div<{
  $fullScreen: boolean
  $placement: 'center' | 'bottom'
  $width: number | string
  $height?: number | string
  $disableAnimation: boolean
  $closing: boolean
}>`
  ${dialogSurfaceBase}
`

export const DragHandle = styled.div`
  width: 36px;
  height: 4px;
  background: var(--normal-300, #d4cdc0);
  border-radius: 2px;
  margin: 8px auto 4px;
  flex-shrink: 0;
`

export const DialogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md, 16px);
  padding: 12px 22px;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-200) 60%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--normal-700) 50%, transparent);
  }
`

export const DialogTitle = styled.h3`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg, 18px);
  font-weight: 700;
  color: inherit;
`

export const CloseButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-secondary, #475569);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
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
  padding: 12px 22px 18px;
  overflow-y: auto;
  color: inherit;

  @media (max-width: 640px) {
    padding: 12px 16px 16px;
  }
`

export const DialogFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm, 12px);
  padding: var(--space-md, 16px) 22px;
  border-top: 1px solid color-mix(in oklab, var(--normal-200) 40%, transparent);
  background: var(--background-100, #fff);

  @media (prefers-color-scheme: dark) {
    border-top-color: color-mix(in oklab, var(--normal-700) 30%, transparent);
  }
`
