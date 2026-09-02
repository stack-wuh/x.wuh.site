import styled from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/**
 * 返回首页/回到顶部/点赞 三钮组，两种形态：
 * - default：散点圆钮（文末）
 * - compact：连体分段紧凑组（目录侧栏工具列）
 *
 * 动画遵循站点动画规范（knowledge/animation-system.md）：hover 只做
 * 颜色/背景过渡（--motion-dur-quick × --motion-ease-out-soft），组件内
 * 不定义循环/闪烁关键帧；点赞 hover 用 filled 按钮同款 primary-600→800
 * 主题渐变。明暗只用主题 token，禁止 prefers-color-scheme 直写。
 */

const hoverTransition = `
  color var(--motion-dur-quick) var(--motion-ease-out-soft),
  background-color var(--motion-dur-quick) var(--motion-ease-out-soft),
  border-color var(--motion-dur-quick) var(--motion-ease-out-soft),
  transform var(--motion-dur-quick) var(--motion-ease-out-soft);
`

export const FloatingButton = styled(Button)<{ $compact?: boolean }>`
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
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  transition: ${hoverTransition};

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }

  ${({ $compact }) =>
    $compact
      ? `
    width: 44px;
    height: 38px;
    flex: none;
    border-radius: 0;
    border: none;
    background: transparent;

    &:hover:not(:disabled) {
      transform: none;
      background: var(--background-300);
      border: none;
      color: var(--primary-color);
    }

    &:active:not(:disabled) {
      transform: none;
    }

    &:focus-visible {
      box-shadow: inset 0 0 0 2px var(--primary-300);
    }

    /* dark 下 background-300 与纸面几乎同色，换用提亮一档的灰 */
    [data-color-scheme="dark"] & {
      &:hover:not(:disabled) {
        background: var(--normal-200);
      }
    }
  `
      : ''}
`

export const LikeButton = styled(Button)<{ $compact?: boolean }>`
  --btn-px: 0;
  --btn-py: 0;
  width: auto;
  padding: 0 24px;
  gap: 8px;
  border-radius: 999px;
  background: var(--background-200) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color);
  outline: none;

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

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  transition: ${hoverTransition}, box-shadow var(--motion-dur-quick) var(--motion-ease-out-soft);

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }

  ${({ $compact }) =>
    $compact
      ? `
    flex: 1;
    height: 38px;
    padding: 0 12px;
    gap: 6px;
    justify-content: center;
    border-radius: 0;
    border: none;
    /* 清掉 Button filled 自带的渐变底，hover 时换成 primary-600→800 主题渐变 */
    background-color: var(--primary-color) !important;
    background-image: none !important;
    border-color: transparent !important;
    color: #fff;
    font-size: var(--font-size-sm);

    &:hover:not(:disabled) {
      transform: none;
      background-color: var(--primary-color) !important;
      background-image: linear-gradient(90deg, var(--primary-600), var(--primary-800)) !important;
      border: none;
      color: #fff;
      box-shadow: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }

    &:focus-visible {
      box-shadow: inset 0 0 0 2px var(--background-100);
    }
  `
      : ''}
`

export const FloatingButtonGroup = styled.div<{ $compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-wrap: wrap;
    gap: 10px;
  }

  ${({ $compact }) =>
    $compact
      ? `
    gap: 0;
    margin-top: 0;
    flex-wrap: nowrap;
    width: 100%;
    border: 1px solid var(--normal-300);
    border-radius: 999px;
    background: var(--background-200);
    overflow: hidden;
  `
      : ''}
`

/** compact 形态的段间发丝分隔线 */
export const SegmentDivider = styled.span`
  width: 1px;
  height: 16px;
  background: var(--normal-300);
  flex: none;
`
