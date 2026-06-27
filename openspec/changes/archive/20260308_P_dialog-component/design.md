# 设计：Dialog 组件

## 方案

### 1. Dialog 组件 API

```ts
interface DialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  fullScreen?: boolean
  footer?: React.ReactNode
  width?: number | string
}
```

### 2. useDialog hook

```ts
function useDialog(defaultOpen?: boolean): {
  open: boolean
  onOpen: () => void
  onClose: () => void
  bind: { open: boolean; onClose: () => void }
}
```

### 3. 样式

- 使用 styled-components + CSS 变量
- 无遮罩层（mask: none），但通过 pointer-events 阻止下层交互
- 动画：进入 fade + scale（弹性缓动），退出反向
- 支持 prefers-reduced-motion

### 4. 全屏模式

- `fullScreen` prop 控制，占满整个视口
- 移动端默认全屏

## 依赖

- 零新依赖
