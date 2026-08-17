import styled from 'styled-components'

export const EmptyRoot = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-xs, 8px);
  width: 100%;
  min-height: 160px;
  padding: var(--space-2xl, 32px) var(--space-lg, 24px);
  border-radius: var(--border-radius-xl, 16px);
  border: 1px dashed color-mix(in srgb, var(--normal-300) 82%, transparent);
  background:
    radial-gradient(circle at top, color-mix(in oklab, var(--primary-color) 8%, transparent), transparent 58%),
    var(--background-100);
  color: var(--text-secondary);
`

export const EmptyIcon = styled.span`
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--normal-300) 75%, transparent);
  background: color-mix(in oklab, var(--background-200) 92%, var(--primary-color) 8%);
  color: var(--primary-color);

  svg {
    width: 24px;
    height: 24px;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

export const EmptyTitle = styled.p`
  margin: 0;
  font-size: var(--font-size-lg, 18px);
  line-height: 1.35;
  font-weight: 600;
  color: var(--text-primary);
`

export const EmptyDescription = styled.p`
  margin: 0;
  max-width: 48ch;
  font-size: var(--font-size-sm, 14px);
  line-height: 1.65;
  color: var(--text-secondary);
`

export const EmptyActions = styled.div`
  margin-top: var(--space-xs, 8px);
  display: flex;
  gap: var(--space-xs, 8px);
  flex-wrap: wrap;
  justify-content: center;
`
