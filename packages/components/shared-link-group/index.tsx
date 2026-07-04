'use client';
import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { buttonTokens } from '../button'
import { IconWechat, IconQQ, IconWeibo, IconTwitter, IconEmail, IconLink, IconCopy } from '../icons'

type ShareType = 'wechat' | 'qq' | 'weibo' | 'twitter' | 'email' | 'link' | 'copy' | 'custom'

export type ShareItem = {
  type: ShareType
  href?: string
  title?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export type SharedLinkGroupSize = 'small' | 'medium' | 'large'

export interface SharedLinkGroupProps {
  items: ShareItem[]
  size?: SharedLinkGroupSize
  gap?: number
  label?: string
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.08); }
  50% { box-shadow: 0 0 0 8px rgba(0,0,0,0.04); }
  100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
`

const iconBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 0;
  margin-top: 48px;
  border-top: 1px solid var(--normal-300);
  animation: ${fadeIn} 0.4s ease;

  @media (prefers-color-scheme: dark) {
    border-top-color: var(--normal-600);
  }
`

const SLabel = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: var(--text-primary);
    opacity: 0.8;
  }
`

const SGroup = styled.div<{ $gap: number }>`
  display: flex;
  align-items: center;
  gap: ${(p) => `${p.$gap}px`};
`

const getSizeVars = (size: SharedLinkGroupSize) => {
  const h = size === 'small' ? 36 : size === 'large' ? 44 : 40
  const fs = size === 'small' ? 14 : size === 'large' ? 16 : 14
  return { h, fs }
}

const SShareButton = styled.button<{ $size: SharedLinkGroupSize; $hasLink: boolean }>`
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
  border-radius: 999px;
  color: var(--text-primary);
  background: var(--background-200);
  border: 1px solid var(--normal-300);
  font-size: var(--fs);
  cursor: ${p => p.$hasLink ? 'pointer' : 'default'};
  transition: transform ${buttonTokens.transitionDuration} ease, box-shadow ${buttonTokens.transitionDuration} ease, background-color ${buttonTokens.transitionDuration} ease, border-color ${buttonTokens.transitionDuration} ease, color ${buttonTokens.transitionDuration} ease;
  overflow: hidden;
  will-change: transform;
  outline: none;

  &:hover {
    transform: translateY(-2px) scale(1.08);
    background: var(--background-300);
    border-color: var(--primary-color);
    animation: ${pulse} 1s ease;
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }
  &:active {
    transform: translateY(0) scale(1.02);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-700);
    border-color: var(--normal-500);
    color: var(--text-primary);

    &:hover {
      background: var(--normal-600);
      border-color: var(--primary-color);
    }
    &:focus-visible {
      box-shadow: 0 0 0 2px var(--background-dark-500), 0 0 0 4px var(--primary-400);
    }
  }
`

const SIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: color ${buttonTokens.transitionDuration} ease, transform ${buttonTokens.transitionDuration} ease;
  svg {
    width: 1em;
    height: 1em;
  }
  ${SShareButton}:hover & {
    color: var(--primary-color);
    animation: ${iconBounce} 0.5s ease;
  }

  @media (prefers-color-scheme: dark) {
    color: var(--text-primary);
    opacity: 0.85;
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
  white-space: nowrap;
  box-shadow: var(--elevation-soft);
  opacity: 0;
  pointer-events: none;
  transition: opacity ${buttonTokens.transitionDuration} ease, transform ${buttonTokens.transitionDuration} ease;
  ${SShareButton}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    color: var(--text-primary);
    border-color: var(--normal-500);
  }
`

const SLink = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
`

const getPresetIcon = (type: ShareType) => {
  switch (type) {
    case 'wechat':
      return <IconWechat />
    case 'qq':
      return <IconQQ />
    case 'weibo':
      return <IconWeibo />
    case 'twitter':
      return <IconTwitter />
    case 'email':
      return <IconEmail />
    case 'link':
      return <IconLink />
    case 'copy':
      return <IconCopy />
    default:
      return null
  }
}

const SharedLinkGroup: React.FC<SharedLinkGroupProps> = ({
  items,
  size = 'medium',
  gap = 12,
  label = '分享到'
}) => {
  const handleClick = (item: ShareItem) => {
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <SContainer>
      {label && <SLabel>{label}</SLabel>}
      <SGroup $gap={gap}>
        {items.map((item) => {
          const icon = item.icon ?? getPresetIcon(item.type)
          const hasLink = !!item.href || !!item.onClick

          return (
            <div key={`${item.type}-${item.title || ''}`} style={{ position: 'relative' }}>
              {item.href ? (
                <SLink href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.title ?? item.type}>
                  <SShareButton $size={size} $hasLink={hasLink} aria-label={item.title ?? item.type}>
                    <SIcon aria-hidden="true">{icon}</SIcon>
                    {item.title && <STitle>{item.title}</STitle>}
                  </SShareButton>
                </SLink>
              ) : (
                <SShareButton
                  $size={size}
                  $hasLink={hasLink}
                  onClick={() => handleClick(item)}
                  aria-label={item.title ?? item.type}
                >
                  <SIcon aria-hidden="true">{icon}</SIcon>
                  {item.title && <STitle>{item.title}</STitle>}
                </SShareButton>
              )}
            </div>
          )
        })}
      </SGroup>
    </SContainer>
  )
}

export default SharedLinkGroup
