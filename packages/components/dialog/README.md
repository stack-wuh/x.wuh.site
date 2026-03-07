# Dialog 对话框

一个轻量的模态对话框，默认无遮罩但会阻止底层交互，可选全屏模式，风格对齐 antd 亦兼容项目主题变量。

## 使用示例

```tsx
'use client'

import Dialog from '@wuh.site/components/dialog'
import Button from '@wuh.site/components/button'
import { useDialog } from '@/packages/hooks/useDialog'

export default function Demo() {
  const dialog = useDialog()

  return (
    <>
      <Button onClick={dialog.openDialog}>打开 Dialog</Button>
      <Dialog
        {...dialog.bind}
        title="提交确认"
        footer={({ close }) => (
          <>
            <Button variant="text" onClick={close}>
              取消
            </Button>
            <Button onClick={() => {
              // do something
              close()
            }}>
              确认
            </Button>
          </>
        )}
      >
        <p>内容区域可以滚动，默认没有遮罩，但通过 Fixed 层阻止底层点击。</p>
      </Dialog>
    </>
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 是否展示 Dialog |
| `onClose` | `() => void` | `undefined` | 关闭回调 |
| `title` | `ReactNode` | `undefined` | 标题区域内容 |
| `footer` | `ReactNode \| ({ close }) => ReactNode` | `undefined` | 底部操作区。函数时可获得快捷 `close` |
| `closeOnOverlay` | `boolean` | `true` | 点击空白区域是否关闭 |
| `closeOnEsc` | `boolean` | `true` | 是否允许通过 ESC 关闭 |
| `lockScroll` | `boolean` | `true` | 打开时锁定 Body 滚动 |
| `fullScreen` | `boolean` | `false` | 是否进入全屏模式 |
| `width` | `number \| string` | `min(640px, calc(100vw - 32px))` | 自定义宽度（非全屏） |
| `height` | `number \| string` | `auto` | 自定义高度（非全屏） |
| `zIndex` | `number` | `1200` | 层级 |
| `hideCloseButton` | `boolean` | `false` | 是否隐藏右上角关闭按钮 |
| `disableAnimation` | `boolean` | `false` | 是否强制关闭入场动画 |

组件默认使用 `var(--background-100)`、`var(--text-primary)` 等主题变量，兼容浅/深色模式。
