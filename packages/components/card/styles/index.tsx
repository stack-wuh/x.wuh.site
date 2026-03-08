import styled, { css } from 'styled-components'

export type CardVariant = 'elevated' | 'outlined' | 'filled'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type CardElevation = 0 | 1 | 2 | 3 | 4 | 5
export type CardActionsAlign = 'start' | 'center' | 'end' | 'between'

const ELEVATION_MAP: Record<CardElevation, string> = {
  0: 'none',
  1: '0 1px 2px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.06)',
  2: '0 2px 4px rgba(15, 23, 42, 0.1), 0 3px 8px rgba(15, 23, 42, 0.08)',
  3: '0 4px 10px rgba(15, 23, 42, 0.12), 0 6px 14px rgba(15, 23, 42, 0.09)',
  4: '0 8px 18px rgba(15, 23, 42, 0.14), 0 10px 22px rgba(15, 23, 42, 0.1)',
  5: '0 12px 24px rgba(15, 23, 42, 0.16), 0 16px 28px rgba(15, 23, 42, 0.12)',
}

const SECTION_PADDING_MAP: Record<CardPadding, string> = {
  none: '0',
  sm: 'var(--space-sm, 12px)',
  md: 'var(--space-md, 16px)',
  lg: 'var(--space-lg, 24px)',
}

const ACTIONS_JUSTIFY_MAP: Record<CardActionsAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
}

const resolveHoverElevation = (elevation: CardElevation): CardElevation => {
  if (elevation >= 5) return 5
  return (elevation + 1) as CardElevation
}

const getVariantStyles = (variant: CardVariant, elevation: CardElevation) => {
  if (variant === 'outlined') {
    return css`
      border: 1px solid var(--normal-300, rgba(15, 23, 42, 0.16));
      background: var(--background-100, #ffffff);
      box-shadow: ${ELEVATION_MAP[0]};
    `
  }

  if (variant === 'filled') {
    return css`
      border: 1px solid transparent;
      background: var(--background-200, #f8fafc);
      box-shadow: ${ELEVATION_MAP[Math.max(0, elevation - 1) as CardElevation]};
    `
  }

  return css`
    border: 1px solid var(--normal-200, rgba(15, 23, 42, 0.12));
    background: var(--background-100, #ffffff);
    box-shadow: ${ELEVATION_MAP[elevation]};
  `
}

const interactiveStyles = (variant: CardVariant, elevation: CardElevation) => css`
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${variant === 'outlined'
      ? ELEVATION_MAP[resolveHoverElevation(Math.max(1, elevation) as CardElevation)]
      : ELEVATION_MAP[resolveHoverElevation(elevation)]};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${variant === 'outlined'
      ? ELEVATION_MAP[Math.max(1, elevation) as CardElevation]
      : ELEVATION_MAP[elevation]};
  }
`

const sectionPaddingStyles = css<{ $padding: CardPadding }>`
  padding: ${({ $padding }) => SECTION_PADDING_MAP[$padding]};
`

export const CardRoot = styled.article<{
  $variant: CardVariant
  $elevation: CardElevation
  $interactive: boolean
  $fullWidth: boolean
  $padding: CardPadding
}>`
  ${({ $variant, $elevation }) => getVariantStyles($variant, $elevation)}
  ${sectionPaddingStyles}
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-width: 0;
  border-radius: var(--border-radius-lg, 12px);
  color: var(--text-primary, #0f172a);
  transition:
    box-shadow var(--transition-fast, 200ms) ease,
    transform var(--transition-fast, 200ms) ease,
    border-color var(--transition-fast, 200ms) ease;
  overflow: hidden;

  &:focus-within {
    outline: 2px solid var(--primary-300, rgba(37, 99, 235, 0.35));
    outline-offset: 2px;
  }

  ${({ $interactive, $variant, $elevation }) =>
    $interactive && interactiveStyles($variant, $elevation)}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

export const CardHeaderRoot = styled.header<{
  $divider: boolean
  $padding: CardPadding
}>`
  ${sectionPaddingStyles}
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm, 12px);
  ${({ $divider }) =>
    $divider &&
    css`
      border-bottom: 1px solid var(--normal-200, rgba(15, 23, 42, 0.12));
    `}
`

export const CardContentRoot = styled.div<{
  $divider: boolean
  $padding: CardPadding
}>`
  ${sectionPaddingStyles}
  color: var(--text-secondary, #334155);
  line-height: 1.6;
  min-width: 0;
  word-break: break-word;
  ${({ $divider }) =>
    $divider &&
    css`
      border-top: 1px solid var(--normal-200, rgba(15, 23, 42, 0.12));
    `}
`

export const CardActionsRoot = styled.footer<{
  $divider: boolean
  $padding: CardPadding
  $align: CardActionsAlign
  $wrap: boolean
}>`
  ${sectionPaddingStyles}
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => ACTIONS_JUSTIFY_MAP[$align]};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  gap: var(--space-sm, 12px);
  ${({ $divider }) =>
    $divider &&
    css`
      border-top: 1px solid var(--normal-200, rgba(15, 23, 42, 0.12));
    `}
`
