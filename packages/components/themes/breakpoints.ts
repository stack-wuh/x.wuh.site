/**
 * 语义化断点常量（px 数值）。
 * CSS media query 不支持 CSS 变量，styled-components 模板字符串中引用：
 * `@media (max-width: ${BREAKPOINTS.mobile}px)`。
 * 新代码必须使用语义常量，不得新引入裸断点数值。
 */
export const BREAKPOINTS = {
  /** 手机端（含超窄屏细分）：max-width 640 */
  mobile: 640,
  /** 超窄屏细分：max-width 520 */
  small: 520,
  /** 桌面双栏网格：min-width 1024 */
  tablet: 1024,
} as const
