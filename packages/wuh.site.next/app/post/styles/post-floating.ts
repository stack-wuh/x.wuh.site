import styled, { keyframes } from '@wuh.site/components/styled'

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.08); }
  50% { box-shadow: 0 0 0 8px rgba(0,0,0,0.04); }
  100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
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

export const FloatingButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: var(--text-primary);
  background: var(--background-200);
  border: 1px solid var(--normal-300);
  cursor: pointer;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
  overflow: hidden;
  will-change: transform;
  outline: none;

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    transform: translateY(-2px) scale(1.08);
    background: var(--background-300);
    border-color: var(--primary-color);
    animation: ${pulse} 1s ease;
  }

  &:active {
    transform: translateY(0) scale(1.02);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-700);
    border-color: var(--normal-500);
    color: var(--text-primary);

    &:hover {
      background: var(--normal-600);
      border-color: var(--primary-color);
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px var(--background-dark-500), 0 0 0 4px var(--primary-400);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`

export const LikeButton = styled(FloatingButton)`
  width: auto;
  padding: 0 24px;
  gap: 8px;
  border-radius: 999px;
  background: var(--background-200) !important;
  border-color: var(--accent-color) !important;
  color: #e11d48;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%) !important;
    border-color: transparent !important;
    color: #fff;
    box-shadow: 0 4px 16px rgba(244, 63, 94, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-700) !important;
    border-color: var(--accent-color) !important;
    color: #f43f5e;

    &:hover {
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%) !important;
      border-color: transparent !important;
      color: #fff;
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px var(--background-dark-500), 0 0 0 4px var(--primary-400);
    }
  }
`
