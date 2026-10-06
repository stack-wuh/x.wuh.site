import { BREAKPOINTS } from './breakpoints'

/**
 * 断点数组语法（布局组件族统一契约）——四档升序阶梯，移动优先：
 * - 标量值：全视口生效；
 * - `[base]`：等价于标量（显式声明「仅基线」）；
 * - `[base, sm?, md?, lg?]`：索引 0 为超窄基线（0+），后续槽按 RESPONSIVE_LADDER
 *   的 min-width 边界依次升档生效；缺位槽跳过、由更低档声明自然延续。
 *
 * 阶梯边界由 BREAKPOINTS 语义常量 +1 翻转派生：存量负声明断点
 * （max-width 520 / max-width 640）与 tablet 档（min-width 1024）全部收进同一阶梯。
 * 超出四档的槽位在编译期忽略。类型取「数组 = 槽位序列」的宽松形状，
 * 索引 0 缺位在编译口显式兜底（responsive 返回空声明）。
 */
export type TResponsive<T> = T | readonly (T | undefined)[]

/**
 * 四档阶梯的上三档 min-width 边界（px），与数组索引 1/2/3 对应：
 * - sm：`BREAKPOINTS.small + 1`（521，原 ≤520 档转正）
 * - md：`BREAKPOINTS.mobile + 1`（641，原 ≤640 档转正）
 * - lg：`BREAKPOINTS.tablet`（1024，原 tablet 槽语义）
 * 只由语义常量派生，不落新裸断点字面量。
 */
export const RESPONSIVE_LADDER = [BREAKPOINTS.small + 1, BREAKPOINTS.mobile + 1, BREAKPOINTS.tablet] as const

/** 拆响应式值为槽位数组（标量 → 单槽；索引 0 恒有值）。
 *  Array.isArray 不收窄 readonly 数组分支，运行时判定后以 as 落类型——
 *  true 分支 value 必为槽数组、false 分支必为标量，非绕过而是表达运行时事实。 */
export const ladderSlots = <T>(value: TResponsive<T>): readonly (T | undefined)[] =>
  Array.isArray(value) ? (value as readonly (T | undefined)[]) : [value as T]

/**
 * 把响应式值编译为 CSS 文本：基线声明 + 每个非缺位上档一个 min-width 媒体块。
 * media 只经 RESPONSIVE_LADDER（由 BREAKPOINTS 派生），不落裸断点数值。
 * 返回值作为 styled-components 插值注入（纯 CSS 文本，不含嵌套选择器）。
 */
export const responsive = <T>(
  value: TResponsive<T> | undefined,
  decl: (value: T) => string,
): string => {
  if (value === undefined) return ''
  const slots = ladderSlots(value)
  const base = slots[0]
  if (base === undefined) return ''
  let css = decl(base)
  for (let tier = 0; tier < RESPONSIVE_LADDER.length; tier += 1) {
    const upper = slots[tier + 1]
    if (upper === undefined) continue
    css += `
@media (min-width: ${RESPONSIVE_LADDER[tier]}px) {
  ${decl(upper)}
}`
  }
  return css
}
