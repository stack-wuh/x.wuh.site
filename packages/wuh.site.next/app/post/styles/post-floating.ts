import styled from '@wuh.site/components/styled'

export const FloatingButtonGroup = styled.div`
  margin-top: var(--space-sm);
  padding: var(--space-md);
  background: var(--background-100);
  border: 1px solid color-mix(in oklab, var(--primary-color) 12%, var(--normal-300) 88%);
  border-radius: var(--radius-card);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
  }
`

export const FloatingButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  min-height: 40px;
  background: var(--background-200);
  border: 1px solid var(--normal-300);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--transition-fast) ease,
    border-color var(--transition-fast) ease,
    color var(--transition-fast) ease,
    transform var(--transition-fast) ease;

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
    background: var(--background-300);
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-700);
    border-color: var(--normal-500);

    &:hover {
      background: var(--normal-600);
      border-color: var(--primary-color);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
