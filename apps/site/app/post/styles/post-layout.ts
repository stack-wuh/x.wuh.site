import styled, { keyframes } from '@wuh.site/components/styled'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const scrollProgress = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 72px) clamp(16px, 4vw, 24px);
  color: var(--text-color);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 9999;
    background: var(--primary-color);
    transform-origin: left center;
    pointer-events: none;

    @supports (animation-timeline: scroll()) {
      animation: ${scrollProgress} auto linear;
      animation-timeline: scroll(root);
    }

    @supports not (animation-timeline: scroll()) {
      transform: scaleX(0);
    }
  }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  align-items: start;

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    grid-template-columns: minmax(0, 820px) 260px;
    gap: 24px;
    justify-content: center;
  }
`

export const MainColumn = styled.div`
  min-width: 0;
`
