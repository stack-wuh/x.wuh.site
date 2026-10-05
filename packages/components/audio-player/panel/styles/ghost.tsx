'use client'

/* 墨痕歌词：竖排五列两翼（20261005 自 PlayerPanel.tsx 拆出） */
import styled from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { EASE, GHOST_FONT, GHOST_LIFT } from './tokens'

/* ===== 墨痕歌词：竖排五列两翼 · 三阶墨阶（纯装饰） =====
   GhostLayer 的 overflow:hidden 属 grouping 属性，会使 transform-style: preserve-3d
   静默失效——故不走祖先透视透传，每列 transform 自带 perspective() 投影函数 */
export const GhostLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const GhostLine = styled.span`
  position: absolute;
  left: var(--ghost-x);
  top: var(--ghost-top);
  writing-mode: vertical-rl;
  max-height: var(--ghost-max-h);
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: ${GHOST_FONT};
  letter-spacing: 0.22em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  mask-image: linear-gradient(180deg, black 72%, transparent 98%);
  color: color-mix(in oklab, var(--text-color) calc(var(--ghost-ink) * 1%), transparent);
  filter: blur(var(--ghost-blur));
  transform: perspective(1000px) translateZ(var(--ghost-z));
  /* 换句重挂载浮入：起点 = 站深 −150px + 墨透明 + blur 加深（静止姿态 = 动画起点，铁律①） */
  animation: ghostIn calc(var(--motion-dur-quick) * 10.6) ${EASE} both;

  @keyframes ghostIn {
    from {
      opacity: 0;
      transform: perspective(1000px) translateZ(calc(var(--ghost-z) - ${GHOST_LIFT}));
      filter: blur(calc(var(--ghost-blur) + 1.5px));
    }
    to {
      opacity: 1;
      transform: perspective(1000px) translateZ(var(--ghost-z));
      filter: blur(var(--ghost-blur));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

