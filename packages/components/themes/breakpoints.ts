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

/**
 * 阶梯外具名常量：历史组件专用断点值。
 * 不是 RESPONSIVE_LADDER 派生成员（阶梯只由 BREAKPOINTS 三常量 +1 翻转派生）；
 * 数值冻结不得「归槽」——边界移动会改变 ±120px 视口窗口的行为
 * （见 changes/20261014-refactor-responsive-sweep 非目标）。新增须注明消费组件。
 */
export const OFF_LADDER_BREAKPOINTS = {
  /** image-preview 移动端工具栏/布局阈值；CSS 与 JS（useMediaQuery）必须共用本值（双源收敛） */
  previewMobile: 767,
  /** pagination 超窄档（gap/字号/触控尺寸收缩） */
  paginationCompact: 480,
  /** footprint-map 移动端堆叠布局阈值 */
  mapStack: 768,
} as const
