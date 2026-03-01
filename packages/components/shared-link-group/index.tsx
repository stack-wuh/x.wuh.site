'use client';
import * as React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { buttonTokens } from '../button'
import { TBaseColorLevel } from '../themes/tokens'

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
`

const SLabel = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
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

const IconWeibo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-12c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
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

const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

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
