# Card 组件

## 为什么做

需要可复用 Card 组件，风格接近 Material Design（层级阴影、圆角、间距、交互态），兼容项目主题变量。

## 做什么

- 在 `packages/components/card/` 实现 Card 组件
- 基于 styled-components 实现 Material 风格
- 支持 hover/press 动画，适配 prefers-reduced-motion
- 兼容 light/dark 模式

## 影响范围

- `packages/components/card/` — 重构
