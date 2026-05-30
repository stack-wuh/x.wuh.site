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
