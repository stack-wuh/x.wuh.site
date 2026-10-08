'use client'

import * as React from 'react'
import Link from 'next/link'
import { buttonTokens, type ButtonColor, type ButtonSize, type ButtonVariant } from './tokens'
import type { ButtonProps } from './types'
import * as S from './styles'

export type { ButtonColor, ButtonProps, ButtonSize, ButtonVariant }

// 站内路径（含查询串）一律走客户端软导航：裸锚点会全文档重载，杀根布局的全局状态（播放器）；
// 协议相对与绝对地址（http/https/mailto 等）维持原生 anchor 语义
const isInternalHref = (href: string): boolean => href.startsWith('/') && !href.startsWith('//')

const BUTTON_ONLY_KEYS: (keyof ButtonProps)[] = [
  'variant',
  'color',
  'size',
  'icon',
  'iconPosition',
  'fullWidth',
  'type',
]

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
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

    const legacyType = props.type
    const effectiveColor: ButtonColor =
      legacyType === 'primary' || legacyType === 'success' || legacyType === 'warning' || legacyType === 'danger'
        ? legacyType
        : legacyType === 'ghost'
          ? 'secondary'
          : color

    const content = (
      <>
        {icon && iconPosition === 'left' && <span className='button-icon'>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className='button-icon'>{icon}</span>}
      </>
    )

    if (href !== undefined && !disabled) {
      return (
        <S.StyledLink
          as={isInternalHref(href) ? Link : undefined}
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
        </S.StyledLink>
      )
    }

    return (
      <S.StyledButton
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
      </S.StyledButton>
    )
  },
)

Button.displayName = 'Button'

export default Button
export { buttonTokens }
