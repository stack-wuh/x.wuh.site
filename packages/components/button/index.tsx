'use client'

import * as React from 'react'
import styled, { css } from 'styled-components'
import {
  buttonTokens,
  type ButtonVariant,
  type ButtonColor,
  type ButtonSize,
} from './tokens'

export type { ButtonVariant, ButtonColor, ButtonSize }

export interface IButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮内容 */
  children?: React.ReactNode
  /** Material 变体：filled 实心 / outlined 描边 / text 文字 */
  variant?: ButtonVariant
  /** 色彩：对应主题 token */
  color?: ButtonColor
  /** 尺寸 */
  size?: ButtonSize
  /** 图标（iconfont 类名或字符） */
  icon?: React.ReactNode
  /** 图标位置 */
  iconPosition?: 'left' | 'right'
  /** 作为链接时的 href，渲染为 <a> */
  href?: string
  /** 链接 target（如 _blank） */
  target?: string
  /** 链接 rel（如 noopener noreferrer） */
  rel?: string
  /** 禁用 */
  disabled?: boolean
  /** 全宽 */
  fullWidth?: boolean
  /** 不推荐：保留兼容。原生 type 为 button | submit | reset */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost' | 'href' | 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
}

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

/** 仅用于 styled，不传到 DOM */
interface IStyledButtonTransientProps {
  $variant?: ButtonVariant
  $color?: ButtonColor
  $size?: ButtonSize
  $fullWidth?: boolean
  $disabled?: boolean
}

const getVariantStyles = (
  $variant: ButtonVariant,
  $color: ButtonColor,
  $disabled: boolean
) => {
  const c = COLOR_MAP[$color]
  const cHover = COLOR_HOVER_MAP[$color]
  const onSurface = 'var(--background-100, #fff)'
  const outlineColor = $disabled ? 'var(--normal-400)' : c
  const textColor = $disabled ? 'var(--normal-500)' : c
  const textColorHover = $disabled ? textColor : cHover

  if ($variant === 'filled') {
    return css<IStyledButtonTransientProps>`
      background-color: ${$disabled ? 'var(--normal-300)' : c};
      color: ${$disabled ? 'var(--normal-600)' : onSurface};
      border: none;
      box-shadow: ${$disabled ? 'none' : buttonTokens.elevation.default};

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
    `
  }
  if ($variant === 'outlined') {
    return css<IStyledButtonTransientProps>`
      background-color: transparent;
      color: ${textColor};
      border: 1px solid ${outlineColor};

      &:hover:not(:disabled) {
        background-color: ${$disabled ? 'transparent' : `rgba(0, 0, 0, 0.04)`};
      }
      &:focus-visible:not(:disabled) {
        outline: none;
        box-shadow: 0 0 0 2px var(--background-100), 0 0 0 3px ${outlineColor};
      }
    `
  }
  /* text */
  return css<IStyledButtonTransientProps>`
    background-color: transparent;
    color: ${textColor};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${$disabled ? 'transparent' : `rgba(0, 0, 0, 0.04)`};
      color: ${textColor};
    }
    &:focus-visible:not(:disabled) {
      outline: 2px solid ${textColor};
      outline-offset: 2px;
    }
  `
}

const StyledButton = styled.button<IStyledButtonTransientProps>`
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

  /* Material 风格 Ripple 容器 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255, 255, 255, 0.4) 0%, transparent 60%);
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
    transition: opacity 120ms ease, transform 120ms ease;
  }
  &:active:not(:disabled)::after {
    opacity: 1;
    transform: scale(2);
    transition: opacity 0s, transform 0s;
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

const StyledLink = styled.a<IStyledButtonTransientProps>`
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
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
    transition: opacity 120ms ease, transform 120ms ease;
  }
  &:active::after {
    opacity: 1;
    transform: scale(2);
    transition: opacity 0s, transform 0s;
  }

  & .button-icon {
    display: inline-flex;
    font-size: 1.1em;
  }
`

const BUTTON_ONLY_KEYS: (keyof IButtonProps)[] = [
  'variant',
  'color',
  'size',
  'icon',
  'iconPosition',
  'fullWidth',
  'type',
]

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IButtonProps>(
  (props, ref) => {
    const {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      icon,
      iconPosition = 'left',
      href,
      disabled = false,
      fullWidth = false,
      children,
      onClick,
      type: typeProp = 'button',
      ...rest
    } = props

    const domProps = { ...rest } as Record<string, unknown>
    BUTTON_ONLY_KEYS.forEach((k) => delete domProps[k])
    const buttonType: 'button' | 'submit' | 'reset' =
      typeProp === 'submit' || typeProp === 'reset' ? typeProp : 'button'

    const legacyType = (props as IButtonProps).type
    const effectiveColor: ButtonColor =
      legacyType === 'primary' || legacyType === 'success' || legacyType === 'warning' || legacyType === 'danger'
        ? legacyType
        : legacyType === 'ghost'
          ? 'secondary'
          : color

    const content = (
      <>
        {icon && iconPosition === 'left' && <span className="button-icon">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="button-icon">{icon}</span>}
      </>
    )

    if (href !== undefined && !disabled) {
      return (
        <StyledLink
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          $variant={variant}
          $color={effectiveColor}
          $size={size}
          $fullWidth={fullWidth}
          $disabled={false}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          {...(domProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </StyledLink>
      )
    }

    return (
      <StyledButton
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonType}
        $variant={variant}
        $color={effectiveColor}
        $size={size}
        $fullWidth={fullWidth}
        $disabled={disabled}
        disabled={disabled}
        onClick={onClick}
        {...(domProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
export { buttonTokens }
