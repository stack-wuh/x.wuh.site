---
component: Dialog
hooks: [useDialog]
keywords:
  - Dialog
  - dialog
  - 弹窗
  - modal
  - 模态
  - popup
  - confirm
  - 确认
  - alert
  - 提示
  - prompt
  - placement
  - center
  - bottom
  - fullScreen
  - lock scroll
  - ESC close
  - overlay
  - 遮罩
  - close
  - 关闭
  - useDialog
  - 弹窗控制
  - hook
related: [demo-page-layout, demo-toast-message]
---

## 确认弹窗

使用 useDialog 控制 Dialog 打开/关闭状态，传递 bind 对象到 Dialog 组件。

适用于删除确认、操作确认、信息展示等场景。

### 使用方式

```tsx
import Dialog from '@wuh.site/components/dialog'
import { useDialog } from 'packages/hooks/useDialog'
```

### useDialog API

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 当前打开状态 |
| `openDialog` | `() => void` | 打开 |
| `closeDialog` | `() => void` | 关闭 |
| `toggleDialog` | `() => void` | 切换 |
| `bind` | `{ open, onClose }` | 直传到 Dialog 的 props |

### Dialog Props

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 打开状态 |
| `onClose` | `() => void` | 关闭回调 |
| `title` | `ReactNode` | 标题 |
| `footer` | `ReactNode \| (helpers) => ReactNode` | 底部内容，可传函数接收 `{ close }` |
| `closeOnOverlay` | `boolean` | 点击遮罩关闭，默认 true |
| `closeOnEsc` | `boolean` | 按 ESC 关闭，默认 true |
| `placement` | `center \| bottom` | 弹窗位置，移动端自动 bottom |
| `fullScreen` | `boolean` | 全屏模式 |
| `width` | `number \| string` | 宽度，默认 `min(480px, 100vw - 32px)` |
| `hideCloseButton` | `boolean` | 隐藏关闭按钮 |

### 注意事项

- `useDialog().bind` 可以直接作为 Dialog 的 props 展开
- `placement="bottom"` 时底部出现拖拽手柄
- 打开时自动锁定 body 滚动，关闭后恢复

### Dialog subtitle 用法

Dialog 支持 `subtitle` prop，在标题下方渲染副文本：

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="留言板"
  subtitle="声无哀乐"
>
  ...
</Dialog>
```

subtitle 会跟随 DialogHeader 垂直排列，关闭按钮居顶部对齐。
