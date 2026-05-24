# 实施任务

| # | 任务 | Phase | 依赖 | 涉及文件 |
|---|------|-------|------|----------|
| 1 | 安装 framer-motion | 1 | 无 | `components/package.json` |
| 2 | 提取 types.ts | 1 | 无 | 新建 `types.ts` |
| 3 | 提取 useControllableState | 2 | 2 | 新建 `hooks/useControllableState.ts` |
| 4 | 提取 useMediaQuery | 2 | 2 | 新建 `hooks/useMediaQuery.ts` |
| 5 | 提取 useLockScroll | 2 | 2 | 新建 `hooks/useLockScroll.ts` |
| 6 | 提取 useKeyboard | 2 | 2,5 | 新建 `hooks/useKeyboard.ts` |
| 7 | 提取 useGesture | 2 | 2 | 新建 `hooks/useGesture.ts` |
| 8 | 提取 Toolbar 组件 | 3 | 2 | 新建 `Toolbar.tsx` |
| 9 | 提取 MoreMenu 组件 | 3 | 2 | 新建 `MoreMenu.tsx` |
| 10 | 提取 ThumbnailRail 组件 | 3 | 2 | 新建 `ThumbnailRail.tsx` |
| 11 | 重写主组件 + framer-motion 动画 | 4 | 1-10 | 修改 `index.tsx` |

---

### Task 1: 安装 framer-motion

**文件:**
- Modify: `packages/components/package.json`

在 dependencies 中新增：

```json
"framer-motion": "^11"
```

运行：`pnpm install`

---

### Task 2: 提取 types.ts

**文件:**
- Create: `packages/components/image-preview/types.ts`
- Modify: `packages/components/image-preview/index.tsx` (删除类型定义部分)

将 `index.tsx` 第 49-116 行的类型定义移到 `types.ts`：

```typescript
export type ImagePreviewItem = {
  id?: string | number
  src: string
  thumbnailSrc?: string
  alt?: string
  title?: string
  description?: React.ReactNode
  width?: number
  height?: number
  blurDataURL?: string
  downloadUrl?: string
  meta?: Record<string, unknown>
}

export type ThumbnailRenderProps = {
  item: ImagePreviewItem
  index: number
  active: boolean
}

export type ToolbarRenderProps = {
  close: () => void
  next: () => void
  previous: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  rotate: () => void
  toggleFullscreen: () => void
  download: () => void
  canZoomIn: boolean
  canZoomOut: boolean
  isFullscreen: boolean
  zoom: number
  index: number
  total: number
  item?: ImagePreviewItem
}

export interface ImagePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ImagePreviewItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  currentIndex?: number
  initialIndex?: number
  onIndexChange?: (index: number, item: ImagePreviewItem) => void
  onDownload?: (index: number, item: ImagePreviewItem) => void
  showThumbnails?: boolean
  enableLoop?: boolean
  allowZoom?: boolean
  zoomSteps?: number[]
  allowRotate?: boolean
  allowDownload?: boolean
  allowKeyboard?: boolean
  allowGesture?: boolean
  allowFullscreen?: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  lockScroll?: boolean
  disableAnimation?: boolean
  hint?: React.ReactNode
  renderToolbar?: (props: ToolbarRenderProps) => React.ReactNode
  renderThumbnail?: (props: ThumbnailRenderProps) => React.ReactNode
  renderCaption?: (item: ImagePreviewItem, index: number) => React.ReactNode
}
```

`index.tsx` 中删除对应行，改为 `import type { ... } from './types'`。

---

### Task 3: 提取 useControllableState

**文件:**
- Create: `packages/components/image-preview/hooks/useControllableState.ts`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 122-154 行提取：

```typescript
import * as React from 'react'

export const useControllableState = <T,>(options: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { value, defaultValue, onChange } = options
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue)

  const state = isControlled ? (value as T) : internalValue

  const setState = React.useCallback(
    (next: React.SetStateAction<T>) => {
      if (isControlled) {
        const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value as T) : next
        if (nextValue !== value) {
          onChange?.(nextValue)
        }
      } else {
        setInternalValue((prev) => {
          const resolved = typeof next === 'function' ? (next as (prevValue: T) => T)(prev) : next
          if (resolved !== prev) {
            onChange?.(resolved)
          }
          return resolved
        })
      }
    },
    [isControlled, value, onChange]
  )

  return [state, setState]
}
```

---

### Task 4: 提取 useMediaQuery

**文件:**
- Create: `packages/components/image-preview/hooks/useMediaQuery.ts`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 164-174 行提取。

---

### Task 5: 提取 useLockScroll

**文件:**
- Create: `packages/components/image-preview/hooks/useLockScroll.ts`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 286-303 行提取 lock scroll effect：

```typescript
import * as React from 'react'

export const useLockScroll = (open: boolean, lockScroll: boolean) => {
  React.useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return
    const original = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = original
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open, lockScroll])
}
```

---

### Task 6: 提取 useKeyboard

**文件:**
- Create: `packages/components/image-preview/hooks/useKeyboard.ts`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 305-325 行提取 keyboard handler。需要传入 `handleClose`, `goNext`, `goPrevious` 回调。

---

### Task 7: 提取 useGesture

**文件:**
- Create: `packages/components/image-preview/hooks/useGesture.ts`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 495-643 行提取 `handlePointerDown/Move/Up` + `doubleTapRef` + `pointerState` ref。

返回 `{ handlePointerDown, handlePointerMove, handlePointerUp, stageRef }`。

---

### Task 8: 提取 Toolbar 组件

**文件:**
- Create: `packages/components/image-preview/Toolbar.tsx`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 701-758 行提取桌面和移动端工具栏 JSX。Props 接收 `ToolbarRenderProps` + `isMobile`。

---

### Task 9: 提取 MoreMenu 组件

**文件:**
- Create: `packages/components/image-preview/MoreMenu.tsx`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 851-885 行提取移动端更多菜单。

---

### Task 10: 提取 ThumbnailRail 组件

**文件:**
- Create: `packages/components/image-preview/ThumbnailRail.tsx`
- Modify: `packages/components/image-preview/index.tsx`

从 `index.tsx` 第 681-698 行提取缩略图条。

---

### Task 11: 重写主组件 + framer-motion 动画

**文件:**
- Modify: `packages/components/image-preview/index.tsx`

将所有提取的模块导入，重写主组件。核心改动：

**图片切换动画 — `AnimatePresence` + `motion.img`：**

```tsx
import { motion, AnimatePresence } from 'framer-motion'

const swipeDirection = React.useRef(0) // -1 prev, 1 next

<AnimatePresence mode='wait' custom={swipeDirection.current}>
  <motion.img
    key={currentItem?.src ?? 'empty'}
    src={currentItem?.src}
    alt={currentItem?.alt ?? currentItem?.title ?? '图片预览'}
    draggable={false}
    variants={{
      enter: (dir: number) => ({ opacity: 1, x: 0 }),
      exit: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    }}
    initial={{ opacity: 0, x: swipeDirection.current * 40 }}
    animate='enter'
    exit='exit'
    transition={{ type: 'spring', stiffness: 350, damping: 35 }}
    style={{
      maxWidth: 'min(92vw, 1300px)',
      maxHeight: '78vh',
      objectFit: 'contain',
      scale: zoom,
      rotate: rotation,
      filter: 'drop-shadow(0 25px 40px rgba(2, 6, 23, 0.55))',
      // 桌面端尺寸限制
      ...(isMobile ? {} : { maxWidth: currentItem?.width ?? undefined, maxHeight: currentItem?.height ?? undefined }),
    }}
  />
</AnimatePresence>
```

**在手势操作中记录切换方向：**
- `goNext()` 中设置 `swipeDirection.current = 1`
- `goPrevious()` 中设置 `swipeDirection.current = -1`
- 手势 swipe 结束时同样设置

**缩放/旋转/平移** 保留 `motion.img` 的 `animate` prop 替换原有 CSS transform，手势拖拽时设置 `transition: none`。

主组件最终约 350-400 行。
