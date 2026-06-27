# 设计：Message 组件

## 方案

### 1. 组件 API

```ts
// 全局静态方法
message.success(content: string, duration?: number): void
message.info(content: string, duration?: number): void
message.warning(content: string, duration?: number): void
message.error(content: string, duration?: number): void
message.loading(content: string, duration?: number): void

// 配置
message.config(options: {
  maxCount?: number      // 默认 5
  defaultDuration?: number // 默认 3
  placement?: Placement
}): void

type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'
```

### 2. 全局管理器

- React Context + useReducer 管理消息队列
- 在 app layout 中挂载 MessageProvider
- 静态方法通过事件发射器或 ref 实现全局调用

### 3. 样式

- 轻量浮层，圆角，轻阴影
- 不同状态颜色/图标差异
- 进入/退出: fade + slide（180ms ease）
- 暗色模式适配
- 适配 prefers-reduced-motion

## 依赖

- 零新依赖
