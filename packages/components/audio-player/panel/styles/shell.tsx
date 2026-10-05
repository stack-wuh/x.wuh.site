'use client'

/* 面板壳与右上工具组：晕染纸底五层配方 + 网格舞台 + 关闭钮（20261005 自 PlayerPanel.tsx 拆出） */
import styled, { css } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { DUR_PANEL, EASE, GRAIN, HAIRLINE, INK_MUTED, QUICK, focusRing, reducedMotion } from './tokens'

/* ===== 封面晕染纸底：照片 → 大模糊成色场 → 纸色罩压平 → 纸纹叠印 ===== */

/* 封面色场：blur 64px 让照片失去可识别轮廓，只留色温；亮色提亮、暗色压暗 */
export const WashSrc = styled.div<{ $src?: string }>`
  position: absolute;
  inset: -12%;
  z-index: 0;
  pointer-events: none;
  background: ${(p) => (p.$src ? `url(${p.$src}) center 40% / cover no-repeat` : 'none')};
  filter: blur(64px) saturate(0.92) brightness(1.18);
  opacity: ${(p) => (p.$src ? 1 : 0)};

  [data-color-scheme='dark'] & {
    filter: blur(64px) saturate(0.92) brightness(0.62);
  }
`

/* 纸色罩：全幅压回纸的明度区间，晕染只提供温度不提供内容 */
export const PaperVeil = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: color-mix(in oklab, var(--background-100) 72%, transparent);
`

export const Backdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 2600;
  background: color-mix(in oklab, black 55%, transparent);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity ${DUR_PANEL} ${EASE};
`

export const Panel = styled.div<{ $visible: boolean; $drag?: number | null }>`
  position: fixed;
  inset: 48px;
  z-index: 2610;
  max-width: 1160px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
  grid-template-areas: 'stage' 'dock';
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--radius-card);
  box-shadow: var(--elevation-card);
  color: var(--text-color);
  font-family: var(--font-sans);
  /* clip（而非 hidden）：面板壳必须不是滚动容器——它是可滚容器时，子元素滚动定位 API
     会沿祖先链把它连带滚走（生产实测内容整体上移、眉标被裁、底边露出未罩纸底的晕染色带） */
  overflow: clip;
  /* 翻页透视源：队列屏绕右缘轴线的 3D 来自这里。透视只作用于直接子级，
     热区隔层必须 preserve-3d 透传（漏配 = 3D 静默退化为平面缩放） */
  perspective: 1400px;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$drag != null ? `${Math.min(p.$drag, 320)}px` : p.$visible ? '0' : '16px')});
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: ${(p) =>
    p.$drag != null
      ? 'none'
      : `opacity ${DUR_PANEL} ${EASE}, transform ${DUR_PANEL} ${EASE}, visibility 0s linear ${p.$visible ? '0s' : DUR_PANEL}`};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};

  /* 纸纹叠印：multiply 让晕染色场成为纸的一部分 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
    border-radius: inherit;
    background-image: ${GRAIN};
    mix-blend-mode: multiply;
    opacity: 0.06;
  }

  [data-color-scheme='dark'] &::after {
    mix-blend-mode: soft-light;
    opacity: 0.09;
  }

  ${reducedMotion}

  /* 移动端：全屏沉浸册页 —— 横翻对页（词页/目次）/ 页缘翻页钮 / dock 吸底（20260930 定稿形态保留） */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    inset: 0;
    max-width: none;
    padding: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto auto;
    grid-template-areas: 'pages' 'ticks' 'dock';
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: clip;
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: var(--space-base);
  right: var(--space-base);
  /* z9：高于队列翻页热区（z8）——右缘 hover 不得劫持关闭钮 */
  z-index: 9;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: 1px solid transparent;
  border-radius: 50%;
  color: ${INK_MUTED};
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
    border-color: ${HAIRLINE};
  }

  ${focusRing}
`

export const toolHover = css`
  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }
`

/* ===== 右上工具组（桌面）：词卷印章钮 + 列表抽屉钮 ===== */
export const TopTools = styled.div`
  position: absolute;
  top: var(--space-base);
  right: calc(var(--space-base) + 48px);
  /* z9：高于队列翻页热区（z8）——hover 热区不得劫持詞/列表钮 */
  z-index: 9;
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 词卷开关：印章字钮「詞」——印章字形跨语言不变（i18n 卡先例），语义走 aria。
   选中显隐走行内样式（JSX style 挂载），不经 styled 动态类——免疫规则删除竞态 */
export const WordsToggle = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--border-radius-xs);
  color: ${INK_MUTED};
  cursor: pointer;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  line-height: 1;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  ${toolHover}
  ${focusRing}
`

export const DrawerButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  color: ${INK_MUTED};
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  ${toolHover}
  ${focusRing}
`
