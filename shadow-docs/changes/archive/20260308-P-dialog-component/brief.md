# Dialog 组件

> 原始变更名：`20260308_P_dialog-component`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — Dialog 组件实现
- [ ] T1: 创建 Dialog 组件结构与样式
- [ ] T2: 实现 useDialog hook
- [ ] T3: 更新组件导出与 README
### Phase 2 — 验证
- [ ] T4: 验证 Dialog 功能与无障碍

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Dialog组件
change: dialog-component
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/23
```

### `design.md`
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

### `proposal.md`
# Dialog 组件

## 为什么做

需要统一的弹窗组件，仿 ant-design 风格，支持全屏模式。同时需要 useDialog hook 管理弹窗状态。

## 做什么

- 在 `packages/components` 实现 Dialog 组件
- Dialog 打开时不需要遮罩层，但下层元素不能点击
- 支持全屏模式
- 在 `packages/hooks` 实现 `useDialog` hook
- 样式使用 `packages/components/themes` 现有方案

## 影响范围

- `packages/components/dialog/` — 新增
- `packages/hooks/useDialog/` — 新增

## 不改什么

- 不引入新依赖（禁止引入 antd 等第三方 UI 库）
- 不改变现有页面布局

### `tasks.md`
# 任务拆分

## Phase 1 — Dialog 组件实现

- [ ] T1: 创建 Dialog 组件结构与样式
  - 涉及文件: `packages/components/dialog/index.tsx`, `packages/components/dialog/styles/index.ts`
  - 产出: 支持 open/close/fullScreen 的 Dialog 组件

- [ ] T2: 实现 useDialog hook
  - 涉及文件: `packages/hooks/useDialog/index.ts`
  - 产出: 管理 Dialog 打开/关闭状态的 hook

- [ ] T3: 更新组件导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/dialog/readme.md`

## Phase 2 — 验证

- [ ] T4: 验证 Dialog 功能与无障碍
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证打开/关闭、全屏、ESC 关闭、焦点管理
