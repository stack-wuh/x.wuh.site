'use client'
import * as React from 'react'
import styles from 'styled-components'
import { TSpaceTokens } from '@wuh.site/components/themes/tokens'
import { ThemeProviderComponent } from '@wuh.site/components/themes/themeProvider'
// import { buttonColorTokens } from './tokens'

const buttonTypes = ['primary', 'success', 'warning', 'danger', 'ghost', 'href'] as const

export type TButtonType = (typeof buttonTypes)[number]
export interface IButtonProps {
  /** 按钮内容 */
  children?: React.ReactNode
  type?: TButtonType
  icon?: string
  iconPosition?: 'left' | 'right'
  href?: string
  gradient?: boolean
  padding?: string | number
  margin?: string | number
  size?: TSpaceTokens
  onClick?: () => void
}

const StyledButton = styles.button<IButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: ${(props) => {
    return `var(--font-size-${props.size}, ${props.theme.fontSizes.base})`
  }};
  border: none;
  border-radius: 4px;
  background-color: var(--button-primary-color, #007bff);
  color: var(--button-text-color, #ffffff);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--, #0056b3);
  }

  & .iconfont {
    margin-right: 8px;
    font-size: 16px;
  }
`

const IconWrapper: React.FC<IButtonProps> = (props) => {
  return <i className={'iconfont'}>{props.children}</i>
}

const Button: React.FC<IButtonProps> = (props) => {
  return (
    <React.Fragment>
      <ThemeProviderComponent theme={{}}>
        <StyledButton {...props}>
          <IconWrapper>{props.icon}</IconWrapper>
          {props.children}
        </StyledButton>
      </ThemeProviderComponent>
    </React.Fragment>
  )
}

export default Button
