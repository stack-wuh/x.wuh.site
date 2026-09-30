'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import { useLocale } from '@wuh.site/components/locales'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import Progress from '@wuh.site/components/progress'
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

const Panel = styled.div<{ $visible: boolean; $drag?: number | null }>`
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
  /* clip（而非 hidden）：面板壳必须不是滚动容器——它是可滚容器时，子元素滚动定位 API
     会沿祖先链把它连带滚走（生产实测内容整体上移、眉标被裁、底边露出未罩纸底的晕染色带） */
  overflow: clip;
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

  /* 移动端：全屏沉浸册页 —— 横翻对页（词页/目次）/ 页缘翻页钮 / dock 吸底 */
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
  /* 桌面 gutter：封面装裱内距，与歌词列 padding-left 同韵；移动端由册页词页接替 */
  padding: var(--space-xl) 0 0 var(--space-xl);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
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
`

const TrackHeading = styled.h2`
  margin-top: var(--space-base);
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  overflow-wrap: anywhere;
`

const TrackArtist = styled.p`
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
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


/* 进度行：时间码两端，中段为共享 Progress 交互态（度曲尺已退役，进度语言统一到 @wuh.site/components/progress） */
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const TimeCode = styled.span<{ $now?: boolean }>`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1;
  color: ${(p) => (p.$now ? INK_MUTED : INK_FAINT)};
`

const ControlRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 64px;
  height: 64px;
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

/* 下划线模式带：复用页缘钮/年谱刻度带的选中语言，替代描边 pill。
   激活态经行内自定义属性驱动（JSX style 挂 --mode-*，静态规则消费 var()）——
   选择器驱动的激活态在这张生产行为表上两连败：动态类有规则删除竞态（v1.4.36–38），
   属性选择器又遇 React 属性翻转后失效失灵（v1.4.41 生产实测，手动摘戴属性才恢复）；
   内联样式变更走引擎保证的失效路径，不依赖任何选择器重匹配。aria-pressed 保留语义、不再参与样式 */
const ModeButton = styled.button`
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  background: none;
  border: none;
  border-bottom: 2px solid var(--mode-line, transparent);
  color: var(--mode-ink, ${INK_MUTED});
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

/* 音量条窄位：共享 Progress 交互态在 120px 原位（凹槽几何归音量 → 印光标接任） */
const VolumeBox = styled.div`
  width: 120px;
`

/* ===== 移动端册页（2026-09-30 起）：装裱图版 + 短词窗 + 目次对页横翻 ===== */

/* 下滑关闭手柄：拖拽跟手，松手过阈值关闭、否则回弹（reduced-motion 由面板级降级压制过渡） */
const GrabHandle = styled.div`
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

/* 下滑关闭手柄：见 GrabHandle；图版同作拖拽面 */

/* 横翻对页容器：scroll-snap 手势翻页；页缘翻页钮（PageTicks）是键盘/读屏等价路径 */
const LeafPages = styled.div`
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

const LeafPage = styled.section`
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

/* 装裱图版：纸框发丝线 + 纸边 + 图版内发丝线；图面也是下滑关闭的拖拽面 */
const Plate = styled.figure`
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

const PlateArt = styled.div<{ $src?: string }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${(p) =>
    p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)'};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
`

/* 图版题签：mono 朱砂「曲 · N / 总数」——曲目序号是版面信息不是装饰 */
const PlateNo = styled.figcaption`
  margin-top: 20px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  color: var(--primary-color);
`

const LeafTitle = styled.h2`
  margin-top: 8px;
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  overflow-wrap: anywhere;
`

const LeafArtist = styled.p`
  margin-top: 6px;
  text-align: center;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
`

/* 短词窗：mask 上下渐隐，当前句加重、相邻淡化；点按行跳播（矮视口可收缩） */
const WordWindow = styled.div`
  position: relative;
  margin-top: auto;
  flex: 0 1 148px;
  min-height: 96px;
  overflow: hidden;
  mask-image: linear-gradient(180deg, transparent, black 22%, black 78%, transparent);
`

const WordLine = styled.button<{ $active?: boolean; $near?: boolean }>`
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

/* 无词空态：印章式「全体欣赏音乐」替代死黑——印框朱砂 45%、印面衬线字 */
const WordEmpty = styled.div`
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
`

/* 页缘翻页钮：swipe 的键盘/读屏等价路径；选中态走 aria-current 属性选择器（静态 CSS，
   规避动态类规则删除竞态——见 ModeButton 注释），选中条宽度切换走 scaleX 不碰布局属性 */
const PageTicks = styled.div`
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

const PageTick = styled.button`
  padding: 10px 8px;
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;

  /* 选中态经行内自定义属性驱动（与 ModeButton 同一免疫机制，自定义属性继承进 ::before） */
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

/* 词窗墨晕：短词窗用更矮的一团（册页词页 2026-09-30 起） */
const WordBloom = styled(LyricBloom)`
  height: 56px;
  left: 0;
  right: 0;
`

const QueueList = styled.ul`
  position: relative;
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

const MODE_LABEL_KEYS: Record<PlayerMode, string> = {
  order: 'player.panel.modeOrder',
  'repeat-one': 'player.panel.modeRepeatOne',
  shuffle: 'player.panel.modeShuffle'
}

export const AudioPlayerPanel = () => {
  const { t } = useLocale()
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
  const pagesRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const dragStartYRef = useRef<number | null>(null)
  const dragYRef = useRef(0)
  const [mobilePage, setMobilePage] = useState<'words' | 'queue'>('words')
  const [dragY, setDragY] = useState<number | null>(null)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)
  const progressPct = (Math.min(state.progress, totalDuration) / totalDuration) * 100

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

  // 播放列表定位到当前曲：面板打开或切歌时滚动到高亮项。
  // 定位一律手动只滚目标容器，禁用原生滚动定位 API（scroll-into-view 类）——它沿祖先链滚动所有可滚容器：
  // 桌面会连带滚走 overflow 壳的面板（生产实证眉标被裁、底边露晕染色带），
  // 移动列表在 snap 页内会横滚带跑面板（实测页缘钮失同步）。nearest 语义：可见不动，越界才对齐
  useEffect(() => {
    if (!state.isPanelOpen) return
    const dList = desktopQueueRef.current
    const dItem = dList?.querySelector<HTMLLIElement>('[data-active="true"]')
    if (dList && dItem) {
      const itemTop = dItem.offsetTop
      const itemBottom = itemTop + dItem.offsetHeight
      if (itemTop < dList.scrollTop) {
        dList.scrollTop = itemTop
      } else if (itemBottom > dList.scrollTop + dList.clientHeight) {
        dList.scrollTop = itemBottom - dList.clientHeight
      }
    }
    const mList = mobileQueueRef.current
    const mItem = mList?.querySelector<HTMLLIElement>('[data-active="true"]')
    if (mList && mItem) {
      mList.scrollTop = Math.max(0, mItem.offsetTop - mList.clientHeight / 2 + mItem.clientHeight / 2)
    }
  }, [state.isPanelOpen, state.currentIndex, mobilePage])

  const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 册页横翻：swipe 由 scroll-snap 承担，onScroll 把页缘钮选中态同步回来
  const handlePagesScroll = () => {
    const el = pagesRef.current
    if (!el || !el.clientWidth) return
    const page = Math.round(el.scrollLeft / el.clientWidth) === 1 ? 'queue' : 'words'
    setMobilePage((prev) => (prev === page ? prev : page))
  }

  const gotoPage = (page: 'words' | 'queue') => {
    setMobilePage(page)
    const el = pagesRef.current
    if (!el) return
    el.scrollTo({ left: page === 'queue' ? el.clientWidth : 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // 下滑关闭：手柄与图版是拖拽面，跟手位移，松手过阈值关闭、否则回弹
  const onDragTouchStart = (event: React.TouchEvent) => {
    dragStartYRef.current = event.touches[0]?.clientY ?? null
  }

  const onDragTouchMove = (event: React.TouchEvent) => {
    const startY = dragStartYRef.current
    if (startY == null) return
    dragYRef.current = Math.max(0, (event.touches[0]?.clientY ?? startY) - startY)
    setDragY(dragYRef.current)
  }

  const onDragTouchEnd = () => {
    dragStartYRef.current = null
    if (dragYRef.current > 96) {
      togglePanel()
    }
    dragYRef.current = 0
    setDragY(null)
  }

  // 歌词跟随滚动 + 墨随声走：桌面手动 scrollTo 只滚 LyricsScroll（公式与移动词窗一致，
  // 禁用原生滚动定位 API——理由见队列定位注释）；移动词窗手动垂直 scrollTop；reduced-motion 退化为瞬时定位
  useEffect(() => {
    if (!state.isPanelOpen) return
    if (activeLyric < 0) {
      for (const bloom of [lyricBloomRef.current, mobileBloomRef.current]) bloom?.classList.remove('on')
      return
    }
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const container = scrollRef.current
    const dEl = container?.querySelector<HTMLDivElement>(`[data-lyric-index="${activeLyric}"]`)
    if (dEl && container) {
      container.scrollTo({
        top: dEl.offsetTop - container.clientHeight / 2 + dEl.offsetHeight / 2,
        behavior,
      })
      if (lyricBloomRef.current) {
        lyricBloomRef.current.style.transform = `translateY(${dEl.offsetTop - 12}px)`
        lyricBloomRef.current.classList.add('on')
      }
    }
    const mContainer = mobileLyricsRef.current
    const mEl = mContainer?.querySelector<HTMLDivElement>(`[data-lyric-index="${activeLyric}"]`)
    if (mEl && mContainer) {
      mContainer.scrollTo({
        top: mEl.offsetTop - mContainer.clientHeight / 2 + mEl.clientHeight / 2,
        behavior
      })
      if (mobileBloomRef.current) {
        mobileBloomRef.current.style.transform = `translateY(${mEl.offsetTop - 10}px)`
        mobileBloomRef.current.classList.add('on')
      }
    }
  }, [activeLyric, state.isPanelOpen])

  return (
    <>
      <Backdrop $visible={state.isPanelOpen} onClick={togglePanel} aria-hidden='true' />
      <Panel
        $visible={state.isPanelOpen}
        $drag={dragY}
        role='dialog'
        aria-modal='true'
        aria-label={t('player.panel.title')}
        aria-hidden={!state.isPanelOpen}
      >
        <WashSrc $src={currentTrack?.coverUrl} aria-hidden='true' />
        <PaperVeil aria-hidden='true' />
        <CloseButton ref={closeRef} type='button' aria-label={t('player.panel.close')} onClick={togglePanel} tabIndex={state.isPanelOpen ? 0 : -1}>
          <IconX size={20} />
        </CloseButton>

        <NowHeader>
          <CoverHero $src={currentTrack?.coverUrl} aria-hidden='true' />
          <TrackHeading>{currentTrack?.name ?? t('player.panel.waiting')}</TrackHeading>
          <TrackArtist>{currentTrack?.artist ?? ' '}</TrackArtist>
        </NowHeader>

        <NowDock>
          <ProgressWrapper>
            <ProgressRow>
              <TimeCode $now>{formatDuration(state.progress)}</TimeCode>
              {/* progressPct 已是 0–100 百分数，直传即可——二次 ×100 会被钳到 100、光标钉死末端 */}
              <Progress
                value={progressPct}
                onChange={(pct) => seek((pct / 100) * totalDuration)}
                thumb
                breathing={playing}
                label={t('player.panel.progressLabel')}
              />
              <TimeCode>{formatDuration(totalDuration)}</TimeCode>
            </ProgressRow>
          </ProgressWrapper>

          <ControlRow>
            <SkipButton type='button' aria-label={t('player.panel.previous')} onClick={playPrevious}>
              <IconSkipBack size={20} />
            </SkipButton>
            <PlayButton type='button' aria-label={playing ? t('player.panel.pause') : t('player.panel.play')} onClick={togglePlay}>
              {playing ? <IconPause size={24} /> : <IconPlay size={24} />}
            </PlayButton>
            <SkipButton type='button' aria-label={t('player.panel.next')} onClick={playNext}>
              <IconSkipForward size={20} />
            </SkipButton>
          </ControlRow>

          <DeckRow>
            <ModeGroup role='group' aria-label={t('player.panel.modeGroup')}>
              {(Object.keys(MODE_LABEL_KEYS) as PlayerMode[]).map((mode) => (
                <ModeButton
                  key={mode}
                  type='button'
                  style={
                    state.mode === mode
                      ? ({ '--mode-line': 'var(--primary-color)', '--mode-ink': 'var(--primary-color)' } as React.CSSProperties)
                      : undefined
                  }
                  aria-pressed={state.mode === mode}
                  onClick={() => setMode(mode)}
                >
                  {t(MODE_LABEL_KEYS[mode])}
                </ModeButton>
              ))}
            </ModeGroup>

            <VolumeRow>
              <IconVolume size={16} aria-hidden='true' />
              <VolumeBox>
                <Progress
                  value={state.volume * 100}
                  onChange={(v) => setVolume(v / 100)}
                  thumb
                  label={t('player.panel.volumeLabel')}
                />
              </VolumeBox>
            </VolumeRow>
          </DeckRow>
        </NowDock>

        <LyricsSection aria-label={t('player.panel.lyrics')}>
          <SectionHeading>{t('player.panel.lyricsHeading')}</SectionHeading>
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
              <LyricLine>{t('player.panel.noLyrics')}</LyricLine>
            )}
          </LyricsScroll>
        </LyricsSection>

        <QueueSection aria-label={t('player.panel.queue')}>
          <SectionHeading>
            <IconListMusic size={13} aria-hidden='true' /> {t('player.panel.queue')}
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

        {/* 移动端册页：词页（装裱图版 + 短词窗）横翻目次对页；页缘钮为键盘/读屏等价路径 */}
        <GrabHandle
          aria-hidden='true'
          data-testid='panel-grab-handle'
          onTouchStart={onDragTouchStart}
          onTouchMove={onDragTouchMove}
          onTouchEnd={onDragTouchEnd}
        />
        <LeafPages ref={pagesRef} onScroll={handlePagesScroll} aria-label={t('player.panel.pagesAria')}>
          <LeafPage aria-label={t('player.panel.wordsPage')} aria-hidden={mobilePage !== 'words'} inert={mobilePage !== 'words'}>
            <Plate
              data-testid='panel-plate'
              onTouchStart={onDragTouchStart}
              onTouchMove={onDragTouchMove}
              onTouchEnd={onDragTouchEnd}
            >
              <PlateArt $src={currentTrack?.coverUrl} aria-hidden='true' />
              <PlateNo>
                {t('player.panel.plateNo', {
                  index: String((state.currentIndex ?? 0) + 1).padStart(2, '0'),
                  total: String(queue.length).padStart(2, '0')
                })}
              </PlateNo>
            </Plate>
            <LeafTitle>{currentTrack?.name ?? t('player.panel.waiting')}</LeafTitle>
            <LeafArtist>{currentTrack?.artist ?? ' '}</LeafArtist>
            <WordWindow ref={mobileLyricsRef}>
              <WordBloom ref={mobileBloomRef} aria-hidden='true' />
              {lyrics.length ? (
                lyrics.map((line, index) => (
                  <WordLine
                    key={`${line.time}-${index}`}
                    type='button'
                    data-lyric-index={index}
                    $active={index === activeLyric}
                    $near={Math.abs(index - activeLyric) === 1}
                    onClick={() => seek(line.time)}
                  >
                    {line.text}
                  </WordLine>
                ))
              ) : (
                <WordEmpty>
                  <span>{t('player.panel.wordEmpty')}</span>
                </WordEmpty>
              )}
            </WordWindow>
          </LeafPage>
          <LeafPage aria-label={t('player.panel.queuePage')} aria-hidden={mobilePage !== 'queue'} inert={mobilePage !== 'queue'}>
            <SectionHeading>{t('player.panel.queueHeadingMobile')}</SectionHeading>
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
          </LeafPage>
        </LeafPages>

        <PageTicks role='group' aria-label={t('player.panel.ticksAria')}>
          <PageTick
            type='button'
            style={
              mobilePage === 'words'
                ? ({ '--tick-line': 'var(--primary-color)', '--tick-fill': 1, '--tick-dim': 1 } as React.CSSProperties)
                : undefined
            }
            aria-current={mobilePage === 'words' ? 'true' : undefined}
            aria-label={t('player.panel.wordsPage')}
            onClick={() => gotoPage('words')}
          />
          <PageTick
            type='button'
            style={
              mobilePage === 'queue'
                ? ({ '--tick-line': 'var(--primary-color)', '--tick-fill': 1, '--tick-dim': 1 } as React.CSSProperties)
                : undefined
            }
            aria-current={mobilePage === 'queue' ? 'true' : undefined}
            aria-label={t('player.panel.queuePage')}
            onClick={() => gotoPage('queue')}
          />
        </PageTicks>
      </Panel>
    </>
  )
}
