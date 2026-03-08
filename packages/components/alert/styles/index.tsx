import styled, { css } from 'styled-components'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantTokens: Record<AlertVariant, { surface: string; border: string; accent: string }> = {
  info: {
    surface: 'rgba(37, 99, 235, 0.08)',
    border: 'rgba(37, 99, 235, 0.25)',
    accent: '#2563eb',
  },
  success: {
    surface: 'rgba(22, 163, 74, 0.1)',
    border: 'rgba(22, 163, 74, 0.3)',
    accent: '#16a34a',
  },
  warning: {
    surface: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.35)',
    accent: '#d97706',
  },
  error: {
    surface: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.32)',
    accent: '#dc2626',
  },
}

const withVariant = (variant: AlertVariant) => {
  const tokens = variantTokens[variant]
  return css`
    --alert-surface: ${tokens.surface};
    --alert-border: ${tokens.border};
    --alert-accent: ${tokens.accent};
  `
}

export const AlertContainer = styled.section<{ $variant: AlertVariant, $framed: boolean }>`
  ${({ $variant }) => withVariant($variant)}
  ${({ $framed }) => $framed
    ? css`
        margin-top: var(--space-md);
        border: 1px solid var(--alert-border);
        border-radius: 12px;
        padding: 14px;
        background: linear-gradient(120deg, var(--alert-surface), transparent 60%), var(--background-100);
        box-shadow: var(--elevation-soft);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: var(--alert-accent);
          opacity: 0.85;
        }
      `
    : css`
        margin-top: 0;
        border: none;
        border-radius: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
      `}
  color: var(--text-primary);

  @media (prefers-color-scheme: dark) {
    ${({ $framed }) => $framed
      ? css`
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 55%), var(--background-100);
          border-color: color-mix(in oklab, var(--alert-border) 75%, var(--normal-500) 25%);
        `
      : css`
          background: transparent;
        `}
  }

  @media (max-width: 640px) {
    ${({ $framed }) => $framed && css`
      padding: 12px;
    `}
  }
`

export const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm);
`

export const HeadContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

export const IconBadge = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: color-mix(in oklab, var(--alert-accent) 16%, transparent);
  color: var(--alert-accent);
  flex: 0 0 auto;
`

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Title = styled.h2`
  margin: 0;
  font-size: var(--font-size-lg);
  line-height: 1.3;
  letter-spacing: -0.01em;
`

export const Summary = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.65;
  color: var(--text-secondary);
`

export const CloseButton = styled.button`
  border: 1px solid var(--normal-300);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 999px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease, border-color var(--transition-fast) ease, color var(--transition-fast) ease;

  &:hover {
    background: var(--background-200);
    border-color: var(--normal-400);
    color: var(--text-primary);
  }
`

export const MetaGrid = styled.dl`
  margin: var(--space-sm) 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const MetaItem = styled.div`
  margin: 0;
  padding: 8px 10px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 84%, var(--alert-accent) 16%);
  background: color-mix(in oklab, var(--background-100) 88%, var(--alert-surface) 12%);
  border-radius: 8px;
  overflow: hidden;
`

export const MetaLabel = styled.dt`
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
`

export const MetaValue = styled.dd`
  margin: 4px 0 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MetaLink = styled.a`
  margin: 4px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--primary-color);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 3px;

  &:hover {
    text-decoration-thickness: 0.12em;
  }
`

export const LabelSection = styled.div`
  margin-top: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 0;
`

export const LabelList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
`

export const LabelLink = styled.a`
  display: inline-flex;
  text-decoration: none;
  border-radius: 999px;

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

export const Copyright = styled.p`
  margin: var(--space-sm) 0 0;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  color: var(--text-muted);
`

export const ShareWrap = styled.div`
  margin-top: var(--space-sm);

  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  button {
    background: transparent !important;
    border-color: var(--normal-300) !important;
  }

  @media (prefers-color-scheme: dark) {
    button {
      background: transparent !important;
      border-color: var(--normal-500) !important;
    }
  }
`
