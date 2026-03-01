'use client';
import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { buttonTokens } from '../button'
import { TBaseColorLevel } from '../themes/tokens'

type LinkType = 'wechat' | 'qq' | 'twitter' | 'email' | 'github' | 'douban' | 'custom'

export type LinkItem = {
  type: LinkType
  href: string
  title?: string
  icon?: React.ReactNode
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

const SItem = styled.li`
  display: inline-flex;
`

const SLink = styled.a<{ $size: LinkGroupSize }>`
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
  ${SLink}:hover & {
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
`

const IconWechat = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5.5 9.5a6.5 6.5 0 1 1 12.8 1.6 5 5 0 1 1-8.7 4.1l-3.1 1.2.9-3.3A6.5 6.5 0 0 1 5.5 9.5zm3.2-.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm6.6 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
  </svg>
)

const IconQQ = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c3.3 0 6 2.7 6 6 0 1.4-.5 2.7-1.4 3.7.6 1.1 1.4 2.9 1.4 4.3 0 .6-.4 1-1 1-.9 0-2.4-.9-3.5-1.9-.7.3-1.4.4-2.5.4s-1.8-.1-2.5-.4c-1.1 1-2.6 1.9-3.5 1.9-.6 0-1-.4-1-1 0-1.4.8-3.2 1.4-4.3A6 6 0 0 1 6 8c0-3.3 2.7-6 6-6z" />
  </svg>
)

const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.8-2.2-.8.5-1.7.8-2.6 1-1.6-1.7-4.4-1.4-5.7.6-1 1.4-.8 3.3.4 4.4-2.8-.1-5.4-1.5-7.1-3.7-.9 1.6-.4 3.8 1.2 4.9-.6 0-1.2-.2-1.7-.5 0 1.7 1.2 3.3 3 3.6-.5.1-1 .2-1.6.1.5 1.5 2 2.6 3.7 2.6-1.7 1.3-3.8 2-5.9 2-.4 0-.8 0-1.2-.1 2.2 1.4 4.8 2.1 7.4 2.1 7.9 0 12.3-6.7 12-12.5.8-.6 1.5-1.3 2-2.1z" />
  </svg>
)

const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6zm2 0 7 5 7-5H5zm14 12V9l-7 5-7-5v9h14z" />
  </svg>
)

const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .8A11.2 11.2 0 0 0 .8 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .7 2 .7 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.7.1-3.4 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C18.9 6.1 20 6.4 20 6.4c.6 1.7.2 3.1.1 3.4.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.5-5.3 5.8.5.4.9 1.3.9 2.6v3.8c0 .3.2.7.8.6A11.2 11.2 0 0 0 23.2 12 11.2 11.2 0 0 0 12 .8z" />
  </svg>
)

const IconDouban = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 6h14v2H5V6zm1.5 4h11v7h-11v-7zm2 2v3h7v-3h-7zM4 19h16v2H4v-2z" />
  </svg>
)

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
        return (
          <SItem key={`${item.type}-${item.href}`} role="listitem">
            <SLink href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.title ?? item.type} $size={size}>
              <SIcon aria-hidden="true">{icon}</SIcon>
              {item.title && <STitle>{item.title}</STitle>}
            </SLink>
          </SItem>
        )
      })}
    </SGroup>
  )
}

export default LinkGroup
