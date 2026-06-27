'use client';
import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { buttonTokens } from '../button'
import { IconWechat, IconQQ, IconTwitter, IconEmail, IconGithub, IconDouban } from '../icons'

type LinkType = 'wechat' | 'qq' | 'twitter' | 'email' | 'github' | 'douban' | 'custom'

export type LinkItem = {
  type: LinkType
  href?: string
  title?: string
  icon?: React.ReactNode
  onClick?: () => void
  hideOnMobile?: boolean
}

export type LinkGroupSize = 'small' | 'medium' | 'large'

export interface LinkGroupProps {
  items: LinkItem[]
  size?: LinkGroupSize
  gap?: number
}

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.08); }
  50% { box-shadow: 0 0 0 6px rgba(0,0,0,0.06); }
  100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.02); }
`

const iconSpin = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(6deg); }
  100% { transform: rotate(0deg); }
`

const SGroup = styled.ul<{ $gap: number }>`
  display: flex;
  align-items: center;
  gap: ${(p) => `${p.$gap}px`};
  list-style: none;
  padding: 0;
  margin: 0;
`

const getSizeVars = (size: LinkGroupSize) => {
  const h = size === 'small' ? 32 : size === 'large' ? 48 : 40
  const fs = size === 'small' ? 14 : size === 'large' ? 16 : 14
  return { h, fs }
}

const SItem = styled.li<{ $hideOnMobile?: boolean }>`
  display: inline-flex;

  ${(p) => p.$hideOnMobile && css`
    @media (max-width: 520px) {
      display: none;
    }
  `}
`

const controlStyles = css<{ $size: LinkGroupSize }>`
  ${(p) => {
    const { h, fs } = getSizeVars(p.$size)
    return css`
      --h: ${h}px;
      --fs: ${fs}px;
    `
  }}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--h);
  height: var(--h);
  border-radius: 4px;
  color: var(--text-primary);
  background: var(--background-100);
  border: none;
  text-decoration: none;
  font-size: var(--fs);
  position: relative;
  transition: transform ${buttonTokens.transitionDuration} ease, box-shadow ${buttonTokens.transitionDuration} ease, border-color ${buttonTokens.transitionDuration} ease, background-color ${buttonTokens.transitionDuration} ease, color ${buttonTokens.transitionDuration} ease, border-radius ${buttonTokens.transitionDuration} ease;
  overflow: hidden;
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px) scale(1.06);
    background: var(--background-200);
    border-radius: 50%;
    animation: ${pulse} 900ms ease;
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
    border-radius: 50%;
  }
  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);

    &:hover {
      background: var(--normal-700);
    }
    &:focus-visible {
      box-shadow: 0 0 0 2px var(--normal-900), 0 0 0 4px var(--primary-400);
    }
  }
`

const SControl = styled.button<{ $size: LinkGroupSize }>`
  ${controlStyles}
`

const SLink = styled(SControl).attrs({ as: 'a' })`
  text-decoration: none;
`

const SIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  transition: color ${buttonTokens.transitionDuration} ease, transform ${buttonTokens.transitionDuration} ease;
  will-change: transform;
  svg {
    width: 1em;
    height: 1em;
  }
  ${SControl}:hover &, ${SLink}:hover & {
    transform: translateY(-1px);
    animation: ${iconSpin} 420ms ease;
  }
`

const STitle = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: var(--background-100);
  color: var(--text-secondary);
  border: 1px solid var(--normal-300);
  border-radius: 8px;
  font-size: 12px;
  padding: 4px 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${buttonTokens.transitionDuration} ease, transform ${buttonTokens.transitionDuration} ease;
  white-space: nowrap;
  ${SLink}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-900);
    color: var(--text-primary);
    border-color: var(--normal-600);
  }
`

const getPresetIcon = (type: LinkType) => {
  switch (type) {
    case 'wechat':
      return <IconWechat />
    case 'qq':
      return <IconQQ />
    case 'twitter':
      return <IconTwitter />
    case 'email':
      return <IconEmail />
    case 'github':
      return <IconGithub />
    case 'douban':
      return <IconDouban />
    default:
      return null
  }
}

const LinkGroup: React.FC<LinkGroupProps> = ({ items, size = 'medium', gap = 12 }) => {
  return (
    <SGroup $gap={gap} role="list">
      {items.map((item) => {
        const icon = item.icon ?? getPresetIcon(item.type)
        const label = item.title ?? item.type

        return (
          <SItem key={`${item.type}-${label}`} role="listitem" $hideOnMobile={item.hideOnMobile}>
            {item.href ? (
              <SLink
                $size={size}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <SIcon aria-hidden="true">{icon}</SIcon>
                {item.title && <STitle>{item.title}</STitle>}
              </SLink>
            ) : (
              <SControl
                $size={size}
                type="button"
                onClick={item.onClick}
                aria-label={label}
              >
                <SIcon aria-hidden="true">{icon}</SIcon>
                {item.title && <STitle>{item.title}</STitle>}
              </SControl>
            )}
          </SItem>
        )
      })}
    </SGroup>
  )
}

export default LinkGroup
