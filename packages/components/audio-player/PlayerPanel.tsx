'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import {
  IconListMusic,
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
  IconVolume,
  IconX
} from '@wuh.site/components/icons'
import type { PlayerMode } from './specs'

const HAIRLINE = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
const INK_MUTED = 'color-mix(in oklab, var(--text-color) 72%, transparent)'
const INK_FAINT = 'color-mix(in oklab, var(--text-color) 56%, transparent)'
const INK_GHOST = 'color-mix(in oklab, var(--text-color) 38%, transparent)'
const EASE = 'var(--motion-ease-out-soft)'
const QUICK = 'var(--motion-dur-quick)'
// 面板开合 240ms：由 --motion-dur-quick(150ms) 派生，落在交互规范 150–300ms 区间
const DUR_PANEL = 'calc(var(--motion-dur-quick) * 1.6)'
// 纸纹：feTurbulence 噪点叠印，把晕染色场「印」进纸里而非悬浮
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      transition-duration: 0.01ms !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  }
`

/* ===== 封面晕染纸底：照片 → 大模糊成色场 → 纸色罩压平 → 纸纹叠印 ===== */

/* 封面色场：blur 64px 让照片失去可识别轮廓，只留色温；亮色提亮、暗色压暗 */
const WashSrc = styled.div<{ $src?: string }>`
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
const PaperVeil = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: color-mix(in oklab, var(--background-100) 72%, transparent);
`

/* 文字列局部纸罩：正文对比度最稳的位置再加一道保险 */
const sectionTint = css`
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--background-100) 40%, transparent),
    color-mix(in oklab, var(--background-100) 26%, transparent)
  );
`

const Backdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 2600;
  background: color-mix(in oklab, black 55%, transparent);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity ${DUR_PANEL} ${EASE};
`

const Panel = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 48px;
  z-index: 2610;
  max-width: 1160px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.1fr) minmax(0, 0.86fr);
  grid-template-rows: minmax(0, 1fr) auto;
  grid-template-areas: 'now lyrics queue' 'dock lyrics queue';
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--radius-card);
  box-shadow: var(--elevation-card);
  color: var(--text-color);
  font-family: var(--font-sans);
  overflow: hidden;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '16px')});
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity ${DUR_PANEL} ${EASE}, transform ${DUR_PANEL} ${EASE}, visibility 0s linear ${(p) => (p.$visible ? '0s' : DUR_PANEL)};
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

  /* 移动端：全屏沉浸页 —— header / 分段切换 / 歌词或列表 / dock 吸底 */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    inset: 0;
    max-width: none;
    padding: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    grid-template-areas: 'header' 'tabs' 'body' 'dock';
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }

  @media (min-width: calc(${BREAKPOINTS.mobile}px + 1px)) and (max-width: ${BREAKPOINTS.tablet}px) {
    inset: 24px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    grid-template-rows: minmax(0, 1fr) auto;
    grid-template-areas: 'now lyrics' 'dock lyrics';
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: var(--space-base);
  right: var(--space-base);
  z-index: 5;
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

/* ===== 左栏：装裱封面 + 题名（header）/ 进度 + 控制（dock 锚底） ===== */
const NowHeader = styled.div`
  grid-area: now;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  /* 桌面 gutter：封面装裱内距，与歌词列 padding-left 同韵 */
  padding: var(--space-xl) 0 0 var(--space-xl);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-area: header;
    flex-direction: row;
    align-items: center;
    gap: var(--space-sm);
    padding: calc(var(--space-sm) + env(safe-area-inset-top, 0px)) var(--space-base) var(--space-sm);
    border-bottom: 1px solid ${HAIRLINE};
  }
`

const NowDock = styled.div`
  grid-area: dock;
  position: relative;
  z-index: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* 甲板 gutter：右缘离开列罩边界，底缘离开面板圆角 */
  padding: 0 var(--space-lg) var(--space-xl) var(--space-xl);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-area: dock;
    padding: var(--space-sm) var(--space-base) calc(var(--space-base) + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid ${HAIRLINE};
  }
`

/* 封面按面板可用高度与栏宽双重收缩，避免左栏总高撑出面板底边或横向压到歌词列 */
const CoverHero = styled.div<{ $src?: string }>`
  width: min(100%, 300px, 40vh);
  aspect-ratio: 1;
  align-self: flex-start;
  border-radius: var(--border-radius-lg);
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, var(--elevation-soft);

  /* 矮视口（常见 800 高笔记本）：封面再收缩一档，抵偿 gutter 占用的纵向空间 */
  @media (max-height: 840px) {
    width: min(100%, 220px);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 54px;
    height: 54px;
    min-width: 54px;
    border-radius: var(--border-radius-base);
    align-self: center;
  }
`

const TrackHeading = styled.h2`
  margin-top: var(--space-base);
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  overflow-wrap: anywhere;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: 0;
    font-size: var(--font-size-base);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const TrackArtist = styled.p`
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ProgressWrapper = styled.div`
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: 0;
  }
`

/* 凹槽滑杆（签名元素）：4px 发丝轨道 + 主色已播段 + 纸色圆点滑块，进度与音量共用同一几何 */
const GrooveSlider = styled.input<{ $fill?: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 999px;
    background:
      linear-gradient(var(--primary-color), var(--primary-color)) 0 / ${(p) => p.$fill ?? 0}% 100% no-repeat,
      ${HAIRLINE};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    margin-top: -4px;
    border-radius: 50%;
    background: var(--background-100);
    border: 1px solid ${HAIRLINE};
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary-color) 28%, transparent);
    transition: transform ${QUICK} ${EASE}, box-shadow ${QUICK} ${EASE};
  }

  &:hover::-webkit-slider-thumb,
  &:active::-webkit-slider-thumb {
    transform: scale(1.18);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary-color) 28%, transparent);
  }

  &::-moz-range-track {
    height: 4px;
    border-radius: 999px;
    background: ${HAIRLINE};
  }

  &::-moz-range-progress {
    height: 4px;
    border-radius: 999px;
    background: var(--primary-color);
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--background-100);
    border: 1px solid ${HAIRLINE};
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary-color) 28%, transparent);
    transition: transform ${QUICK} ${EASE}, box-shadow ${QUICK} ${EASE};
  }

  &:hover::-moz-range-thumb,
  &:active::-moz-range-thumb {
    transform: scale(1.18);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary-color) 28%, transparent);
  }

  @media (pointer: coarse) {
    height: 44px;
  }

  ${focusRing}
`

const VolumeSlider = styled(GrooveSlider)`
  width: 120px;
`

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

const ControlRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: var(--space-sm);
    justify-content: center;
    gap: var(--space-lg);
  }
`

/* 幽灵传输钮：去常驻描边，纸面安静，hover 才显性（与 CloseButton 同语言） */
const SkipButton = styled.button`
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

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }

  ${focusRing}
`

/* 实心盘：面板唯一饱和元素；::after 内缩环作碟面标签环，唱片语言点到即止 */
const PlayButton = styled(SkipButton)`
  position: relative;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: var(--background-100);
  box-shadow: var(--elevation-soft);

  &::after {
    content: '';
    position: absolute;
    inset: 9px;
    border-radius: 50%;
    border: 1px solid color-mix(in oklab, var(--background-100) 35%, transparent);
    pointer-events: none;
  }

  &:hover {
    background: var(--primary-600);
    color: var(--background-100);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 52px;
    height: 52px;
  }
`

/* 甲板末行：模式带居左、音量居右；移动端音量隐去、模式居中 */
const DeckRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-base);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: var(--space-sm);
    justify-content: center;
  }
`

const ModeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

/* 下划线模式带：复用 MobileTab/年谱刻度带的选中语言，替代描边 pill */
const ModeButton = styled.button<{ $active?: boolean }>`
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_MUTED)};
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  transition: color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
  }

  ${focusRing}
`

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: ${INK_MUTED};

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ===== 右侧：歌词 / 播放列表 ===== */

/* 眉标：短朱砂 tick + 字距小标，不再通栏划线 */
const SectionHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) 0 calc(var(--space-xs) + 6px);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 500;
  letter-spacing: 0.22em;
  color: ${INK_MUTED};

  &::before {
    content: '';
    width: 10px;
    height: 2px;
    background: var(--primary-color);
  }
`

const LyricsSection = styled.section`
  grid-area: lyrics;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-2xl) 0 var(--space-lg);
  ${sectionTint}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const QueueSection = styled.section`
  grid-area: queue;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-lg) 0 var(--space-lg);
  border-left: 1px solid ${HAIRLINE};
  ${sectionTint}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const LyricsScroll = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--space-sm) var(--space-lg) 0;
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${HAIRLINE};
    border-radius: 999px;
  }

  @media (pointer: coarse) {
    scrollbar-gutter: auto;
  }
`

/* 墨随声走：一团软墨晕垫在当前句背后，随演唱进度在纸上洇移 */
const LyricBloom = styled.div`
  position: absolute;
  left: 0;
  right: var(--space-sm);
  top: 0;
  height: 74px;
  z-index: 0;
  pointer-events: none;
  border-radius: 16px;
  background:
    radial-gradient(60% 100% at 24% 50%, color-mix(in oklab, var(--primary-color) 9%, transparent), transparent 72%),
    radial-gradient(80% 130% at 55% 50%, color-mix(in oklab, var(--text-color) 6%, transparent), transparent 75%);
  filter: blur(10px);
  opacity: 0;
  transition: transform 0.7s ${EASE}, opacity 0.7s ${EASE};

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    height: 62px;
  }
`

/* 书写显现：当前句落笔（audio-player 本地 keyframes，站点专属组件先例） */
const writeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: none; }
`

const LyricLine = styled.p<{ $active?: boolean; $near?: boolean }>`
  position: relative;
  padding: var(--space-xs) 0 var(--space-xs) 16px;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  color: ${INK_GHOST};
  transition: color ${QUICK} ${EASE}, font-size ${QUICK} ${EASE};

  ${(p) => (p.$near ? css`color: ${INK_FAINT};` : null)}

  ${(p) =>
    p.$active
      ? css`
          color: var(--text-color);
          font-size: var(--font-size-lg);
          font-weight: 600;
          animation: ${writeIn} calc(var(--motion-dur-quick) * 1.66) ${EASE} both;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 1.4em;
            border-radius: 2px;
            background: var(--primary-color);
          }
        `
      : null}
`

const QueueList = styled.ul`
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0 0 var(--space-lg);
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${HAIRLINE};
    border-radius: 999px;
  }
`

const QueueItem = styled.li<{ $active?: boolean }>`
  position: relative;
  background: ${(p) => (p.$active ? 'color-mix(in oklab, var(--primary-color) 7%, transparent)' : 'transparent')};
  border-radius: var(--border-radius-base);

  /* 当前项：朱砂左标，替代原粉底 pill */
  ${(p) =>
    p.$active
      ? css`
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 2.5px;
            height: 18px;
            border-radius: 2px;
            background: var(--primary-color);
          }
        `
      : null}

  &:hover {
    background: color-mix(in oklab, var(--text-color) 5%, transparent);
  }
`

const QueueButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-xs) var(--space-xs) var(--space-sm);
  background: none;
  border: none;
  border-radius: inherit;
  color: var(--text-color);
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: left;

  ${focusRing}
`

const QueueNo = styled.span<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 22px;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_FAINT)};
`

const QueueName = styled.span<{$active?: boolean}>`
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  color: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--text-color)')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const QueueMeta = styled.span`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

/* ===== 移动端分段：歌词 / 列表 ===== */
const MobileTabs = styled.div`
  position: relative;
  z-index: 1;
  grid-area: tabs;
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: flex;
    gap: var(--space-xs);
    padding: 0 var(--space-base);
    border-bottom: 1px solid ${HAIRLINE};
  }
`

const MobileTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_MUTED)};
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  ${focusRing}
`

const MobileSection = styled.section<{ $active?: boolean }>`
  position: relative;
  z-index: 1;
  grid-area: body;
  min-height: 0;
  display: none;
  flex-direction: column;
  padding: var(--space-xs) var(--space-base) 0;
  ${sectionTint}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    ${(p) => (p.$active ? css`display: flex;` : css`display: none;`)}
  }
`

const MODE_LABELS: Record<PlayerMode, string> = {
  order: '顺序',
  'repeat-one': '单曲',
  shuffle: '随机'
}

export const AudioPlayerPanel = () => {
  const {
    currentTrack,
    queue,
    state,
    actions: { togglePanel, playNext, playPrevious, togglePlay, seek, setVolume, setMode, playTrack }
  } = useAudioPlayer()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const mobileLyricsRef = useRef<HTMLDivElement | null>(null)
  const lyricBloomRef = useRef<HTMLDivElement | null>(null)
  const mobileBloomRef = useRef<HTMLDivElement | null>(null)
  const desktopQueueRef = useRef<HTMLUListElement | null>(null)
  const mobileQueueRef = useRef<HTMLUListElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const [mobileTab, setMobileTab] = useState<'lyrics' | 'queue'>('lyrics')
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)

  const lyrics = useMemo(() => parseLyrics(currentTrack?.lyrics), [currentTrack?.lyrics])
  const activeLyric = useMemo(() => findActiveLyricIndex(lyrics, state.progress), [lyrics, state.progress])
  const playing = state.status === 'playing'

  // 弹层交互：打开时焦点移入关闭钮，Escape 关闭，关闭后焦点移回触发元素
  useEffect(() => {
    if (!state.isPanelOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        togglePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      restoreFocusRef.current?.focus?.()
      restoreFocusRef.current = null
    }
  }, [state.isPanelOpen, togglePanel])

  // 弹层滚动锁：面板打开期间锁 body 滚动（复用 Dialog 的 lockScroll 配方，position:fixed 兼顾 iOS），关闭还原滚动位置
  useEffect(() => {
    if (!state.isPanelOpen || typeof document === 'undefined') return
    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      window.scrollTo(0, scrollY)
    }
  }, [state.isPanelOpen])

  // 播放列表定位到当前曲：面板打开或切歌时滚动到高亮项
  useEffect(() => {
    if (!state.isPanelOpen) return
    for (const container of [desktopQueueRef.current, mobileQueueRef.current]) {
      container?.querySelector<HTMLLIElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
    }
  }, [state.isPanelOpen, state.currentIndex, mobileTab])

  // 歌词跟随滚动 + 墨随声走（桌面与移动两份歌词容器都要跟随）；reduced-motion 下退化为瞬时定位
  useEffect(() => {
    if (!state.isPanelOpen) return
    const pairs = [
      { container: scrollRef.current, bloom: lyricBloomRef.current },
      { container: mobileLyricsRef.current, bloom: mobileBloomRef.current }
    ]
    if (activeLyric < 0) {
      for (const { bloom } of pairs) bloom?.classList.remove('on')
      return
    }
    const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'
    for (const { container, bloom } of pairs) {
      const el = container?.querySelector<HTMLDivElement>(`[data-lyric-index="${activeLyric}"]`)
      if (!el) continue
      el.scrollIntoView({ behavior, block: 'center' })
      if (bloom) {
        bloom.style.transform = `translateY(${el.offsetTop - 12}px)`
        bloom.classList.add('on')
      }
    }
  }, [activeLyric, state.isPanelOpen])

  return (
    <>
      <Backdrop $visible={state.isPanelOpen} onClick={togglePanel} aria-hidden='true' />
      <Panel
        $visible={state.isPanelOpen}
        role='dialog'
        aria-modal='true'
        aria-label='播放器面板'
        aria-hidden={!state.isPanelOpen}
      >
        <WashSrc $src={currentTrack?.coverUrl} aria-hidden='true' />
        <PaperVeil aria-hidden='true' />
        <CloseButton ref={closeRef} type='button' aria-label='关闭播放面板' onClick={togglePanel} tabIndex={state.isPanelOpen ? 0 : -1}>
          <IconX size={20} />
        </CloseButton>

        <NowHeader>
          <CoverHero $src={currentTrack?.coverUrl} aria-hidden='true' />
          <TrackHeading>{currentTrack?.name ?? '等待播放'}</TrackHeading>
          <TrackArtist>{currentTrack?.artist ?? ' '}</TrackArtist>
        </NowHeader>

        <NowDock>
          <ProgressWrapper>
            <GrooveSlider
              type='range'
              min={0}
              max={totalDuration}
              step={0.1}
              value={Math.min(state.progress, totalDuration)}
              $fill={(Math.min(state.progress, totalDuration) / totalDuration) * 100}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label='播放进度'
            />
            <TimeRow>
              <span>{formatDuration(state.progress)}</span>
              <span>{formatDuration(totalDuration)}</span>
            </TimeRow>
          </ProgressWrapper>

          <ControlRow>
            <SkipButton type='button' aria-label='上一首' onClick={playPrevious}>
              <IconSkipBack size={20} />
            </SkipButton>
            <PlayButton type='button' aria-label={playing ? '暂停' : '播放'} onClick={togglePlay}>
              {playing ? <IconPause size={24} /> : <IconPlay size={24} />}
            </PlayButton>
            <SkipButton type='button' aria-label='下一首' onClick={playNext}>
              <IconSkipForward size={20} />
            </SkipButton>
          </ControlRow>

          <DeckRow>
            <ModeGroup role='group' aria-label='播放模式'>
              {(Object.keys(MODE_LABELS) as PlayerMode[]).map((mode) => (
                <ModeButton
                  key={mode}
                  type='button'
                  $active={state.mode === mode}
                  aria-pressed={state.mode === mode}
                  onClick={() => setMode(mode)}
                >
                  {MODE_LABELS[mode]}
                </ModeButton>
              ))}
            </ModeGroup>

            <VolumeRow>
              <IconVolume size={16} aria-hidden='true' />
              <VolumeSlider
                type='range'
                min={0}
                max={1}
                step={0.01}
                value={state.volume}
                $fill={state.volume * 100}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label='音量'
              />
            </VolumeRow>
          </DeckRow>
        </NowDock>

        <LyricsSection aria-label='歌词'>
          <SectionHeading>歌 词</SectionHeading>
          <LyricsScroll ref={scrollRef}>
            <LyricBloom ref={lyricBloomRef} aria-hidden='true' />
            {lyrics.length ? (
              lyrics.map((line, index) => (
                <LyricLine
                  key={`${line.time}-${index}`}
                  data-lyric-index={index}
                  $active={index === activeLyric}
                  $near={Math.abs(index - activeLyric) === 1}
                >
                  {line.text}
                </LyricLine>
              ))
            ) : (
              <LyricLine>暂无歌词</LyricLine>
            )}
          </LyricsScroll>
        </LyricsSection>

        <QueueSection aria-label='播放列表'>
          <SectionHeading>
            <IconListMusic size={13} aria-hidden='true' /> 播放列表
          </SectionHeading>
          <QueueList ref={desktopQueueRef}>
            {queue.map((track, index) => (
              <QueueItem key={track.id} $active={track.id === currentTrack?.id} data-active={track.id === currentTrack?.id}>
                <QueueButton type='button' onClick={() => playTrack(track.id)}>
                  <QueueNo $active={track.id === currentTrack?.id}>{String(index + 1).padStart(2, '0')}</QueueNo>
                  <QueueName $active={track.id === currentTrack?.id}>{track.name}</QueueName>
                  <QueueMeta>
                    <span>{track.artist}</span>
                    <span>{formatDuration(track.duration ?? 0)}</span>
                  </QueueMeta>
                </QueueButton>
              </QueueItem>
            ))}
          </QueueList>
        </QueueSection>

        <MobileTabs role='tablist' aria-label='歌词与播放列表切换'>
          <MobileTab
            type='button'
            role='tab'
            $active={mobileTab === 'lyrics'}
            aria-selected={mobileTab === 'lyrics'}
            onClick={() => setMobileTab('lyrics')}
          >
            歌词
          </MobileTab>
          <MobileTab
            type='button'
            role='tab'
            $active={mobileTab === 'queue'}
            aria-selected={mobileTab === 'queue'}
            onClick={() => setMobileTab('queue')}
          >
            播放列表
          </MobileTab>
        </MobileTabs>

        <MobileSection
          role='tabpanel'
          aria-label='歌词'
          $active={mobileTab === 'lyrics'}
          aria-hidden={mobileTab !== 'lyrics'}
        >
          <LyricsScroll ref={mobileLyricsRef}>
            <LyricBloom ref={mobileBloomRef} aria-hidden='true' />
            {lyrics.length ? (
              lyrics.map((line, index) => (
                <LyricLine
                  key={`${line.time}-${index}`}
                  data-lyric-index={index}
                  $active={index === activeLyric}
                  $near={Math.abs(index - activeLyric) === 1}
                >
                  {line.text}
                </LyricLine>
              ))
            ) : (
              <LyricLine>暂无歌词</LyricLine>
            )}
          </LyricsScroll>
        </MobileSection>

        <MobileSection
          role='tabpanel'
          aria-label='播放列表'
          $active={mobileTab === 'queue'}
          aria-hidden={mobileTab !== 'queue'}
        >
          <QueueList ref={mobileQueueRef}>
            {queue.map((track, index) => (
              <QueueItem key={track.id} $active={track.id === currentTrack?.id} data-active={track.id === currentTrack?.id}>
                <QueueButton type='button' onClick={() => playTrack(track.id)}>
                  <QueueNo $active={track.id === currentTrack?.id}>{String(index + 1).padStart(2, '0')}</QueueNo>
                  <QueueName $active={track.id === currentTrack?.id}>{track.name}</QueueName>
                  <QueueMeta>
                    <span>{track.artist}</span>
                    <span>{formatDuration(track.duration ?? 0)}</span>
                  </QueueMeta>
                </QueueButton>
              </QueueItem>
            ))}
          </QueueList>
        </MobileSection>
      </Panel>
    </>
  )
}
