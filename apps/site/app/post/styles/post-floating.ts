import styled from 'styled-components'
import Button from '@wuh.site/components/button'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/**
 * 返回首页/回到顶部/点赞 三钮组，全断点统一「连体分段胶囊」形态：
 * - default：文末响应式（<640 全宽 max 320px 三等分、触达 ≥44px；≥640 内容宽居中 36px）
 * - compact：目录侧栏工具列（定高 32px，带「点赞吧~」hover 提示）
 *
 * 分段之间保留 padding 内衬：分段填充一旦贴到外框边线，两者会在亚像素取整下
 * 叠成一条脏线（不同页面/缩放下时隐时现），分段自身做圆角让填充与边框彻底脱开。
 *
 * compact 差异一律写成「同一声明内的条件值」，不再用尾部插值块覆盖：
 * styled-components 展平时会把 @media 块提升到普通规则之后，尾部插值的
 * compact 声明被并入基础规则，永远输给媒体查询（32px 实际从未生效过）。
 *
 * 动画遵循站点动画规范（knowledge/animation-system.md）：hover 只做颜色/背景
 * 过渡（--motion-dur-quick × --motion-ease-out-soft），组件内不定义循环/闪烁
 * 关键帧；点赞 hover 用 primary-600→800 主题渐变。明暗只用主题 token，禁止
 * prefers-color-scheme 直写。
 */

const hoverTransition = `
  color var(--motion-dur-quick) var(--motion-ease-out-soft),
  background-color var(--motion-dur-quick) var(--motion-ease-out-soft);
`

export const FloatingButton = styled(Button)<{ $compact?: boolean }>`
  --btn-px: 0;
  --btn-py: 0;
  flex: ${({ $compact }) => ($compact ? '0 0 auto' : '1 1 0')};
  width: ${({ $compact }) => ($compact ? '40px' : 'auto')};
  height: ${({ $compact }) => ($compact ? '32px' : '44px')};
  padding: 0;
  border: none;
  /* 抗乱序加固（同 LikeButton）：即便 Button 变体规则晚于本组件注入，
     边框与圆角也不允许回退到 outlined 形态 */
  border-color: transparent !important;
  border-radius: 999px !important;
  background: transparent;
  color: var(--text-secondary);
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
    background: var(--background-300);
    color: var(--primary-color);
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--primary-300);
  }

  transition: ${hoverTransition};

  @media (min-width: ${BREAKPOINTS.mobile}px) {
    flex: 0 0 auto;
    width: 40px;
    height: ${({ $compact }) => ($compact ? '32px' : '36px')};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* dark 下 background-300 与纸面几乎同色，换用提亮一档的灰 */
  [data-color-scheme='dark'] & {
    &:hover:not(:disabled) {
      background: var(--normal-200);
    }
  }
`

export const LikeButton = styled(Button)<{ $compact?: boolean }>`
  --btn-px: 0;
  --btn-py: 0;
  flex: ${({ $compact }) => ($compact ? '1' : '1.2 1 0')};
  height: ${({ $compact }) => ($compact ? '32px' : '44px')};
  padding: ${({ $compact }) => ($compact ? '0 12px' : '0 20px')};
  ${({ $compact }) => ($compact ? 'font-size: var(--font-size-sm);' : '')}
  gap: 6px;
  justify-content: center;
  border: none;
  border-color: transparent !important;
  border-radius: 999px !important;
  /* 清掉 Button filled 自带的渐变底，hover 换 primary-600→800 主题渐变 */
  background-color: var(--primary-color) !important;
  background-image: none !important;
  color: #fff;
  outline: none;

  svg {
    width: 1em;
    height: 1em;
  }

  /* 「点赞吧~」提示：元素仅 compact 渲染，样式无条件声明（不含媒体查询，
     不受展平提升影响）；hover 从右向左展开落位 */
  & .like-hint {
    display: inline-block;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    transform: translateX(8px);
    transition:
      max-width var(--motion-dur-quick) var(--motion-ease-out-soft),
      opacity var(--motion-dur-quick) var(--motion-ease-out-soft),
      transform var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  &:hover:not(:disabled) {
    background-image: linear-gradient(90deg, var(--primary-600), var(--primary-800)) !important;
  }

  &:hover:not(:disabled) .like-hint {
    max-width: 80px;
    opacity: 1;
    transform: translateX(0);
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--background-100);
  }

  transition: ${hoverTransition};

  @media (min-width: ${BREAKPOINTS.mobile}px) {
    flex: ${({ $compact }) => ($compact ? '1' : '0 0 auto')};
    height: ${({ $compact }) => ($compact ? '32px' : '36px')};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const FloatingButtonGroup = styled.div<{ $compact?: boolean }>`
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
  max-width: 320px;
  margin: var(--space-sm) auto 0;
  padding: 3px;
  border: 1px solid var(--normal-300);
  border-radius: 999px;
  background: var(--background-200);

  @media (min-width: ${BREAKPOINTS.mobile}px) {
    /* fit-content 而非 auto：flex 容器为块级盒，auto 会撑满整列导致分段左偏留白 */
    width: fit-content;
  }

  ${({ $compact }) =>
    $compact
      ? `
    margin-top: 0;
  `
      : ''}
`
