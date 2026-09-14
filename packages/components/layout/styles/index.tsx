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
    bottom: -4px;
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
    outline-offset: 3px;
    border-radius: 2px;
  }
`

export const StyledFooter = styled.div`
  padding: var(--space-lg) var(--space-xl);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-base);
  line-height: 1.6;
  border-top: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);
  text-align: center;

  .footer-inner {
    max-width: 640px;
    margin: 0 auto;
  }

  .footer-logo {
    display: inline-flex;
    color: var(--text-color);
  }

  .footer-slogan {
    margin: 0 0 var(--space-base);
    font-family: var(--font-serif);
    font-size: var(--font-size-md);
    font-weight: 600;
    letter-spacing: 0.25em;
    text-indent: 0.25em; /* 抵消末字字距，保持视觉居中 */
    color: var(--text-primary);
  }

  .footer-nav,
  .footer-beian {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: var(--space-lg);
    row-gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .footer-nav a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: var(--font-size-base);
    ${linkUnderline}
  }

  .footer-beian a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: var(--font-size-sm);
    opacity: 0.85;
    ${linkUnderline}
  }

  .footer-note {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-md);
  }

  .footer-license {
    color: inherit;
    text-decoration: none;
    ${linkUnderline}
  }

  .footer-tech {
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }

  /* —— 末行站点数据（三项图标）—— */

  .footer-data-line {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    column-gap: var(--space-md);
    row-gap: var(--space-xs);
  }

  .footer-data-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-sm);
    color: color-mix(in oklab, var(--text-muted) 80%, transparent);
    border-radius: 4px;
    cursor: default;
    transition: color var(--transition-fast, 180ms) ease-out;
  }

  .footer-data-item:hover {
    color: var(--text-muted);
  }

  .footer-data-item:focus-visible {
    outline: 1.5px solid var(--primary-color);
    outline-offset: 3px;
  }

  .footer-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* tooltip 向上弹出：Footer 位于页面底部，向下会被视口裁切 */
  .footer-tip {
    position: absolute;
    bottom: calc(100% + 9px);
    left: 50%;
    transform: translate(-50%, 4px);
    white-space: nowrap;
    padding: 5px 10px;
    border-radius: 6px;
    background: var(--text-color);
    color: var(--background-color);
    font-size: var(--font-size-xs);
    line-height: 1.4;
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
    .footer-tech {
      display: none;
    }

    .footer-nav,
    .footer-beian {
      column-gap: var(--space-md);
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
