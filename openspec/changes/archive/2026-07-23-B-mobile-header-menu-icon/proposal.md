---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 移动端 Header 汉堡菜单图标恢复

## 背景

移动端 Header 右侧的汉堡菜单按钮仍保留点击区域和菜单交互，但按钮中的 `IconBars` 图标出现不显示问题。当前按钮通过通用 `Button` 组件进行 styled 包装，图标渲染依赖通用按钮的内部样式，存在尺寸、布局和样式耦合风险。

## 目标

- 确保移动端 Header 右侧汉堡菜单按钮始终显示 `IconBars` 图标。
- 保持现有 44×44 触摸目标、响应式断点、展开/收起行为和无障碍属性不变。
- 为图标补充明确的 SVG 尺寸与不可压缩约束，并增加回归测试。

## 非目标（明确不做）

- 不改变桌面端 Header 导航和主题切换控件。
- 不改变移动菜单面板内的导航项和主题切换逻辑。
- 不新增图标库或修改全局图标组件实现。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 将移动菜单按钮改为独立原生样式并固定 SVG 尺寸。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 增加汉堡菜单图标显示的回归约束。
- `packages/components` — 仅复用现有 `lucide-react` 图标，不修改组件包。
