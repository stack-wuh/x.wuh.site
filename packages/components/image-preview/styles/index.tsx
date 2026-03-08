'use client'

import styled, { css, keyframes } from 'styled-components'

const enter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.985);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const Backdrop = styled.div<{ $open: boolean; $disableMotion: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: clamp(12px, 3vh, 32px);
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.45), rgba(2, 6, 23, 0.94));
  backdrop-filter: blur(16px);
  z-index: 1400;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: ${(p) => (p.$disableMotion ? 'none' : 'opacity 0.25s ease')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const PreviewContainer = styled.div`
  position: relative;
  flex: 1;
  width: min(1440px, 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-primary, #f8fafc);
`

export const PreviewSurface = styled.div<{ $disableMotion: boolean }>`
  flex: 1;
  min-height: 0;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 24px 65px rgba(2, 6, 23, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${(p) => (p.$disableMotion ? 'none' : css`${enter} 0.3s ease both`)};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px clamp(16px, 2vw, 32px);
  gap: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
`

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const TitleLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.92);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const Subtitle = styled.span`
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.65);
  letter-spacing: 0.02em;
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const IconButton = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(p) => (p.$active ? 'var(--primary-color, #fbbf24)' : 'rgba(148, 163, 184, 0.45)')};
  border-radius: 10px;
  background: ${(p) => (p.$active ? 'rgba(251, 191, 36, 0.18)' : 'rgba(15, 23, 42, 0.6)')};
  color: ${(p) => (p.$active ? 'var(--primary-color, #fbbf24)' : 'rgba(248, 250, 252, 0.92)')};
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--primary-color, #fbbf24);
    color: var(--primary-color, #fbbf24);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const Viewport = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`

export const Hint = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 10px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.8);
  color: rgba(248, 250, 252, 0.65);
`

export const ImageStage = styled.div<{ $dragging: boolean; $canPan: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(p) => {
    if (!p.$canPan) return 'default'
    return p.$dragging ? 'grabbing' : 'grab'
  }};
  user-select: none;
`

export const PreviewImage = styled.img<{
  $zoom: number
  $translateX: number
  $translateY: number
  $rotation: number
  $dragging: boolean
}>`
  max-width: min(92vw, 1300px);
  max-height: 78vh;
  object-fit: contain;
  transform: ${(p) => `translate3d(${p.$translateX}px, ${p.$translateY}px, 0) scale(${p.$zoom}) rotate(${p.$rotation}deg)`};
  transition: ${(p) => (p.$dragging ? 'none' : 'transform 0.26s ease')};
  filter: drop-shadow(0 25px 40px rgba(2, 6, 23, 0.55));
  will-change: transform;
  backface-visibility: hidden;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px clamp(16px, 2vw, 32px) 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
`

export const Caption = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  color: rgba(226, 232, 240, 0.92);
  font-size: 0.9rem;
`

export const Counter = styled.span`
  font-family: var(--font-mono, 'SFMono-Regular', monospace);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.9);
`

export const ThumbnailRail = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #000 6%, #000 94%, rgba(0, 0, 0, 0) 100%);

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.35);
    border-radius: 999px;
  }
`

export const ThumbnailButton = styled.button<{ $active: boolean }>`
  position: relative;
  width: 80px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${(p) => (p.$active ? 'var(--primary-color, #fbbf24)' : 'rgba(148, 163, 184, 0.35)')};
  padding: 0;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.6);
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${(p) => (p.$active ? 1 : 0.8)};
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid ${(p) => (p.$active ? 'var(--primary-color, #fbbf24)' : 'transparent')};
    border-radius: inherit;
    pointer-events: none;
  }
`

export const EmptyState = styled.div`
  width: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  color: rgba(226, 232, 240, 0.6);
  font-size: 0.95rem;
  text-align: center;
`

export const ThumbLabel = styled.span`
  position: absolute;
  left: 8px;
  bottom: 6px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  background: rgba(2, 6, 23, 0.6);
  color: rgba(248, 250, 252, 0.85);
`

export const KeyboardLegend = styled.div`
  align-self: flex-end;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.05em;
  animation: ${fadeUp} 0.28s ease both;
`
