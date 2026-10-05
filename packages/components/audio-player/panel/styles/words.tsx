'use client'

/* 词卷展开态：题头小装裱 + 竖排朱丝栏（20261005 自 PlayerPanel.tsx 拆出） */
import styled, { css } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { HAIRLINE, INK_GHOST, INK_MUTED, RULE_LINE } from './tokens'

/* ===== 词卷展开态（桌面）：题头小装裱 + 竖排朱丝栏词卷 ===== */
export const WordsView = styled.div`
  grid-area: stage;
  position: relative;
  z-index: 3;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl) var(--space-2xl) var(--space-sm);
  background: color-mix(in oklab, var(--background-100) 88%, transparent);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const WordsHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  width: min(680px, 100%);
`

export const WordsHeadPlate = styled.div`
  flex-shrink: 0;
  padding: var(--space-4xs) var(--space-4xs) var(--space-xs);
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  box-shadow: var(--elevation-soft);
`

export const WordsHeadArt = styled.div<{ $src?: string }>`
  width: 88px;
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
`

export const WordsTitle = styled.p`
  margin: 0;
  min-width: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const WordsArtist = styled.p`
  margin: var(--space-4xs) 0 0;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
`

/* 竖排词卷：句读自右向左成列，界格转朱丝栏（列间发丝竖线）；
   当前句大字 + 3px 朱砂侧标；随播逐列左移、两端渐隐。
   en 语境竖排可读性差 → 回退横排界格笺 */
export const WordsVerse = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: var(--space-base);
  width: min(880px, 100%);
  overflow-x: auto;
  overflow-y: hidden;
  writing-mode: vertical-rl;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 96%, transparent);

  [lang='en'] & {
    writing-mode: horizontal-tb;
    overflow-x: hidden;
    overflow-y: auto;
    mask-image: linear-gradient(180deg, transparent, black 7%, black 93%, transparent);
  }
`

export const WordsLine = styled.p<{ $act?: boolean }>`
  margin: 0 0 0 var(--space-lg);
  padding: 0 var(--space-xs) 0 calc(var(--space-xs) + 1px);
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  letter-spacing: 0.24em;
  line-height: 1.7;
  color: ${INK_GHOST};
  border-right: 1px solid ${RULE_LINE};
  cursor: pointer;

  [lang='en'] & {
    margin: 0;
    padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
    letter-spacing: 0.04em;
    border-right: none;
    border-bottom: 1px solid ${RULE_LINE};
    text-align: center;
  }

  ${(p) =>
    p.$act
      ? css`
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color);
          margin-left: var(--space-sm);
          border-right: 3px solid var(--primary-color);

          [lang='en'] & {
            border-right: none;
            border-bottom: none;
            color: var(--primary-color);
          }
        `
      : null}
`

