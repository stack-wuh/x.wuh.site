import type { HTMLAttributes } from 'react'

export type ProgressSize = 'sm' | 'md'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 进度值 0–100；缺省进入 indeterminate 不确定态（行笔） */
  value?: number
  /** 传入即交互态：原生 range 底座，拖拽/键盘/读屏语义零降级 */
  onChange?: (value: number) => void
  /** 白文方印光标；交互态默认开，显示态默认关 */
  thumb?: boolean
  /** 印面阴文字，默认「樂」；置空落无字阴线框回退 */
  glyph?: string
  /** 播放态呼吸晕：曲在放印即活，暂停止息；由消费方传 playing，组件不含领域知识 */
  breathing?: boolean
  /** 显示态右缘 mono 淡墨百分比标注 */
  showLabel?: boolean
  /** sm = 细线 2px（MiniPlayer 底行）；md = 3px 默认 */
  size?: ProgressSize
  /** 无障碍名（交互态 slider 与显示态 progressbar 共用） */
  label?: string
}
