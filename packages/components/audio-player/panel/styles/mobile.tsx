'use client'

/* 移动端册页：装裱图版 + 短词窗 + 目次对页横翻（20261005 自 PlayerPanel.tsx 拆出） */
import styled, { css } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { EASE, HAIRLINE, INK_FAINT, INK_GHOST, INK_MUTED, QUICK, focusRing, STAGE_TIER_COMPACT, STAGE_TIER_SHORT } from './tokens'

/* ===== 移动端册页（20260930 定稿形态保留）：装裱图版 + 短词窗 + 目次对页横翻 ===== */

/* 下滑关闭手柄：拖拽跟手，松手过阈值关闭、否则回弹（reduced-motion 由面板级降级压制过渡） */
export const GrabHandle = styled.div`
  position: absolute;
  top: var(--space-xs);
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  width: 48px;
  height: 24px;
  display: none;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: grab;

  &::before {
    content: '';
    width: 36px;
    height: 4px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--text-color) 22%, transparent);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: flex;
  }
`

/* 横翻对页容器：scroll-snap 手势翻页；页缘翻页钮（PageTicks）是键盘/读屏等价路径 */
export const LeafPages = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-area: pages;
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`

export const LeafPage = styled.section`
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex: 0 0 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 var(--space-base);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`

/* 装裱图版：纸框发丝线 + 纸边；图面也是下滑关闭的拖拽面 */
export const LeafPlate = styled.figure`
  margin: 44px auto 0;
  width: min(236px, 62vw, 30vh);
  padding: 10px;
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  border: 1px solid ${HAIRLINE};
  border-radius: 4px;
  box-shadow: var(--elevation-soft);
  touch-action: none;
  flex-shrink: 0;
`

/* 移动册页图版：方形封面自持（桌面碟化不影响移动端册页定稿形态） */
export const LeafPlateArt = styled.div<{ $src?: string }>`
  width: min(252px, calc((100vh - 96px) * 0.3));
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};

  @media (max-height: ${STAGE_TIER_SHORT}px) {
    width: min(224px, calc((100vh - 96px) * 0.3));
  }

  @media (max-height: ${STAGE_TIER_COMPACT}px) {
    width: min(184px, calc((100vh - 96px) * 0.26));
  }
`

/* 图版题签：mono 朱砂「曲 · N / 总数」；拉丁文语境字距降档 */
export const PlateNo = styled.figcaption`
  margin-top: 20px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  color: var(--primary-color);

  [lang='en'] & {
    letter-spacing: 0.14em;
  }
`

/* 册页题名：i18n 长度防御——单行省略 + title 全名（不自由换行撑瘪词窗） */
export const LeafTitle = styled.h2`
  margin: var(--space-xs) 0 0;
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LeafArtist = styled.p`
  margin: var(--space-4xs) 0 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 短词窗：mask 上下渐隐，当前句加重、相邻淡化；点按行跳播 */
export const WordWindow = styled.div`
  position: relative;
  margin-top: auto;
  flex: 0 1 148px;
  min-height: 96px;
  overflow: hidden;
  mask-image: linear-gradient(180deg, transparent, black 22%, black 78%, transparent);
`

export const WordLine = styled.button<{ $active?: boolean; $near?: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  padding: var(--space-xs) 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: ${INK_GHOST};
  transition: color ${QUICK} ${EASE};

  ${(p) => (p.$near ? css`color: ${INK_FAINT};` : null)}

  ${(p) =>
    p.$active
      ? css`
          color: var(--text-color);
          font-size: var(--font-size-base);
          font-weight: 600;
        `
      : null}

  ${focusRing}
`

/* 无词空态：印章式「全体欣赏音乐」；拉丁文语境字距降档 */
export const WordEmpty = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
    border-radius: var(--border-radius-xs);
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    letter-spacing: 0.28em;
    color: color-mix(in oklab, var(--primary-color) 78%, transparent);
  }

  [lang='en'] & > span {
    letter-spacing: 0.12em;
  }
`

/* 页缘翻页钮：swipe 的键盘/读屏等价路径；选中态走行内自定义属性（免疫机制，
   见 music-player.md——选择器驱动激活态两连败），选中条宽度切换走 scaleX */
export const PageTicks = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-area: ticks;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: 2px 0 6px;
  }
`

export const PageTick = styled.button`
  padding: 10px 8px;
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;

  /* 选中态经行内自定义属性驱动（自定义属性继承进 ::before） */
  &::before {
    content: '';
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: var(--tick-line, ${HAIRLINE});
    transform: scaleX(var(--tick-fill, 0.44));
    opacity: var(--tick-dim, 0.6);
    transition: transform ${QUICK} ${EASE}, opacity ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};
  }

  ${focusRing}
`

/* 词窗墨晕：短词窗用更矮的一团 */
export const WordBloom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 56px;
  z-index: 0;
  pointer-events: none;
  border-radius: 16px;
  background:
    radial-gradient(60% 100% at 24% 50%, color-mix(in oklab, var(--primary-color) 9%, transparent), transparent 72%),
    radial-gradient(80% 130% at 55% 50%, color-mix(in oklab, var(--text-color) 6%, transparent), transparent 75%);
  filter: blur(10px);
  opacity: 0;
  transition: transform 0.7s ${EASE}, opacity 0.7s ${EASE};
`

