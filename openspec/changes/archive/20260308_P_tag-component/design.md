# 设计：标签组件

## 方案

### 1. 组件 API

```ts
interface TagProps {
  children: React.ReactNode
  color?: string // 标签背景色，来自 GitHub label color
  onClick?: () => void
  className?: string
}
```

### 2. 样式实现

使用 styled-components，CSS 变量主题令牌：

- 胶囊样式：`border-radius: 999px`，`padding: 2px 12px`，字体 `12-13px`
- hover：`transform: scale(1.05)` + 字色与背景色互换
- transition: `180ms ease`
- 适配 `prefers-reduced-motion`

### 3. 颜色处理

- 接收 GitHub label 的 hex color 作为背景色
- 自动计算对比度，确保文字可读
- light/dark 模式自动切换

### 4. 响应式

- 移动端标签不换行，超出滚动
- 最小触摸目标 28px

## 依赖

- 零新依赖，仅使用 styled-components + CSS 变量
