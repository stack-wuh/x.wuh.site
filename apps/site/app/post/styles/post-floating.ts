import styled, { keyframes } from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/**
 * 返回首页/回到顶部/点赞 三钮组：与 SharedLinkGroup（SShareButton）同款组件语言——
 * 圆形 outlined 钮 + hover 上浮 1.08 与脉冲光晕。样式只经主题 token 适配明暗，
 * 禁止 prefers-color-scheme 直写（手动主题体系）。
 */
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 25%, transparent); }
  50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--primary-color) 12%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 25%, transparent); }
`

const heartBeat = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`

export const FloatingButton = styled(Button)`
  --btn-px: 0;
  --btn-py: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  will-change: transform;
  outline: none;

  svg {
    width: 1em;
    height: 1em;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
    background: var(--background-300);
    border-color: var(--primary-color);
    color: var(--text-primary);
    animation: ${pulse} 1s ease;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`

export const LikeButton = styled(Button)`
  --btn-px: 0;
  --btn-py: 0;
  width: auto;
  padding: 0 24px;
  gap: 8px;
  border-radius: 999px;
  background: var(--background-200) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color);
  will-change: transform;

  svg {
    width: 1em;
    height: 1em;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
    background: var(--primary-color) !important;
    border-color: transparent !important;
    color: #fff;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--primary-color) 35%, transparent);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }

  &:hover:not(:disabled) svg {
    animation: ${heartBeat} 2s ease-in-out infinite;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;

    &:hover:not(:disabled) svg {
      animation: none;
    }
  }
`

export const FloatingButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`
