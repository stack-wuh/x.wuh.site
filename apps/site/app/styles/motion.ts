import { createGlobalStyle } from 'styled-components'

/**
 * 全站动画规范（微光呼吸 × 书写显现）：
 * - 关键帧与 Reveal 滚动渐入模式为全站唯一动画来源，业务组件引用时不重定义
 * - 滚动渐入走纯 CSS scroll-driven（animation-timeline: view()），不支持则直显
 * - 页面切换仅覆盖同源硬导航（@view-transition），Next 软导航保持瞬时
 */
export const MotionStyles = createGlobalStyle`
  /* 区块渐入：被晨光照亮 */
  @keyframes rise-fade {
    from {
      opacity: 0;
      translate: 0 12px;
    }
    to {
      opacity: 1;
      translate: 0;
    }
  }

  /* 书写显现：落笔 */
  @keyframes write-fade {
    from {
      opacity: 0;
      translate: 0 4px;
    }
    to {
      opacity: 1;
      translate: 0;
    }
  }

  /* Reveal 滚动渐入模式：视口内元素已过起始范围时不重放。
     适用行/卡片级元素；高度接近视口的区块勿用（entry 百分比按元素自身高度计，会拉长动画） */
  @supports (animation-timeline: view()) {
    .reveal {
      animation: rise-fade var(--motion-dur-reveal) var(--motion-ease-out-soft) both;
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
    }
  }

  /* 页面切换：同源硬导航交叉淡入淡出（零 JS） */
  @view-transition {
    navigation: auto;
  }
  ::view-transition-old(root) {
    animation: var(--motion-dur-reveal) var(--motion-ease-in-out-soft) both vt-fade-out;
  }
  ::view-transition-new(root) {
    animation: var(--motion-dur-reveal) var(--motion-ease-in-out-soft) both vt-fade-in-rise;
  }
  @keyframes vt-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes vt-fade-in-rise {
    from {
      opacity: 0;
      translate: 0 8px;
    }
    to {
      opacity: 1;
      translate: 0;
    }
  }

  /* 打印时滚动渐入无时间线进度，必须显式可见 */
  @media print {
    .reveal {
      animation: none !important;
    }
  }

  /* 动效降级：reduced-motion 全站关闭动画 */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
    }
    ::view-transition-old(*), ::view-transition-new(*) {
      animation: none !important;
    }
  }
`
