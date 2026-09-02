import type { HTMLAttributes } from 'react'

export type DividerVariant = 'hairline' | 'ornament'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** 视觉变体：hairline 发丝线（默认）；ornament 中置朱砂点缀线，children 可替换点缀字符 */
  variant?: DividerVariant
}
