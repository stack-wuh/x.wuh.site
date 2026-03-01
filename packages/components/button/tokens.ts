/**
 * Material Design 3 风格按钮设计令牌
 * @see https://m3.material.io/components/buttons/specs
 */

export const buttonTokens = {
  /** 圆角 */
  borderRadius: {
    small: '8px',
    medium: '8px',
    large: '12px',
  },
  /** 高度（含 padding） */
  height: {
    small: 32,
    medium: 40,
    large: 48,
  },
  /** 水平内边距 */
  paddingX: {
    small: 12,
    medium: 24,
    large: 24,
  },
  /** 垂直内边距（由 height 与 line-height 推导） */
  paddingY: {
    small: 8,
    medium: 10,
    large: 12,
  },
  /** 字体大小 */
  fontSize: {
    small: 14,
    medium: 14,
    large: 16,
  },
  /** 字重 */
  fontWeight: 500,
  /** 字间距 */
  letterSpacing: 0.1,
  /** 阴影（elevation） */
  elevation: {
    default: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    hover: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.2)',
    active: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  },
  /** 状态层透明度 */
  stateLayerOpacity: {
    hover: 0.08,
    focus: 0.12,
    pressed: 0.12,
  },
  /** 过渡时间 */
  transitionDuration: '200ms',
} as const

export type ButtonVariant = 'filled' | 'outlined' | 'text'
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'
