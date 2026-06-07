import styled, { css } from '@wuh.site/components/styled'

export const FloatingButtonGroup = styled.div`
  --float-button-width: 50px;
  --float-divider: var(--normal-300);

  position: fixed;
  right: 0;
  bottom: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 20;
  border: 1px solid var(--normal-300);
  border-right: 0;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  overflow: hidden;
  background: var(--background-100);

  & > * {
    width: var(--float-button-width);
  }

  & > * + * {
    border-top: 1px solid var(--float-divider);
  }

  @media (max-width: 640px) {
    --float-button-width: 50px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    border-right-color: transparent;
    background: color-mix(in oklab, var(--background-200) 75%, var(--background-900) 25%);
    --float-divider: var(--normal-600);

    & > * + * {
      border-top-color: var(--float-divider);
    }
  }
`

const floatingButtonBase = css`
  border: none;
  background: transparent;
  color: var(--text-primary);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  min-width: 50px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
  will-change: transform;

  &:hover {
    color: var(--primary-color);
    background: var(--background-200);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
    transform: translateX(-2px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (prefers-color-scheme: dark) {
    background: transparent;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);

    &:hover {
      background: color-mix(in oklab, var(--background-300) 70%, var(--background-900) 30%);
    }
  }
`

export const FloatingButton = styled.button`
  ${floatingButtonBase}
  padding: 0;
`
