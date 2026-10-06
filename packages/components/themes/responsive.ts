import { BREAKPOINTS } from './breakpoints'

/**
 * 断点数组语法（布局组件族统一契约）：
 * - 标量值：全视口生效；
 * - `[base]`：等价于标量（显式声明「仅基线」）；
 * - `[base, tablet]`：索引 0 为 < BREAKPOINTS.tablet 的基线，索引 1 在
 *   `min-width: BREAKPOINTS.tablet`（≥1024，桌面带）生效；省略索引 1 表示基线延续。
 *
 * 只开两槽：超窄 small 档由 clamp 间距 token 与基线堆叠承担，布局 props 不开第三槽。
 */
export type TResponsive<T> = T | readonly [T] | readonly [T, T]

/** 值是否存在 tablet 槽（用于组合多 prop 到同一条声明时决定是否生成 media 块） */
export const hasTabletSlot = <T>(value: TResponsive<T>): boolean =>
  Array.isArray(value) && value[1] !== undefined

/** 拆出 base / tablet 两槽；tablet 缺位时返回 undefined，由消费方决定回退 */
export const responsiveSlots = <T>(value: TResponsive<T>): { base: T; tablet?: T } =>
  Array.isArray(value) ? { base: value[0], tablet: value[1] } : { base: value }

/**
 * 把响应式值编译为 CSS 文本：基线声明 +（存在 tablet 槽时）tablet 媒体块。
 * media 只经 BREAKPOINTS 语义常量，不落裸断点数值。
 * 返回值作为 styled-components 插值注入（纯 CSS 文本，不含嵌套选择器）。
 */
export const responsive = <T>(
  value: TResponsive<T> | undefined,
  decl: (value: T) => string,
): string => {
  if (value === undefined) return ''
  const { base, tablet } = responsiveSlots(value)
  const baseLine = decl(base)
  if (tablet === undefined) return baseLine
  return `${baseLine}
@media (min-width: ${BREAKPOINTS.tablet}px) {
  ${decl(tablet)}
}`
}
