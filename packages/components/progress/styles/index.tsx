'use client'

import styled, { css, keyframes } from 'styled-components'

/* 发丝轨道：Divider 同源（normal-400 55%），填充走 scaleX 自左铺墨（运笔笔顺），不触布局属性 */
const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
const softHalo = '0 0 0 4px color-mix(in oklab, var(--primary-color) 24%, transparent)'
const pressedHalo = '0 0 0 6px color-mix(in oklab, var(--primary-color) 32%, transparent)'
const paperShadow = '0 1px 2px color-mix(in oklab, var(--text-color) 18%, transparent)'

/* 不确定态签名：两端渐隐墨迹沿轨道往复行笔（ornament 渐变语言）；空轨半拍后再行笔 */
const inkTravel = keyframes`
  0%     { transform: translateX(-110%); }
  72%    { transform: translateX(400%); }
  72.01% { transform: translateX(-110%); }
  100%   { transform: translateX(-110%); }
`

/* 播放态呼吸晕（站点「微光呼吸」语言；时长自持字面量——共享组件不得引用 motion tokens） */
const breathe = keyframes`
  0%, 100% {
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--primary-color) 14%, transparent),
      ${paperShadow};
  }
  50% {
    box-shadow:
      0 0 0 7px color-mix(in oklab, var(--primary-color) 30%, transparent),
      ${paperShadow};
  }
`

/* 条体：外层不裁切（印光标冒出轨道），内层轨道裁切填充 */
export const SBar = styled.div<{ $size: 'sm' | 'md' }>`
  --wuh-progress-h: ${(p) => (p.$size === 'sm' ? 'var(--progress-height, 2px)' : 'var(--progress-height, 3px)')};
  position: relative;
  flex: 1;
  height: var(--wuh-progress-h);

  /* 悬停/按压经静态类下探到印面（跨组件插值选择器在 SSR 双写 styleSheets 下不可靠，禁用） */
  &:hover .wuh-progress-thumb {
    transform: translate(-50%, -50%) scale(1.12);
    box-shadow: ${softHalo}, ${paperShadow};
  }

  &:active .wuh-progress-thumb {
    transform: translate(-50%, -50%) scale(1.12);
    filter: brightness(0.92);
    box-shadow: ${pressedHalo}, ${paperShadow};
  }

  &:focus-within .wuh-progress-thumb {
    box-shadow: ${softHalo}, ${paperShadow};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover .wuh-progress-thumb,
    &:active .wuh-progress-thumb {
      transform: translate(-50%, -50%);
    }
  }
`

export const STrack = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  overflow: hidden;
  background: ${hairline};
`

export const SFill = styled.div<{ $fill: number }>`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--progress-fill-color, var(--primary-color));
  transform: scaleX(${(p) => p.$fill});
  transform-origin: left center;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const SStroke = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 28%;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    transparent,
    var(--primary-color) 32%,
    var(--primary-color) 68%,
    transparent
  );
  transform: translateX(-110%);
  animation: ${css`${inkTravel} 1.9s cubic-bezier(0.45, 0, 0.25, 1) infinite`};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: translateX(120%);
  }
`

/* 白文方印：实心主色印面 + 纸色阴文字，立在墨迹尽头 = 笔势落款。
   悬停/按压样式由 SBar 静态类下探（见上），此处只持呼吸与自身几何 */
export const SThumb = styled.div<{ $fill: number; $breathing?: boolean }>`
  position: absolute;
  top: 50%;
  left: calc(${(p) => p.$fill} * 100%);
  width: var(--progress-thumb-size, 15px);
  height: var(--progress-thumb-size, 15px);
  transform: translate(-50%, -50%);
  border-radius: 3px;
  background: var(--progress-thumb-color, var(--primary-color));
  box-shadow: ${paperShadow};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(p) => (p.$breathing ? css`${breathe} 2.4s cubic-bezier(0.45, 0, 0.25, 1) infinite` : 'none')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    ${(p) => (p.$breathing ? `box-shadow: 0 0 0 5px color-mix(in oklab, var(--primary-color) 24%, transparent), ${paperShadow};` : '')}
  }
`

export const SGlyph = styled.span`
  font-family: var(--font-serif);
  font-size: var(--progress-thumb-glyph-size, 10px);
  font-weight: 600;
  line-height: 1;
  color: var(--background-100);
  user-select: none;
`

/* 无字回退：印面上的纸色阴线框 */
export const SThumbFrame = styled.span`
  position: absolute;
  inset: 3px;
  border: 1px solid var(--background-100);
  border-radius: 1.5px;
  opacity: 0.85;
`

/* 交互态：原生 range 透明覆盖整条（拖拽/键盘/读屏 slider 语义零降级） */
export const SRange = styled.input`
  position: absolute;
  inset: -8px 0;
  width: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border: none;
  }

  &::-moz-range-track {
    background: transparent;
  }

  /* 触屏目标 ≥44px：细条上命中区纵向居中扩展（GrooveSlider 同要求迁移） */
  @media (pointer: coarse) {
    inset: calc(50% - 22px) 0;
  }
`

export const SRoot = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
`

export const SLabel = styled.span`
  flex-shrink: 0;
  min-width: 34px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`
