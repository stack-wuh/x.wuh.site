'use client'

import styled from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const hoverFade = 'color-mix(in oklab, var(--primary-color) 45%, transparent)'

const linkUnderline = `
  position: relative;
  transition: color var(--transition-fast, 180ms) ease-out;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    /* 偏移取自间距令牌（响应式间距对象），不写死 px */
    bottom: calc(var(--space-xs) / -2);
    height: 1px;
    background: linear-gradient(to right, transparent, ${hoverFade}, transparent);
    opacity: 0;
    transition: opacity var(--transition-fast, 180ms) ease-out;
  }

  &:hover {
    color: var(--text-color);

    &::after {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 1.5px solid var(--primary-color);
    outline-offset: calc(var(--space-xs) / 2);
    border-radius: var(--border-radius-xs);
  }
`

export const StyledFooter = styled.div`
  padding: var(--space-md) var(--space-xl);
  background-color: var(--background-color);
  color: var(--text-color);
  /* 页脚挂在页面容器之外，页面级 font-family 覆盖不到它：字体族必须自持 */
  font-family: var(--font-sans);
  /* 整层为辅助信息，字号落站内辅助层（12px，四主题同值） */
  font-size: var(--font-size-xs);
  /* 行高自成一套：块级行 1.8、展示行与 tooltip 1.5。
     全站令牌落不进这个区间——--line-height-body 素雅主题到 2.0（过松），
     --line-height-heading 只有 1.35（过紧），故页脚不引用它们。 */
  --footer-lh: 1.8;
  --footer-lh-display: 1.5;
  line-height: var(--footer-lh);
  border-top: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);
  text-align: center;

  .footer-inner {
    max-width: ${BREAKPOINTS.mobile}px; /* 与站点窄屏断点同源，不写裸数值 */
    margin: 0 auto;
  }

  /* Divider ornament 默认 --space-lg 上下 margin，页脚收到 --space-sm/base */
  .footer-ornament {
    margin: var(--space-sm) 0 var(--space-base);
  }

  .footer-logo {
    display: inline-flex;
    color: var(--text-color);
  }

  .footer-slogan {
    margin: 0 0 var(--space-xs);
    font-family: var(--font-serif);
    font-size: var(--font-size-base);
    line-height: var(--footer-lh-display);
    font-weight: 600;
    letter-spacing: 0.25em;
    text-indent: 0.25em; /* 抵消末字字距，保持视觉居中 */
    color: var(--text-primary);
  }

  /* 区块间距必须用 margin，不能只靠行高：链接下划线是挂在行盒底部再往下 4px 的
     绝对定位伪元素（见 linkUnderline），没有 margin 时它会落进下一行的盒子里 */
  .footer-nav,
  .footer-beian {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: var(--space-sm);
    row-gap: var(--space-xs);
    margin-bottom: var(--space-sm);
  }

  .footer-nav a {
    color: var(--text-muted);
    text-decoration: none;
    ${linkUnderline}
  }

  .footer-beian a {
    color: var(--text-muted);
    text-decoration: none;
    opacity: 0.85;
    ${linkUnderline}
  }

  /* 版权注脚：三段 nowrap（© / 协议 / 技术栈），分隔符附着于后段，窄屏只在段边界换行且不留孤点。
     段间不设 flex 间距：CJK 全角「·」自带 1em 字宽（墨迹居中），它本身就是段间留白。 */
  .footer-note {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    row-gap: calc(var(--space-xs) / 2);
    color: var(--text-muted);
    margin-bottom: var(--space-sm);
  }

  .footer-note > * + *::before {
    content: '·';
    opacity: 0.6;
  }

  /* 不加 display，避免特异性压过 <520px 隐藏技术栈段的规则 */
  .footer-note > span,
  .footer-note > a {
    white-space: nowrap;
  }

  .footer-license {
    color: inherit;
    text-decoration: none;
    ${linkUnderline}
  }

  .footer-note-tech {
    opacity: 0.8;
  }

  /* —— 末行站点数据（三项图标）—— */

  .footer-data-line {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    column-gap: var(--space-sm);
    row-gap: var(--space-xs);
  }

  .footer-data-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: color-mix(in oklab, var(--text-muted) 80%, transparent);
    border-radius: var(--border-radius-sm);
    cursor: default;
    transition: color var(--transition-fast, 180ms) ease-out;
  }

  .footer-data-item:hover {
    color: var(--text-muted);
  }

  .footer-data-item:focus-visible {
    outline: 1.5px solid var(--primary-color);
    outline-offset: calc(var(--space-xs) / 2);
  }

  .footer-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* tooltip 向上弹出：Footer 位于页面底部，向下会被视口裁切；
     间距与圆角对齐 LinkGroup 的 tooltip（8px 偏移、4px 8px 内边距、8px 圆角）但走令牌 */
  .footer-tip {
    position: absolute;
    bottom: calc(100% + var(--space-xs));
    left: 50%;
    transform: translate(-50%, calc(var(--space-xs) / 2));
    white-space: nowrap;
    padding: calc(var(--space-xs) / 2) var(--space-xs);
    border-radius: var(--border-radius-base);
    background: var(--text-color);
    color: var(--background-color);
    font-size: var(--font-size-xs);
    line-height: var(--footer-lh-display);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 20;
    transition: opacity var(--transition-fast, 180ms) ease-out, transform var(--transition-fast, 180ms) ease-out,
      visibility var(--transition-fast, 180ms);
  }

  .footer-data-item:hover .footer-tip,
  .footer-data-item:focus-visible .footer-tip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }

  /* 触屏无 hover：图标后常显短文字 */
  .footer-mlabel {
    display: none;
  }

  @media (hover: none), (pointer: coarse) {
    .footer-mlabel {
      display: inline;
    }

    .footer-tip {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS.small}px) {
    /* 技术栈段整体隐藏（其分隔符由 ::before 承担，随之消失，不留孤点） */
    .footer-note-tech {
      display: none;
    }

    .footer-nav,
    .footer-beian {
      column-gap: var(--space-xs);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .footer-nav a,
    .footer-beian a,
    .footer-license,
    .footer-data-item,
    .footer-tip,
    .footer-tip::after {
      transition: none;
    }
  }
`
