'use client'

import * as React from 'react'
import { CSSProperties } from 'react'
import styled, { css, keyframes } from 'styled-components'

/**
 * 错峰入场关键帧：只做「被照亮」（opacity + translateY 12px 缓入），
 * 与站点「微光呼吸」语言同构。keyframes 自持（styled keyframes 生成哈希名，
 * 不与站点 MotionStyles 的 rise-fade 撞名）——本包两端可消费，
 * console 无主题变量，时序一律取与 motion tokens 对齐的字面值，不引用 --motion-*。
 */
const staggerEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export interface IStaggerProps {
  /** 子项错峰步长（ms），第 k 项延迟 (k-1)×step；字面对齐 dur-quick 量级 */
  step?: number
  /** 单项入场时长（ms），默认取站点 motion token dur-reveal 的展开值 */
  duration?: number
  /** nth-child 枚举上限，超出的子项不获得错峰延迟；默认 12，与分栏词汇同基数 */
  count?: number
  /** 渲染目标（styled-components as 透传），用于 <Stagger as={Row}> 组合 */
  as?: React.ElementType
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 外联样式表 */
  style?: CSSProperties
  /** 点击事件 */
  onClick?: () => void
  /** 标题 */
  title?: string
}

/** 仅用于 styled 的 transient props，不会透传到 DOM */
interface IStyledStaggerTransientProps {
  $step: number
  $duration: number
  $count: number
}

const StyledStagger = styled.div<IStyledStaggerTransientProps>`
  & > * {
    animation: ${staggerEnter} ${(props) => props.$duration}ms
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  ${(props) =>
    Array.from({ length: Math.max(0, props.$count - 1) }, (_, i) => css`
      & > :nth-child(${i + 2}) {
        animation-delay: ${(i + 1) * props.$step}ms;
      }
    `)}
  @media (prefers-reduced-motion: reduce) {
    & > * {
      animation: none;
    }
  }
`

const STAGGER_ONLY_KEYS: (keyof IStaggerProps)[] = ['step', 'duration', 'count']

export const Stagger = React.forwardRef<HTMLDivElement, IStaggerProps>((props, ref) => {
  const domProps = { ...props }
  STAGGER_ONLY_KEYS.forEach((key) => delete (domProps as Record<string, unknown>)[key])

  return (
    <StyledStagger
      ref={ref}
      as={props.as}
      $step={props.step ?? 60}
      $duration={props.duration ?? 600}
      $count={props.count ?? 12}
      {...domProps}
    />
  )
})

Stagger.displayName = 'Stagger'

export default Stagger
