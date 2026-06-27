# 设计：Card 组件

## 方案

### 1. 组件 API

```ts
interface CardProps {
  children: React.ReactNode
  variant?: 'elevated' | 'outlined' | 'filled'
  elevation?: 0 | 1 | 2 | 3
  onClick?: () => void
  className?: string
}
```

### 2. 样式

- 圆角: 16-20px
- 阴影: `0 2px 8px rgba(0,0,0,0.08)`（默认），hover 阴影增强
- 背景: CSS 变量 `--background-card`
- hover: `transform: translateY(-4px)` + 阴影加深
- transition: `180ms ease`
- 适配 prefers-reduced-motion（禁用位移，仅阴影变化）

## 依赖

- 零新依赖
