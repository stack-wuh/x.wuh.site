'use client'

/* dock：進度印 + 单行钮群 + 音量 popover 样式（20261005 自 PlayerPanel.tsx 拆出） */
import styled from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { EASE, HAIRLINE, INK_FAINT, INK_MUTED, QUICK, focusRing } from './tokens'

/* ===== dock（桌面 + 移动共用）：進度 + 单行钮群 ===== */
export const NowDock = styled.div`
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
export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: min(100%, 460px);
  margin: 0 auto;
`

export const TimeCode = styled.span<{ $now?: boolean }>`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1;
  color: ${(p) => (p.$now ? INK_MUTED : INK_FAINT)};
`

/* 单行钮群：模式 | 上一曲/播放/下一曲 | 音量（playbar 同构） */
export const ControlRow = styled.div`
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
export const SkipButton = styled.button`
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
export const PlayButton = styled(SkipButton)`
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
export const ModeButton = styled.button`
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
export const VolWrap = styled.span`
  position: relative;
  display: inline-flex;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const VolumeButton = styled(SkipButton)``

export const VolumePop = styled.div`
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

export const VolumePopLabel = styled.span`
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: ${INK_FAINT};
`

export const VolumePct = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

/* 竖向樂印滑杆：共享 Progress 只支持横向，竖向变体在组件内实现同一视觉语言
   （印光标 = 白文方印「樂」，填充自底向上）；role=slider + 键盘 + 指针拖拽 */
export const VSlider = styled.div`
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

export const VFill = styled.div<{ $fill: number }>`
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

export const VThumb = styled.div<{ $fill: number }>`
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

