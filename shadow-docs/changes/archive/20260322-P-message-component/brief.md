# Message 消息提示组件

> 原始变更名：`20260322_P_message-component`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — Message 组件实现
- [ ] T1: 实现消息容器与队列管理
- [ ] T2: 实现 Message 项组件与样式
- [ ] T3: 实现全局 API 与导出
### Phase 2 — 验证
- [ ] T4: 验证消息功能与暗色模式

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Message组件
change: message-component
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/45
```

### `design.md`
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

### `proposal.md`
# Message 消息提示组件

## 为什么做

当前系统提示使用 window.alert，体验与样式不一致。需要实现 Ant Design 风格 Message 组件，支持多状态、可关闭、可配置位置，提供统一的消息提示体验。

## 做什么

- 实现 Message 组件（Ant Design 风格）
- 支持多状态: success/info/warning/error/loading
- 支持手动关闭（close icon）
- 支持配置位置: top/topLeft/topRight/bottom/bottomLeft/bottomRight
- 支持自动消失（可配置 duration，默认 3 秒）
- 提供全局 API: message.success/info/warning/error/loading + message.config
- 默认 maxCount=5，超出时移除同 placement 最早一条
- 进入/退出动效: fade + slide
- 适配暗色模式

## 影响范围

- `packages/components/message/` — 新增

### `tasks.md`
# 任务拆分

## Phase 1 — Message 组件实现

- [ ] T1: 实现消息容器与队列管理
  - 涉及文件: `packages/components/message/MessageProvider.tsx`, `MessageQueue.ts`
  - 产出: 全局消息管理器

- [ ] T2: 实现 Message 项组件与样式
  - 涉及文件: `packages/components/message/MessageItem.tsx`, styles
  - 产出: 多状态消息项，支持关闭、自动消失

- [ ] T3: 实现全局 API 与导出
  - 涉及文件: `packages/components/message/index.ts`
  - 产出: message.success/info/warning/error/loading 静态方法

## Phase 2 — 验证

- [ ] T4: 验证消息功能与暗色模式
  - 手动验证多状态、不同位置、快速连续触发、duration=0 常驻
  - dark mode、reduced-motion
