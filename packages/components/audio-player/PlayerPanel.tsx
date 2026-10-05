'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import { useLocale } from '@wuh.site/components/locales'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import Progress from '@wuh.site/components/progress'
import { MARQUEE_GAP_PX, MARQUEE_SPEED_PX_PER_S, marquee, useMarqueeOverflow } from './useMarquee'
import {
  IconListMusic,
  IconPause,
  IconPlay,
  IconRepeat,
  IconRepeatOne,
  IconShuffle,
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
const RULE_LINE = 'color-mix(in oklab, var(--text-color) 9%, transparent)'
const EASE = 'var(--motion-ease-out-soft)'
const QUICK = 'var(--motion-dur-quick)'
// 面板开合 240ms：由 --motion-dur-quick(150ms) 派生，落在交互规范 150–300ms 区间
const DUR_PANEL = 'calc(var(--motion-dur-quick) * 1.6)'
/* ===== 队列翻页屏（20261001 定稿，视觉稿 shadow-docs/changes/20261001-style-player-queue-fold/prototype.html）=====
   以右边框为翻页轴：静止斜倚 -40°（= 动画起点，第一帧零跳变）半透明可读不可点，
   hover/聚焦转正 0° 浮起可选曲。宽度恒定，两态只差角度/透明度/可点击/投影——布局零位移。
   曲线走站点注入令牌：引用未定义令牌会让 transition 整条作废回退 all 0s（帧采样实证），守卫钉死 */
const FOLD_WIDTH_PX = 340
const FOLD_REST_ANGLE = '-40deg'
const FOLD_DUR = '520ms'
const FOLD_LIFT_SHADOW = '-24px 12px 48px color-mix(in oklab, black 22%, transparent)'
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

const CloseButton = styled.button`
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

const toolHover = css`
  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }
`

/* ===== 右上工具组（桌面）：词卷印章钮 + 列表抽屉钮 ===== */
const TopTools = styled.div`
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
const WordsToggle = styled.button`
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

const DrawerButton = styled.button`
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

/* ===== 墨痕歌词：当前句淡墨大字浮上纸底，换句交叠渐变（纯装饰） ===== */
const GhostLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    & > span {
      animation: none !important;
    }
  }
`

const GhostLine = styled.span<{ $now?: boolean }>`
  position: absolute;
  left: 50%;
  top: ${(p) => (p.$now ? '27%' : '20%')};
  transform: translateX(-50%);
  max-width: 92%;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(40px, 8vw, 74px);
  line-height: 1.2;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: color-mix(in oklab, var(--text-color) ${(p) => (p.$now ? '8%' : '3%')}, transparent);

  /* 换句渐变：重挂载触发淡入（约 1.6s），旧句随卸载消失 */
  ${(p) =>
    p.$now
      ? css`
          animation: ghostIn calc(var(--motion-dur-quick) * 10.6) ${EASE} both;

          @keyframes ghostIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `
      : null}
`

/* ===== 桌面舞台：装裱封面 + 题名手卷 + 界格笺题跋（居中单焦点） ===== */
const NowStage = styled.div`
  grid-area: stage;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl) var(--space-2xl) 0;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 主舞台后一团主题色暖晕，让居中构图贴住纸面不悬浮 */
const StageGlow = styled.div`
  position: absolute;
  left: 50%;
  top: 36%;
  transform: translate(-50%, -50%);
  width: min(760px, 90%);
  height: 68%;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary-color) 7%, transparent), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
`

const PlateWrap = styled.div`
  position: relative;
`

/* 竖排 mono 题签「曲 · N / 总数」：伸出纸边的版本信息；拉丁文语境字距降档 */
const StageTab = styled.span`
  position: absolute;
  top: var(--space-xs);
  left: -14px;
  z-index: 1;
  writing-mode: vertical-rl;
  padding: var(--space-xs) var(--space-4xs);
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.22em;
  color: var(--primary-color);

  [lang='en'] & {
    letter-spacing: 0.1em;
  }
`

/* ===== 封面碟化（20261002 定稿）：黑胶大碟嵌方裱（月洞窗构图）=====
   碟面 = 纯 CSS 深色底 + 同心纹刻 + 斜向高光；碟心圆标即封面图（换曲随 coverUrl 换图）。
   播放随转（26s/圈慢转，/music 小黑胶同语言）、暂停冻结当前角度不复位、reduced-motion 静止。
   碟径沿用舞台预算三档帽（唯一因变量关系不破坏） */
const DISC_REV = '26s'
const discSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

/* 封面装裱：方形纸裱保留发丝线语言，圆碟嵌中 */
const Plate = styled.div`
  padding: var(--space-sm);
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  box-shadow: var(--elevation-soft);
`

/* 舞台预算分档（按视口高度驱动：面板高 = 100vh − 96px，与宽度无关） */
const STAGE_TIER_SHORT = 959
const STAGE_TIER_COMPACT = 859

/* 黑胶碟：尺寸是舞台预算的唯一因变量：帽与面板高度同源（min(px, (100vh−96px)×系数)），
   旧裸 32vh 帽与面板高度不同源，矮视口吞题名（生产实锤）。
   旋转由 $playing 驱动 play-state（transient prop 静态规则，显隐纪律）；
   暂停 = paused 冻结当前角度（真实黑胶行为，不复位） */
const PlateArt = styled.div<{ $playing?: boolean }>`
  position: relative;
  width: min(252px, calc((100vh - 96px) * 0.3));
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 28%, color-mix(in oklab, white 10%, transparent), transparent 42%),
    repeating-radial-gradient(circle at 50% 50%, color-mix(in oklab, white 5%, transparent) 0 1px, transparent 1px 4px),
    radial-gradient(circle, color-mix(in oklab, black 84%, var(--normal-900)) 0 60%, color-mix(in oklab, black 92%, var(--normal-900)) 60% 100%);
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, inset 0 0 26px color-mix(in oklab, black 35%, transparent),
    var(--elevation-soft);
  animation: ${discSpin} ${DISC_REV} linear infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};

  @media (max-height: ${STAGE_TIER_SHORT}px) {
    width: min(224px, calc((100vh - 96px) * 0.3));
  }

  @media (max-height: ${STAGE_TIER_COMPACT}px) {
    width: min(184px, calc((100vh - 96px) * 0.26));
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/* 碟心封面圆标：换曲随 coverUrl 换图 */
const DiscLabel = styled.div<{ $src?: string }>`
  position: absolute;
  inset: 29%;
  border-radius: 50%;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, 0 0 0 3px color-mix(in oklab, black 32%, transparent);
`

/* 碟心轴点 */
const DiscDot = styled.div`
  position: absolute;
  inset: calc(50% - 4px);
  border-radius: 50%;
  background: var(--background-100);
  box-shadow: 0 0 0 1px ${HAIRLINE};
`

/* 题名手卷：溢出才徐展（暂停停走），reduced-motion 回落省略号，title 显全名
   空间承诺：舞台再穷题名/歌手也不可挤压（flex-shrink: 0，封面是唯一因变量） */
const StageTitle = styled.h2<{ $marquee: boolean }>`
  display: block;
  flex-shrink: 0;
  margin: var(--space-lg) 0 0;
  max-width: 680px;
  width: 100%;
  position: relative;
  min-width: 0;
  text-align: center;
  font-family: var(--font-serif);
  font-size: 25px;
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ${(p) => (p.$marquee ? 'clip' : 'ellipsis')};
  mask-image: linear-gradient(90deg, black 0, black calc(100% - 8px), transparent 100%);

  @media (prefers-reduced-motion: reduce) {
    text-overflow: ellipsis;
    mask-image: none;
  }
`

const StageGhost = styled.span`
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
`

const StageTrack = styled.span<{ $playing: boolean; $duration: string }>`
  display: inline-flex;
  min-width: 0;
  white-space: nowrap;
  will-change: transform;
  animation: ${marquee} ${(p) => p.$duration} linear infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const StageCopy = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  padding-right: ${MARQUEE_GAP_PX}px;
`

const StageArtist = styled.p`
  flex-shrink: 0;
  margin: var(--space-xs) 0 0;
  max-width: 100%;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 界格笺题跋：三行各落一道发丝界线，当前句大字居格 + 朱砂句读环 */
const Epigraph = styled.div`
  margin-top: var(--space-lg);
  width: min(400px, 100%);
  mask-image: linear-gradient(180deg, transparent, black 18%, black 86%, transparent);
`

const EpiRow = styled.p<{ $act?: boolean }>`
  margin: 0;
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  letter-spacing: 0.06em;
  line-height: 1.8;
  color: ${INK_GHOST};
  border-bottom: 1px solid ${RULE_LINE};

  [lang='en'] & {
    letter-spacing: 0.02em;
  }

  ${(p) =>
    p.$act
      ? css`
          font-size: 22px;
          font-weight: 600;
          color: var(--text-color);

          &::before {
            content: '';
            display: inline-block;
            width: 7px;
            height: 7px;
            border: 1.5px solid var(--primary-color);
            border-radius: 50%;
            margin-right: 14px;
            vertical-align: 5px;
          }
        `
      : css`
          /* 矮视口二档缓冲：题跋降为当前句，非当前句让位给题名/歌手（静态 media query，不涉态驱动禁令） */
          @media (max-height: ${STAGE_TIER_COMPACT}px) {
            display: none;
          }
        `}
`

/* ===== dock（桌面 + 移动共用）：進度 + 单行钮群 ===== */
const NowDock = styled.div`
  grid-area: dock;
  position: relative;
  /* z9：高于队列翻页热区（z8）——右缘 hover 不得劫持進度/钮群点击 */
  z-index: 9;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-lg) var(--space-xl);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    padding: var(--space-sm) var(--space-base) calc(var(--space-base) + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid ${HAIRLINE};
  }
`

/* 进度行：时间码两端，中段为共享 Progress 交互态；桌面 460px 居中 */
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: min(100%, 460px);
  margin: 0 auto;
`

const TimeCode = styled.span<{ $now?: boolean }>`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1;
  color: ${(p) => (p.$now ? INK_MUTED : INK_FAINT)};
`

/* 单行钮群：模式 | 上一曲/播放/下一曲 | 音量（playbar 同构） */
const ControlRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: var(--space-sm);
    gap: var(--space-lg);
  }
`

/* 幽灵传输钮：去常驻描边，纸面安静，hover 才显性 */
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

/* 实心盘：面板唯一饱和元素；::after 内缩环作碟面标签环（静态，不旋转）。
   position: relative 是环的包含块——缺位时 ::after 落到 NowDock，白环画成横贯 dock 的巨椭圆（v1.4.54 生产实证） */
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

/* 模式钮：icon-only，图标随当前模式换装（Repeat/Repeat1/Shuffle），
   朱砂染色即「当前模式」，点击循环——任一语言宽度归零 */
const ModeButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--primary-color);
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }

  ${focusRing}
`

/* 音量：钮群右端图标钮 + 上弹竖向滑杆小纸卡 */
const VolWrap = styled.span`
  position: relative;
  display: inline-flex;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const VolumeButton = styled(SkipButton)``

const VolumePop = styled.div`
  position: absolute;
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  padding: var(--space-sm) var(--space-sm) var(--space-xs);
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: 10px;
  box-shadow: var(--elevation-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);

  /* 45° 纸角指向锚点 */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    margin-left: -4px;
    width: 8px;
    height: 8px;
    background: var(--background-100);
    border-right: 1px solid ${HAIRLINE};
    border-bottom: 1px solid ${HAIRLINE};
    transform: rotate(45deg);
  }
`

const VolumePopLabel = styled.span`
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: ${INK_FAINT};
`

const VolumePct = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

/* 竖向樂印滑杆：共享 Progress 只支持横向，竖向变体在组件内实现同一视觉语言
   （印光标 = 白文方印「樂」，填充自底向上）；role=slider + 键盘 + 指针拖拽 */
const VSlider = styled.div`
  position: relative;
  width: 24px;
  height: 112px;
  cursor: pointer;
  touch-action: none;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 6px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: color-mix(in oklab, var(--text-color) 14%, transparent);
  }

  ${focusRing}
`

const VFill = styled.div<{ $fill: number }>`
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 6px;
  height: ${(p) => p.$fill * 100}%;
  transform: translateX(-50%);
  border-radius: 999px;
  background: var(--primary-color);
  pointer-events: none;
`

const VThumb = styled.div<{ $fill: number }>`
  position: absolute;
  left: 50%;
  bottom: ${(p) => p.$fill * 100}%;
  transform: translate(-50%, 50%);
  width: 17px;
  height: 17px;
  border-radius: var(--border-radius-xs);
  background: var(--primary-color);
  color: var(--background-100);
  font-family: var(--font-serif);
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
  pointer-events: none;
`

/* ===== 词卷展开态（桌面）：题头小装裱 + 竖排朱丝栏词卷 ===== */
const WordsView = styled.div`
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

const WordsHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  width: min(680px, 100%);
`

const WordsHeadPlate = styled.div`
  flex-shrink: 0;
  padding: var(--space-4xs) var(--space-4xs) var(--space-xs);
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  box-shadow: var(--elevation-soft);
`

const WordsHeadArt = styled.div<{ $src?: string }>`
  width: 88px;
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
`

const WordsTitle = styled.p`
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

const WordsArtist = styled.p`
  margin: var(--space-4xs) 0 0;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
`

/* 竖排词卷：句读自右向左成列，界格转朱丝栏（列间发丝竖线）；
   当前句大字 + 3px 朱砂侧标；随播逐列左移、两端渐隐。
   en 语境竖排可读性差 → 回退横排界格笺 */
const WordsVerse = styled.div`
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

const WordsLine = styled.p<{ $act?: boolean }>`
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

/* ===== 播放列表抽屉（桌面）：自右滑入纸卡。
   显隐态经行内样式驱动（JSX style），不经 styled 动态类插值——规则删除竞态免疫（music-player.md） ===== */
const DrawerScrim = styled.button`
  position: absolute;
  inset: 0;
  z-index: 7;
  padding: 0;
  background: color-mix(in oklab, black 28%, transparent);
  border: none;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${QUICK} ${EASE}, visibility 0s linear ${QUICK};
  visibility: hidden;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ===== 队列翻页屏（桌面，20261001 定稿）：右缘热区 + 斜倚屏 =====
   热区 QZone 是屏的 DOM 祖先：指针滑到转正屏上 :hover 仍保持（CSS 下拉同构）；
   透视只作用于直接子级，隔层必须 preserve-3d 透传面板灭点（漏配 = 3D 静默退化）。
   进出场由纯 CSS :hover / :focus-within 引擎驱动（非 React 态翻转，不涉显隐纪律）；
   转正挂点用静态 data 属性——跨组件插值选择器禁用（design-system.md） */
const QZone = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${FOLD_WIDTH_PX}px;
  z-index: 8;
  transform-style: preserve-3d;

  /* 键盘等价路径：Tab 进入队列即转正（与 hover 同态），焦点离开原路翻回 */
  &:focus-within [data-fold-screen='true'] {
    transform: rotateY(0deg);
    opacity: 1;
    pointer-events: auto;
    box-shadow: ${FOLD_LIFT_SHADOW};
    transition-delay: 0s, 0s, 0s;
  }

  /* hover 触发只在精确指针设备：触屏/平板走列表钮 pinned 等价路径 */
  @media (hover: hover) and (pointer: fine) {
    &:hover [data-fold-screen='true'] {
      transform: rotateY(0deg);
      opacity: 1;
      pointer-events: auto;
      box-shadow: ${FOLD_LIFT_SHADOW};
      transition-delay: 0s, 0s, 0s;
    }
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 屏本体：静止斜倚 -40°（= 动画起点）半透明可读不可点；转正 = 0° 实墨可点选。
   pinned（queueOpen）由 JSX 行内样式驱动（显隐纪律），与 hover 同一落点姿态 */
const QScreen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${FOLD_WIDTH_PX}px;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-base) 0 var(--space-lg);
  background: color-mix(in oklab, var(--background-100) 94%, transparent);
  border-left: 1px solid ${HAIRLINE};
  border-radius: var(--radius-card) 0 0 var(--radius-card);
  transform-origin: 100% 50%;
  transform: rotateY(${FOLD_REST_ANGLE});
  opacity: 0.45;
  pointer-events: none;
  transition: transform ${FOLD_DUR} var(--motion-ease-in-out-soft), opacity ${QUICK} ${EASE},
    box-shadow ${FOLD_DUR} ${EASE};
  /* 离场宽限：透明位延迟 160ms，指针掠过不频闪 */
  transition-delay: 0s, 160ms, 0s;
  backface-visibility: hidden;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }

  ${reducedMotion}
`

/* 眉标：短朱砂 tick + 字距小标 */
const SectionHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
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

/* ===== 播放列表行（桌面抽屉 + 移动目次页共用） ===== */
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

/* ===== 播放列表行（桌面翻页屏 + 移动目次页共用） =====
   当前项底色/左标走行内自定义属性 --q-active（激活态禁动态类与属性选择器，music-player.md）；
   行 hover 整行左引 + 序号翻播放键（/music 目次行既有语言），纯 CSS :hover 驱动 */
const QueueItem = styled.li`
  position: relative;
  border-radius: var(--border-radius-base);
  background: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 7%), transparent);
  transition: transform 200ms var(--motion-ease-out-soft), background-color 160ms var(--motion-ease-out-soft);

  &:hover {
    background: color-mix(in oklab, var(--text-color) 5%, transparent);
    transform: translateX(-4px);
  }

  /* 当前项：朱砂左标（透明度随行内 --q-active 显隐） */
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
    opacity: var(--q-active, 0);
  }

  /* 序号/播放键双面：hover 翻面 */
  & .q-no-face,
  & .q-no-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    transition: opacity 140ms var(--motion-ease-out-soft);
  }

  & .q-no-play {
    color: var(--primary-color);
    opacity: 0;
  }

  &:hover .q-no-face {
    opacity: 0;
  }

  &:hover .q-no-play {
    opacity: 1;
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

const QueueNo = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 22px;
  height: 16px;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 100%), ${INK_FAINT});
`

const QueueName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 100%), var(--text-color));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 歌手列限宽省略：长歌手名不再把歌名列挤没，title 显全名 */
const QueueArtist = styled.span`
  max-width: 92px;
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
  min-width: 0;
`

/* ===== 移动端册页（20260930 定稿形态保留）：装裱图版 + 短词窗 + 目次对页横翻 ===== */

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

/* 装裱图版：纸框发丝线 + 纸边；图面也是下滑关闭的拖拽面 */
const LeafPlate = styled.figure`
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
const LeafPlateArt = styled.div<{ $src?: string }>`
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
const PlateNo = styled.figcaption`
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
const LeafTitle = styled.h2`
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

const LeafArtist = styled.p`
  margin: var(--space-4xs) 0 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 短词窗：mask 上下渐隐，当前句加重、相邻淡化；点按行跳播 */
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

/* 无词空态：印章式「全体欣赏音乐」；拉丁文语境字距降档 */
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

  [lang='en'] & > span {
    letter-spacing: 0.12em;
  }
`

/* 页缘翻页钮：swipe 的键盘/读屏等价路径；选中态走行内自定义属性（免疫机制，
   见 music-player.md——选择器驱动激活态两连败），选中条宽度切换走 scaleX */
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
const WordBloom = styled.div`
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

const MODE_CYCLE: PlayerMode[] = ['order', 'repeat-one', 'shuffle']

const MODE_LABEL_KEYS: Record<PlayerMode, string> = {
  order: 'player.panel.modeOrder',
  'repeat-one': 'player.panel.modeRepeatOne',
  shuffle: 'player.panel.modeShuffle'
}

const MODE_ICONS: Record<PlayerMode, typeof IconRepeat> = {
  order: IconRepeat,
  'repeat-one': IconRepeatOne,
  shuffle: IconShuffle
}

export const AudioPlayerPanel = () => {
  const { t } = useLocale()
  const {
    currentTrack,
    queue,
    state,
    actions: { togglePanel, playNext, playPrevious, togglePlay, seek, setVolume, setMode, playTrack }
  } = useAudioPlayer()
  const mobileLyricsRef = useRef<HTMLDivElement | null>(null)
  const mobileBloomRef = useRef<HTMLDivElement | null>(null)
  const drawerListRef = useRef<HTMLUListElement | null>(null)
  const mobileQueueRef = useRef<HTMLUListElement | null>(null)
  const pagesRef = useRef<HTMLDivElement | null>(null)
  const wordsVerseRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const volWrapRef = useRef<HTMLSpanElement | null>(null)
  const dragStartYRef = useRef<number | null>(null)
  const dragYRef = useRef(0)
  const [mobilePage, setMobilePage] = useState<'words' | 'queue'>('words')
  const [dragY, setDragY] = useState<number | null>(null)
  const [wordsOpen, setWordsOpen] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)
  const [volOpen, setVolOpen] = useState(false)
  // 粘性开合：进入右缘热区即锁存「开」，指针在面板内漫游（末行移出/dock/舞台边缘）不收拢，离板才折回。
  // React 态 → 视觉走行内样式（显隐纪律）；与 queueOpen（pinned）并集驱动 QScreen
  const [foldLatch, setFoldLatch] = useState(false)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)
  const progressPct = (Math.min(state.progress, totalDuration) / totalDuration) * 100

  const lyrics = useMemo(() => parseLyrics(currentTrack?.lyrics), [currentTrack?.lyrics])
  const activeLyric = useMemo(() => findActiveLyricIndex(lyrics, state.progress), [lyrics, state.progress])
  const playing = state.status === 'playing'
  // 无词/前奏期（activeLyric<0）回落到首句，题跋与墨痕始终有可渲染行
  const lyricIdx = activeLyric >= 0 ? activeLyric : 0
  const epiPrev = lyrics[lyricIdx - 1]
  const epiAct = lyrics[lyricIdx]
  const epiNext = lyrics[lyricIdx + 1]
  const stageName = currentTrack?.name ?? t('player.panel.waiting')
  // 显式泛型：wrapperRef 挂在 styled.h2 上，Ref<HTMLElement> 装不进 Ref<HTMLHeadingElement>（域类型守卫存量错误就地修复）
  const stageTitle = useMarqueeOverflow<HTMLHeadingElement>(stageName)
  const titleMarquee = stageTitle.metrics.visible > 0 && stageTitle.metrics.text > stageTitle.metrics.visible
  const titleDuration = `${(stageTitle.metrics.text + MARQUEE_GAP_PX) / MARQUEE_SPEED_PX_PER_S}s`
  const ModeIcon = MODE_ICONS[state.mode]
  const volumePct = Math.round(state.volume * 100)
  // 最爱印：本卷播放次数最高曲目播放时进度印换「愛」——口径与 /music 最爱徽标同源（含并列）
  const favorite = useMemo(() => {
    const maxPlays = queue.reduce((max, track) => Math.max(max, track.playCount ?? 0), 0)
    return maxPlays > 0 && currentTrack?.playCount === maxPlays
  }, [queue, currentTrack])

  const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 弹层交互：打开时焦点移入关闭钮，Escape 按层收起（popover → 抽屉 → 词卷 → 面板），关闭后焦点移回
  useEffect(() => {
    if (!state.isPanelOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (volOpen) {
        setVolOpen(false)
      } else if (queueOpen) {
        setQueueOpen(false)
      } else if (wordsOpen) {
        setWordsOpen(false)
      } else {
        togglePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      restoreFocusRef.current?.focus?.()
      restoreFocusRef.current = null
    }
  }, [state.isPanelOpen, volOpen, queueOpen, wordsOpen, togglePanel])

  // 音量 popover 外点收起
  useEffect(() => {
    if (!volOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (volWrapRef.current && !volWrapRef.current.contains(event.target as Node)) {
        setVolOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [volOpen])

  // 面板关闭时复位桌面覆盖层状态
  useEffect(() => {
    if (state.isPanelOpen) return
    setWordsOpen(false)
    setQueueOpen(false)
    setVolOpen(false)
    setFoldLatch(false)
  }, [state.isPanelOpen])

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

  // 播放列表定位到当前曲：抽屉（桌面）与目次页（移动）都用手动 scrollTop。
  // 定位一律手动只滚目标容器，禁用原生滚动定位 API（scroll-into-view 类）——它沿祖先链滚动所有可滚容器：
  // 桌面会连带滚走 overflow 壳的面板（生产实证眉标被裁、底边露晕染色带），
  // 移动列表在 snap 页内会横滚带跑面板（实测页缘钮失同步）。抽屉 nearest 语义：可见不动，越界才对齐
  useEffect(() => {
    if (!state.isPanelOpen) return
    const dList = drawerListRef.current
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
  }, [state.isPanelOpen, state.currentIndex, queueOpen, mobilePage])

  // 词卷跟随：当前句列滚到视口中部。手动 scrollTo 只滚词卷容器（面板壳 overflow: clip 后不是滚动容器，
  // 但定位纪律仍全文件禁原生滚动定位 API）；竖排 vertical-rl 的 scrollLeft 为负向域，
  // 按几何换算目标列居中；en 横排回退用同构的 top 公式
  useEffect(() => {
    if (!state.isPanelOpen || !wordsOpen) return
    const container = wordsVerseRef.current
    const el = container?.querySelector<HTMLElement>(`[data-words-index="${lyricIdx}"]`)
    if (!container || !el) return
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const vertical = getComputedStyle(container).writingMode.startsWith('vertical')
    if (vertical) {
      container.scrollTo({
        left: container.clientWidth / 2 - el.offsetWidth / 2 - el.offsetLeft,
        top: 0,
        behavior,
      })
    } else {
      container.scrollTo({
        top: el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2,
        behavior,
      })
    }
  }, [state.isPanelOpen, wordsOpen, lyricIdx])

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

  // 移动词窗跟随：手动垂直 scrollTop（定位纪律全文件禁原生滚动定位 API）；墨晕随当前句位移。
  // 桌面歌词定位由词卷跟随 effect 承担（同手册动滚动）
  useEffect(() => {
    if (!state.isPanelOpen) return
    if (activeLyric < 0) {
      mobileBloomRef.current?.classList.remove('on')
      return
    }
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const mContainer = mobileLyricsRef.current
    const mEl = mContainer?.querySelector<HTMLElement>(`[data-lyric-index="${activeLyric}"]`)
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

  // 竖向滑杆：指针拖拽 + 键盘步进（方向键/Home/End），语义同共享 Progress 的交互态
  const volumeFromPointer = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pct = 1 - (event.clientY - rect.top) / rect.height
    setVolume(Math.min(1, Math.max(0, pct)))
  }

  const onVSliderKeyDown = (event: React.KeyboardEvent) => {
    const step = 0.05
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      setVolume(Math.min(1, state.volume + step))
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      setVolume(Math.max(0, state.volume - step))
    } else if (event.key === 'Home') {
      setVolume(0)
    } else if (event.key === 'End') {
      setVolume(1)
    } else {
      return
    }
    event.preventDefault()
  }

  const cycleMode = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(state.mode) + 1) % MODE_CYCLE.length]
    setMode(next)
  }

  const wordsAvailable = lyrics.length > 0

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
        onPointerLeave={() => setFoldLatch(false)}
      >
        <WashSrc $src={currentTrack?.coverUrl} aria-hidden='true' />
        <PaperVeil aria-hidden='true' />

        {/* 墨痕歌词：播放中且有词才上纸底；词卷展开时让位。纯装饰层 */}
        {playing && wordsAvailable && !wordsOpen ? (
          <GhostLayer aria-hidden='true'>
            {epiPrev ? <GhostLine key={`ghost-prev-${lyricIdx}`}>{epiPrev.text}</GhostLine> : null}
            {epiAct ? (
              <GhostLine key={`ghost-act-${lyricIdx}`} $now>
                {epiAct.text}
              </GhostLine>
            ) : null}
          </GhostLayer>
        ) : null}

        <CloseButton ref={closeRef} type='button' aria-label={t('player.panel.close')} onClick={togglePanel} tabIndex={state.isPanelOpen ? 0 : -1}>
          <IconX size={20} />
        </CloseButton>

        <TopTools>
          <WordsToggle
            type='button'
            aria-pressed={wordsOpen}
            aria-label={t('player.panel.wordsToggle')}
            title={t('player.panel.wordsToggle')}
            style={
              wordsOpen
                ? ({
                    color: 'var(--primary-color)',
                    borderColor: 'color-mix(in oklab, var(--primary-color) 45%, transparent)',
                  } as React.CSSProperties)
                : undefined
            }
            onClick={() => {
              setQueueOpen(false)
              setVolOpen(false)
              setWordsOpen((prev) => !prev)
            }}
          >
            詞
          </WordsToggle>
          <DrawerButton
            type='button'
            aria-expanded={queueOpen}
            aria-label={t('player.panel.queueDrawer')}
            title={t('player.panel.queueDrawer')}
            onClick={() => {
              setWordsOpen(false)
              setVolOpen(false)
              setQueueOpen((prev) => !prev)
            }}
          >
            <IconListMusic size={18} />
          </DrawerButton>
        </TopTools>

        {/* 桌面舞台：装裱封面 + 题名手卷 + 界格笺题跋 */}
        <NowStage>
          <StageGlow aria-hidden='true' />
          <PlateWrap>
            <StageTab aria-hidden='true'>
              {t('player.panel.plateNo', {
                index: String((state.currentIndex ?? 0) + 1).padStart(2, '0'),
                total: String(queue.length).padStart(2, '0')
              })}
            </StageTab>
            <Plate>
              <PlateArt $playing={playing} aria-hidden='true'>
                <DiscLabel $src={currentTrack?.coverUrl} />
                <DiscDot />
              </PlateArt>
            </Plate>
          </PlateWrap>
          <StageTitle ref={stageTitle.wrapperRef} $marquee={titleMarquee} title={stageName}>
            <StageGhost ref={stageTitle.ghostRef} aria-hidden='true'>
              {stageName}
            </StageGhost>
            {titleMarquee ? (
              <StageTrack $playing={playing} $duration={titleDuration}>
                <StageCopy>{stageName}</StageCopy>
                <StageCopy aria-hidden='true'>{stageName}</StageCopy>
              </StageTrack>
            ) : (
              stageName
            )}
          </StageTitle>
          <StageArtist title={currentTrack?.artist ?? ''}>{currentTrack?.artist ?? ' '}</StageArtist>
          <Epigraph>
            {epiPrev ? <EpiRow>{epiPrev.text}</EpiRow> : null}
            {epiAct ? <EpiRow $act>{epiAct.text}</EpiRow> : <EpiRow>{t('player.panel.noLyrics')}</EpiRow>}
            {epiNext ? <EpiRow>{epiNext.text}</EpiRow> : null}
          </Epigraph>
        </NowStage>

        {/* dock：進度 + 单行钮群（桌面/移动共用） */}
        <NowDock>
          <ProgressRow>
            <TimeCode $now>{formatDuration(state.progress)}</TimeCode>
            {/* progressPct 已是 0–100 百分数，直传即可——二次 ×100 会被钳到 100、光标钉死末端（进度双重百分比教训） */}
            <Progress
              value={progressPct}
              onChange={(pct) => seek((pct / 100) * totalDuration)}
              thumb
              glyph={favorite ? '愛' : '樂'}
              breathing={playing}
              label={t('player.panel.progressLabel')}
            />
            <TimeCode>{formatDuration(totalDuration)}</TimeCode>
          </ProgressRow>

          <ControlRow>
            <ModeButton
              type='button'
              aria-label={t('player.panel.modeDialLabel', { mode: t(MODE_LABEL_KEYS[state.mode]) })}
              title={t('player.panel.modeDialLabel', { mode: t(MODE_LABEL_KEYS[state.mode]) })}
              onClick={cycleMode}
            >
              <ModeIcon size={19} />
            </ModeButton>
            <SkipButton type='button' aria-label={t('player.panel.previous')} onClick={playPrevious}>
              <IconSkipBack size={20} />
            </SkipButton>
            <PlayButton type='button' aria-label={playing ? t('player.panel.pause') : t('player.panel.play')} onClick={togglePlay}>
              {playing ? <IconPause size={24} /> : <IconPlay size={24} />}
            </PlayButton>
            <SkipButton type='button' aria-label={t('player.panel.next')} onClick={playNext}>
              <IconSkipForward size={20} />
            </SkipButton>
            <VolWrap ref={volWrapRef}>
              {volOpen ? (
                <VolumePop>
                  {/* <VolumePopLabel>{t('player.panel.volumeLabel')}</VolumePopLabel> */}
                  <VSlider
                    role='slider'
                    tabIndex={0}
                    aria-label={t('player.panel.volumeLabel')}
                    aria-orientation='vertical'
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={volumePct}
                    onKeyDown={onVSliderKeyDown}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId)
                      volumeFromPointer(event)
                    }}
                    onPointerMove={(event) => {
                      if (event.buttons > 0) volumeFromPointer(event)
                    }}
                  >
                    <VFill $fill={state.volume} />
                    <VThumb $fill={state.volume} aria-hidden='true'>
                      樂
                    </VThumb>
                  </VSlider>
                  <VolumePct>{volumePct}</VolumePct>
                </VolumePop>
              ) : null}
              <VolumeButton
                type='button'
                aria-label={t('player.panel.volumeLabel')}
                aria-haspopup='true'
                aria-expanded={volOpen}
                title={t('player.panel.volumeLabel')}
                onClick={() => setVolOpen((prev) => !prev)}
              >
                <IconVolume size={19} />
              </VolumeButton>
            </VolWrap>
          </ControlRow>
        </NowDock>

        {/* 词卷展开态（桌面）：题头小装裱 + 竖排朱丝栏词卷；点行跳播 */}
        {wordsOpen ? (
          <WordsView>
            <WordsHead>
              <WordsHeadPlate>
                <WordsHeadArt $src={currentTrack?.coverUrl} aria-hidden='true' />
              </WordsHeadPlate>
              <div style={{ minWidth: 0 }}>
                <WordsTitle title={stageName}>{stageName}</WordsTitle>
                <WordsArtist>{currentTrack?.artist ?? ' '}</WordsArtist>
              </div>
            </WordsHead>
            <WordsVerse ref={wordsVerseRef}>
              {lyrics.map((line, index) => (
                <WordsLine
                  key={`${line.time}-${index}`}
                  data-words-index={index}
                  $act={index === lyricIdx}
                  onClick={() => seek(line.time)}
                >
                  {line.text}
                </WordsLine>
              ))}
            </WordsVerse>
          </WordsView>
        ) : null}

        {/* 队列翻页屏（桌面）：右缘热区内静止斜倚，hover/聚焦转正浮起可选曲；
            pinned 由 queueOpen 行内样式驱动（显隐纪律），遮罩仅 pinned 态呈现点击收回 */}
        <DrawerScrim
          aria-hidden='true'
          tabIndex={-1}
          style={
            queueOpen
              ? ({ opacity: 1, pointerEvents: 'auto', visibility: 'visible', transitionDelay: '0s' } as React.CSSProperties)
              : undefined
          }
          onClick={() => setQueueOpen(false)}
        />
        <QZone onPointerEnter={() => setFoldLatch(true)}>
          <QScreen
            data-fold-screen='true'
            role='group'
            aria-label={t('player.panel.queueDrawer')}
            style={
              queueOpen || foldLatch
                ? ({
                    transform: 'rotateY(0deg)',
                    opacity: 1,
                    pointerEvents: 'auto',
                    boxShadow: FOLD_LIFT_SHADOW,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <SectionHeading>
              <IconListMusic size={13} aria-hidden='true' /> {t('player.panel.queue')}
            </SectionHeading>
            <QueueList ref={drawerListRef}>
              {queue.map((track, index) => (
                <QueueItem
                  key={track.id}
                  data-active={track.id === currentTrack?.id}
                  style={{ '--q-active': track.id === currentTrack?.id ? 1 : 0 } as React.CSSProperties}
                >
                  <QueueButton type='button' onClick={() => playTrack(track.id)}>
                    <QueueNo>
                      <span className='q-no-face'>{String(index + 1).padStart(2, '0')}</span>
                      <span className='q-no-play' aria-hidden='true'>
                        <IconPlay size={10} />
                      </span>
                    </QueueNo>
                    <QueueName title={track.name}>{track.name}</QueueName>
                    <QueueMeta>
                      <QueueArtist title={track.artist}>{track.artist}</QueueArtist>
                      <span>{formatDuration(track.duration ?? 0)}</span>
                    </QueueMeta>
                  </QueueButton>
                </QueueItem>
              ))}
            </QueueList>
          </QScreen>
        </QZone>

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
            <LeafPlate
              data-testid='panel-plate'
              onTouchStart={onDragTouchStart}
              onTouchMove={onDragTouchMove}
              onTouchEnd={onDragTouchEnd}
            >
              <LeafPlateArt $src={currentTrack?.coverUrl} aria-hidden='true' />
              <PlateNo>
                {t('player.panel.plateNo', {
                  index: String((state.currentIndex ?? 0) + 1).padStart(2, '0'),
                  total: String(queue.length).padStart(2, '0')
                })}
              </PlateNo>
            </LeafPlate>
            <LeafTitle title={stageName}>{stageName}</LeafTitle>
            <LeafArtist title={currentTrack?.artist ?? ''}>{currentTrack?.artist ?? ' '}</LeafArtist>
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
                <QueueItem
                  key={track.id}
                  data-active={track.id === currentTrack?.id}
                  style={{ '--q-active': track.id === currentTrack?.id ? 1 : 0 } as React.CSSProperties}
                >
                  <QueueButton type='button' onClick={() => playTrack(track.id)}>
                    <QueueNo>
                      <span className='q-no-face'>{String(index + 1).padStart(2, '0')}</span>
                      <span className='q-no-play' aria-hidden='true'>
                        <IconPlay size={10} />
                      </span>
                    </QueueNo>
                    <QueueName title={track.name}>{track.name}</QueueName>
                    <QueueMeta>
                      <QueueArtist title={track.artist}>{track.artist}</QueueArtist>
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
