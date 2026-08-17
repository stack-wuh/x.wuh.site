'use client'

import styled, { keyframes, css } from 'styled-components'
import { buttonTokens } from '../../button'
import type { LinkGroupSize } from '../specs'

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

export const SGroup = styled.ul<{ $gap: number }>`
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

export const SItem = styled.li<{ $hideOnMobile?: boolean }>`
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

export const SControl = styled.button<{ $size: LinkGroupSize }>`
  ${controlStyles}
`

export const SLink = styled(SControl).attrs({ as: 'a' })`
  text-decoration: none;
`

export const SIcon = styled.span`
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

export const STitle = styled.span`
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
