---
title: 联系弹窗 Dialog 规范
domain: components
keywords: [联系弹窗, Dialog, 遮罩, 移动端底部弹出, 动画, 纸张风, paper变体, 钤印, 3D手势, 指针跟随, 滚动锁定, 响应式]
scope:
  - packages/components/dialog
  - packages/wuh.site.next/app/components/ContactCard.tsx
status: active
source:
  - changes/archive/20260530_P_dialog_redesign/brief.md
  - changes/archive/2026-07-28-B-fix-dialog-header-alignment/brief.md
  - changes/20260916-style-contact-dialog-paper/brief.md
verified: 2026-09-16
---

# 联系弹窗 Dialog 规范

## 当前结论

Dialog 支持 `variant?: 'default' | 'paper'` 变体，默认 default 保持通用样式（16px 圆角、rgba 边框阴影、Header 通用发丝线）零变更；paper 分支 = 纸张语言：发丝线边框 `color-mix(in oklab, var(--normal-300) 45%, transparent)`、阴影 `--elevation-soft`、圆角 `--border-radius-base`（仅 center placement，bottom 几何不受变体影响）、Header 底边换渐隐墨线（两端 transparent、中段 `color-mix(in oklab, var(--primary-color) 45%, var(--normal-300))`，与导航运笔下划线同源）。变体只动视觉层，行为层（遮罩点击关闭、44×44 关闭触达区、≤640px 底部滑入 + 拖拽指示条 + max-height 80vh、scroll lock、Escape、焦点管理）两种变体共享且不可破坏。

联系弹窗（ContactArea）启用 paper、宽度 `min(640px, calc(100vw - 32px))`；标题组合渠道钤印——22px 印框 `color-mix(primary 45%)`、衬线渠道首字（微/Q/T/G/豆/云/D），装饰性 `aria-hidden`，定义在 ContactArea（title 槽须在动态加载的 ContactCard 之前立即可见）。ContactCard：左 200×200 大按钮（`--background-200` 纸面 + 发丝线）内二维码裱白边纸托（8px padding、`--background-100`、`translateZ(28px)` 浮起）、右侧信息区（handle 等宽 `--font-mono`）、hints 墨点 `color-mix(primary 60%)`；断点统一 `BREAKPOINTS.mobile`(640) 与底部滑入同轴；入场三段 write-fade 错峰 0/80/160ms。大按钮 3D 指针手势：`perspective(700px) rotateX/rotateY ±12°` 由 pointermove `ref.current.style.setProperty` 直写 CSS 变量（不经 React state）、140ms ease-out 跟手、`transform-style: preserve-3d`、指针径向高光 `--accent-color` 暖金（光层 `translateZ` 越过裱框罩全纸面）；启用条件 `(hover: hover) and (pointer: fine)`，触屏与 `prefers-reduced-motion` 停用倾斜。

Dialog 遮罩层使用 `rgba(0,0,0,0.4)` 叠加 `backdrop-filter: blur(2px)`。center placement 进入动画 `cubic-bezier(0.34,1.56,0.64,1) 250ms`，bottom placement 进入 `cubic-bezier(0.32,0.72,0,1) 300ms` slide-up，关闭时播放反向退出动画后卸载 DOM。尊重 `prefers-reduced-motion`。

## 执行约束

- 联系弹窗必须复用 Dialog 行为，保持遮罩关闭、44px 关闭触达区和移动端底部滑入；不得复制一套独立弹窗。
- 组件包只拥有「纸的语言」（surface/墨线/留白），站点装饰（钤印、错峰入场、3D 手势）留在消费侧——组件包不引入站点 token 之外的语言。
- 3D 监听所在 `useEffect` 的 deps 必须含 `hasLink`：ActionArea 在二维码/链接模式间切换会重建 DOM 节点（button↔a），deps 缺失会使切渠道后监听器留在旧节点、倾斜失效（审查轮实证缺陷）。
- 指针高光颜色必须用 `--accent-color`：纯白高光在 wine light 奶白纸面（`--background-200`）上零对比不可见（预览评审证伪）。

## 适用边界

尺寸和文案仅适用于联系弹窗，不覆盖其他 Dialog 变体；`variant` 为通用接口，其他消费方可按需选用 paper。

## 验证方式

检查 Dialog 的 variant 透传与 paper 分支令牌（`packages/components/dialog/index.test.mjs` 8 条守卫）、ContactArea 挂载属性（`apps/site/test/contact-dialog-paper.test.mjs` 12 条守卫）、Header 墨线与 ≤640px 样式、3D 监听 deps `[hasLink]` 与 matchMedia 双守卫。

## 关联知识

- [components](./components.md)
- [design system](./design-system.md)
- [animation system](./animation-system.md)
