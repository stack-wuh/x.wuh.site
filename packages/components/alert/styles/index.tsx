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

export const AlertContainer = styled.section<{ $variant: AlertVariant }>`
  ${({ $variant }) => withVariant($variant)}
  margin-top: var(--space-xl);
  border: 1px solid var(--alert-border);
  border-left: 4px solid var(--alert-accent);
  background: linear-gradient(135deg, var(--alert-surface), transparent 60%), var(--background-100);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--elevation-soft);
  color: var(--text-primary);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 55%), var(--normal-800);
    border-color: color-mix(in oklab, var(--alert-border) 75%, var(--normal-500) 25%);
  }

  @media (max-width: 640px) {
    padding: 16px;
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
  gap: 10px;
`

export const IconBadge = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
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
  line-height: 1.35;
  letter-spacing: -0.01em;
`

export const Summary = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
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
  margin: var(--space-md) 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const MetaItem = styled.div`
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--normal-300);
  background: color-mix(in oklab, var(--background-100) 85%, var(--alert-surface) 15%);
  border-radius: 10px;
`

export const MetaLabel = styled.dt`
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

export const MetaValue = styled.dd`
  margin: 4px 0 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-primary);
`

export const MetaLink = styled.a`
  margin: 4px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--primary-color);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 3px;

  &:hover {
    text-decoration-thickness: 0.12em;
  }
`

export const LabelSection = styled.div`
  margin-top: var(--space-md);
`

export const LabelList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  margin: var(--space-md) 0 0;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  color: var(--text-muted);
`

export const ShareWrap = styled.div`
  margin-top: var(--space-sm);

  > div {
    margin-top: 0;
    padding: 16px 0 0;
    border-top-style: dashed;
  }
`
