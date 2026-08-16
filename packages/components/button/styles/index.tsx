import styled, { css } from 'styled-components'
import { buttonTokens, type ButtonColor } from '../tokens'
import type { ButtonTransientProps, ButtonVariant } from '../specs'

const COLOR_MAP: Record<ButtonColor, string> = {
  primary: 'var(--primary-color)',
  secondary: 'var(--secondary-color)',
  success: 'var(--success-color)',
  warning: 'var(--warning-color)',
  danger: 'var(--danger-color)',
}

const COLOR_HOVER_MAP: Record<ButtonColor, string> = {
  primary: 'var(--primary-600)',
  secondary: 'var(--normal-600)',
  success: 'var(--success-600)',
  warning: 'var(--warning-600)',
  danger: 'var(--danger-600)',
}

const getVariantStyles = (
  $variant: ButtonVariant,
  $color: ButtonColor,
  $disabled: boolean,
) => {
  const c = COLOR_MAP[$color]
  const cHover = COLOR_HOVER_MAP[$color]
  const onSurface = 'var(--background-100, #fff)'
  const outlineColor = $disabled ? 'var(--normal-400)' : c
  const textColor = $disabled ? 'var(--normal-500)' : c
  const textColorHover = $disabled ? textColor : cHover

  if ($variant === 'filled') {
    return css<ButtonTransientProps>`
      background-color: ${$disabled ? 'var(--normal-300)' : c};
      color: ${$disabled ? 'var(--normal-600)' : onSurface};
      border: none;
      box-shadow: ${$disabled ? 'none' : buttonTokens.elevation.default};

      ${$color === 'primary' &&
      !$disabled &&
      css`
        background-color: transparent;
        background-image: linear-gradient(90deg, var(--primary-color), var(--primary-700));
      `}

      &:hover:not(:disabled) {
        background-color: ${$disabled ? 'var(--normal-300)' : cHover};
        box-shadow: ${$disabled ? 'none' : buttonTokens.elevation.hover};
      }
      &:active:not(:disabled) {
        box-shadow: ${buttonTokens.elevation.active};
      }
      &:focus-visible:not(:disabled) {
        outline: none;
        box-shadow: ${buttonTokens.elevation.hover}, 0 0 0 2px var(--primary-300), 0 0 0 4px ${c};
      }

      ${$color === 'primary' &&
      !$disabled &&
      css`
        &:hover:not(:disabled) {
          background-color: transparent;
          background-image: linear-gradient(90deg, var(--primary-600), var(--primary-800));
        }
      `}
    `
  }
  if ($variant === 'outlined') {
    return css<ButtonTransientProps>`
      background-color: transparent;
      color: ${textColor};
      border: 1px solid ${outlineColor};

      &:hover:not(:disabled) {
        background-color: ${$disabled ? 'transparent' : `color-mix(in oklab, var(--background-100) 55%, transparent)`};
        backdrop-filter: blur(10px);
      }
      &:focus-visible:not(:disabled) {
        outline: none;
        box-shadow: 0 0 0 2px var(--background-100), 0 0 0 3px ${outlineColor};
      }
    `
  }
  return css<ButtonTransientProps>`
    background-color: transparent;
    color: ${textColor};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${$disabled ? 'transparent' : 'rgba(0, 0, 0, 0.04)'};
      color: ${textColorHover};
    }
    &:focus-visible:not(:disabled) {
      outline: 2px solid ${textColor};
      outline-offset: 2px;
    }
  `
}

export const StyledButton = styled.button<ButtonTransientProps>`
  --btn-h: ${(p) => buttonTokens.height[p.$size ?? 'medium']}px;
  --btn-px: ${(p) => buttonTokens.paddingX[p.$size ?? 'medium']}px;
  --btn-py: ${(p) => buttonTokens.paddingY[p.$size ?? 'medium']}px;
  --btn-fs: ${(p) => buttonTokens.fontSize[p.$size ?? 'medium']}px;
  --btn-radius: ${(p) => buttonTokens.borderRadius[p.$size ?? 'medium']};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--btn-h);
  padding: var(--btn-py) var(--btn-px);
  font-size: var(--btn-fs);
  font-weight: ${buttonTokens.fontWeight};
  letter-spacing: ${buttonTokens.letterSpacing}em;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition:
    background-color ${buttonTokens.transitionDuration} ease,
    color ${buttonTokens.transitionDuration} ease,
    border-color ${buttonTokens.transitionDuration} ease,
    box-shadow ${buttonTokens.transitionDuration} ease;

  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  position: relative;
  overflow: hidden;

  ${(p) => getVariantStyles(p.$variant ?? 'filled', p.$color ?? 'primary', p.$disabled ?? false)}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease;
  }
  &:active:not(:disabled)::after {
    opacity: 1;
    transition: opacity 0s;
  }

  & .button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
  }
  & .button-icon:first-child {
    margin-right: 0;
  }
  & .button-icon:last-child {
    margin-left: 0;
  }
`

export const StyledLink = styled.a<ButtonTransientProps>`
  --btn-h: ${(p) => buttonTokens.height[p.$size ?? 'medium']}px;
  --btn-px: ${(p) => buttonTokens.paddingX[p.$size ?? 'medium']}px;
  --btn-py: ${(p) => buttonTokens.paddingY[p.$size ?? 'medium']}px;
  --btn-fs: ${(p) => buttonTokens.fontSize[p.$size ?? 'medium']}px;
  --btn-radius: ${(p) => buttonTokens.borderRadius[p.$size ?? 'medium']};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--btn-h);
  padding: var(--btn-py) var(--btn-px);
  font-size: var(--btn-fs);
  font-weight: ${buttonTokens.fontWeight};
  letter-spacing: ${buttonTokens.letterSpacing}em;
  border-radius: var(--btn-radius);
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color ${buttonTokens.transitionDuration} ease,
    color ${buttonTokens.transitionDuration} ease,
    border-color ${buttonTokens.transitionDuration} ease,
    box-shadow ${buttonTokens.transitionDuration} ease;

  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  position: relative;
  overflow: hidden;

  ${(p) => getVariantStyles(p.$variant ?? 'filled', p.$color ?? 'primary', false)}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease;
  }
  &:active::after {
    opacity: 1;
    transition: opacity 0s;
  }

  & .button-icon {
    display: inline-flex;
    font-size: 1.1em;
  }
`
