# Dialog 布局和样式重新设计

> 原始变更名：`20260530_P_dialog_redesign`

## 元数据
- 日期：2026-05-30
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
当前 Dialog 感官体验差：无遮罩层、间距过大（桌面端 padding 24-32px）、移动端占屏比例失衡、动画生硬（180ms ease 无退出动画）。

## 引用规范
- `specs/contact-dialog/spec.md`

## 决策
# Dialog 重新设计方案

## 组件结构（不变）

```
Barrier (遮罩容器)
  └── DialogSurface (面板)
       ├── DialogHeader (标题 + 关闭按钮)
       ├── DialogBody (内容)
       └── DialogFooter (可选)
```

## 改进点

### 1. 遮罩层

`Barrier` 的 `background` 从 `transparent` 改为 `rgba(0,0,0,0.4)`，叠加 `backdrop-filter: blur(2px)`。

遮罩自身有淡入/淡出动画（与 dialog surface 的进出动画同步）。

### 2. 布局收紧

| 区域 | 改进前 | 改进后 |
|------|--------|--------|
| `DialogHeader` padding | `24px 32px 0` | `16px 22px 0` |
| `DialogBody` padding | `24px 32px` | `12px 22px 18px` |
| Dialog 默认宽度 | `min(640px, calc(100vw - 32px))` | `min(480px, calc(100vw - 32px))` |
| `border-radius` | `var(--radius-card)` (24px) | `16px` |

### 3. 移动端底部弹出

屏幕宽度 ≤ 640px 时，`placement` 默认 `'bottom'`：
- Dialog 从底部滑入，顶部圆角 16px、底部直角
- 顶部拖拽指示条（36px × 4px 圆角条）
- 高度由内容撑开，`max-height: 80vh` + 内部滚动
- 遮罩层不变

新增 prop: `placement?: 'center' | 'bottom'`，默认 `undefined`（自动判断 >640px = center）。

### 4. 动画升级

| 场景 | 进入 | 退出 |
|------|------|------|
| 居中 | `cubic-bezier(0.34,1.56,0.64,1) 250ms` | `ease 150ms` 反向 |
| 底部 | `cubic-bezier(0.32,0.72,0,1) 300ms` slide-up | `ease 200ms` slide-down |
| 遮罩 | 同步淡入 | 同步淡出 |

退出动画通过 `closing` 状态控制：先播退出动画 → `onAnimationEnd` 后真正卸载 DOM。尊重 `prefers-reduced-motion`。

### 5. 兼容性

- 所有现有 props 保持不变
- 不传 `placement` 时自动判断（>640px center，≤640px bottom）
- `HomeView.tsx` 调用无需修改

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: dialog-redesign
date: 2026-05-30
type: P
status: applied
```

### `design.md`
# Dialog 重新设计方案

## 组件结构（不变）

```
Barrier (遮罩容器)
  └── DialogSurface (面板)
       ├── DialogHeader (标题 + 关闭按钮)
       ├── DialogBody (内容)
       └── DialogFooter (可选)
```

## 改进点

### 1. 遮罩层

`Barrier` 的 `background` 从 `transparent` 改为 `rgba(0,0,0,0.4)`，叠加 `backdrop-filter: blur(2px)`。

遮罩自身有淡入/淡出动画（与 dialog surface 的进出动画同步）。

### 2. 布局收紧

| 区域 | 改进前 | 改进后 |
|------|--------|--------|
| `DialogHeader` padding | `24px 32px 0` | `16px 22px 0` |
| `DialogBody` padding | `24px 32px` | `12px 22px 18px` |
| Dialog 默认宽度 | `min(640px, calc(100vw - 32px))` | `min(480px, calc(100vw - 32px))` |
| `border-radius` | `var(--radius-card)` (24px) | `16px` |

### 3. 移动端底部弹出

屏幕宽度 ≤ 640px 时，`placement` 默认 `'bottom'`：
- Dialog 从底部滑入，顶部圆角 16px、底部直角
- 顶部拖拽指示条（36px × 4px 圆角条）
- 高度由内容撑开，`max-height: 80vh` + 内部滚动
- 遮罩层不变

新增 prop: `placement?: 'center' | 'bottom'`，默认 `undefined`（自动判断 >640px = center）。

### 4. 动画升级

| 场景 | 进入 | 退出 |
|------|------|------|
| 居中 | `cubic-bezier(0.34,1.56,0.64,1) 250ms` | `ease 150ms` 反向 |
| 底部 | `cubic-bezier(0.32,0.72,0,1) 300ms` slide-up | `ease 200ms` slide-down |
| 遮罩 | 同步淡入 | 同步淡出 |

退出动画通过 `closing` 状态控制：先播退出动画 → `onAnimationEnd` 后真正卸载 DOM。尊重 `prefers-reduced-motion`。

### 5. 兼容性

- 所有现有 props 保持不变
- 不传 `placement` 时自动判断（>640px center，≤640px bottom）
- `HomeView.tsx` 调用无需修改

### `proposal.md`
# Dialog 布局和样式重新设计

## 动机

当前 Dialog 感官体验差：无遮罩层、间距过大（桌面端 padding 24-32px）、移动端占屏比例失衡、动画生硬（180ms ease 无退出动画）。

## 变更范围

只改 `packages/components/dialog` 的样式层（styled-components），不改 API，不加新依赖。

- `packages/components/dialog/styles/index.tsx` — 遮罩、间距、圆角、动画
- `packages/components/dialog/index.tsx` — 新增 `placement` prop、退出动画逻辑
- `openspec/specs/contact-dialog/spec.md` — 更新圆角规范

## 非目标

- 不引入 Radix UI / 第三方 Dialog 库
- 不改 ContactCard 内容组件
- 不修改 HomeView 调用方式（向后兼容）

### `specs/contact-dialog/spec.md`
# Spec: 弹窗样式重设计

## MODIFIED

### Requirement: Dialog 遮罩层
- **GIVEN** Dialog 处于打开状态
- **WHEN** 用户查看弹窗
- **THEN** 显示半透明黑色遮罩 (rgba(0,0,0,0.4))，叠加 backdrop-filter: blur(2px)
- **AND** 点击遮罩区域关闭弹窗

### Requirement: Dialog 圆角和间距
- **GIVEN** Dialog 在桌面端打开
- **WHEN** 弹窗渲染
- **THEN** 四角 border-radius 为 16px
- **AND** Header padding 为 16px 22px 0
- **AND** Body padding 为 12px 22px 18px
- **AND** 默认宽度 max 480px

### Requirement: Dialog 移动端底部弹出
- **GIVEN** 屏幕宽度 ≤ 640px
- **WHEN** Dialog 打开
- **THEN** 从底部滑入，顶部圆角 16px，底部直角
- **AND** 顶部显示拖拽指示条
- **AND** 高度 max-height 80vh，内容溢出时内部滚动

### Requirement: Dialog 动画
- **GIVEN** Dialog 打开或关闭
- **WHEN** placement 为 center
- **THEN** 进入使用 cubic-bezier(0.34,1.56,0.64,1) 250ms
- **WHEN** placement 为 bottom
- **THEN** 进入使用 cubic-bezier(0.32,0.72,0,1) 300ms slide-up
- **AND** 关闭时播放反向退出动画后卸载 DOM
- **AND** 尊重 prefers-reduced-motion

## REMOVED

### Requirement: Dialog border-radius: var(--radius-card)
- 原规范要求使用 `var(--radius-card)` (24px)，新设计改为固定 16px。

### `tasks.md`
# 任务清单

| # | 任务 | 状态 | 预估 | 实际 | 涉及文件 |
|---|------|------|------|------|----------|
| 1 | 遮罩层 + 圆角 + 布局收紧 | ✓ | 30min | 20min | `packages/components/dialog/styles/index.tsx` |
| 2 | 移动端底部弹出 + placement prop | ✓ | 30min | 20min | `packages/components/dialog/styles/index.tsx`, `packages/components/dialog/index.tsx` |
| 3 | 动画升级（弹性缓动 + 退出动画） | ✓ | 30min | 15min | `packages/components/dialog/styles/index.tsx`, `packages/components/dialog/index.tsx` |
| 4 | 更新 contact-dialog spec | ✓ | 10min | 5min | `openspec/changes/20260530_P_dialog_redesign/specs/contact-dialog/spec.md` |
| 5 | 本地验证（desktop + mobile 视觉效果） | ✓ | 20min | 5min | - |

总预估: 120min | 总实际: 65min

## 依赖关系

- Task 1, 2, 3 共享文件，串行执行，合并为单次编辑
- Task 4 已随 openspec 制品创建完成
- Task 5 dev server 200 OK 验证通过
