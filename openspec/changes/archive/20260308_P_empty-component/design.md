# 设计：Empty 组件

## 方案

### 1. 组件 API

```ts
interface EmptyProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}
```

### 2. 样式

- 使用 CSS 变量 token（--space-*、--font-size-*、--text-*）
- 居中布局，插画/icon + 标题 + 描述
- 响应式: 移动端 padding 16px

## 依赖

- 零新依赖
