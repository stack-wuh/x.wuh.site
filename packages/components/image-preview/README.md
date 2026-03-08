# ImagePreview 图片预览组件

`ImagePreview` 提供全屏遮罩、缩略图、缩放/旋转/下载/手势等能力，统一站点内图片浏览体验。组件默认以内联 Portal 的方式渲染到 `document.body`，并提供 `useImagePreview` hook 方便受控使用。

## 快速开始

```tsx
'use client'
import { useMemo } from 'react'
import ImagePreview from '@wuh.site/components/image-preview'
import { useImagePreview } from '@/packages/hooks/useImagePreview'

const Demo = () => {
  const preview = useImagePreview({ defaultOpen: false, loop: true, onIndexChange: (idx) => console.log('preview index', idx) })
  const items = useMemo(() => [
    { id: 1, src: '/images/cover-1.jpg', title: '杭州 · 西湖', description: 'Golden hour at the lake' },
    { id: 2, src: '/images/cover-2.jpg', title: '川西 · 雪山' },
  ], [])

  return (
    <>
      <button onClick={() => preview.openPreview(0)}>打开预览</button>
      <ImagePreview items={items} {...preview.bind} showThumbnails allowDownload />
    </>
  )
}
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `ImagePreviewItem[]` | `[]` | 需要预览的图片数组，至少包含 `src`，可选 `title/description/thumbnailSrc` 等。 |
| `open` | `boolean` | `undefined` | 受控打开态。与 `onOpenChange` 搭配。 |
| `defaultOpen` | `boolean` | `false` | 非受控初始打开态。 |
| `onOpen` | `() => void` | `-` | 打开时触发（仅在 from closed -> open 时调用）。 |
| `onClose` | `() => void` | `-` | 关闭时触发。 |
| `onOpenChange` | `(open: boolean) => void` | `-` | 受控回调。 |
| `currentIndex` | `number` | `undefined` | 受控索引。 |
| `initialIndex` | `number` | `0` | 非受控初始索引。 |
| `onIndexChange` | `(index: number, item: ImagePreviewItem) => void` | `-` | 切换图片时回调。 |
| `showThumbnails` | `boolean` | `true` | 是否显示缩略图轨道。 |
| `enableLoop` | `boolean` | `false` | 到达两端后是否回环。 |
| `allowZoom` | `boolean` | `true` | 是否允许缩放，默认提供 1x/2x/4x 阶梯，可通过 `zoomSteps` 自定义。 |
| `allowRotate` | `boolean` | `true` | 是否允许顺时针旋转。 |
| `allowDownload` | `boolean` | `true` | 显示下载按钮并可自定义 `onDownload` 逻辑。 |
| `allowKeyboard` | `boolean` | `true` | 是否注册键盘快捷键（←/→、空格、Esc）。 |
| `allowGesture` | `boolean` | `true` | 是否启用触摸滑动切换与拖拽。 |
| `allowFullscreen` | `boolean` | `true` | 是否暴露全屏按钮（调用浏览器 Fullscreen API）。 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩关闭。 |
| `closeOnEsc` | `boolean` | `true` | ESC 关闭。 |
| `lockScroll` | `boolean` | `true` | 打开时锁定 `body` 滚动。 |
| `disableAnimation` | `boolean` | `false` | 禁用进入/离开动效，配合 `prefers-reduced-motion`。 |
| `zoomSteps` | `number[]` | `[1,2,4]` | 自定义缩放阶梯，需为正数。 |
| `renderToolbar` | `(helpers: ToolbarRenderProps) => ReactNode` | `-` | 自定义工具栏内容。 |
| `renderThumbnail` | `(props: ThumbnailRenderProps) => ReactNode` | `-` | 自定义缩略图单元。 |
| `renderCaption` | `(item: ImagePreviewItem, index: number) => ReactNode` | `-` | 自定义底部描述。 |
| `hint` | `ReactNode` | `-` | 视窗左上角提示标签。 |
| 其余 | `React.HTMLAttributes<HTMLDivElement>` | `-` | 透传到遮罩层。 |

### ImagePreviewItem

```ts
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
```

## useImagePreview Hook

```ts
import { useImagePreview } from '@/packages/hooks/useImagePreview'

const preview = useImagePreview({ defaultOpen: false, loop: true, itemCount: items.length })

return (
  <>
    <ImageGrid onSelect={(idx) => preview.openPreview(idx)} />
    <ImagePreview items={items} {...preview.bind} />
  </>
)
```

Hook 返回值：

- `open`: 当前打开态
- `index`: 当前索引
- `openPreview(index?)`: 打开并跳转到指定索引
- `closePreview()`: 关闭
- `togglePreview()`: 切换打开态
- `next(total?)` / `previous(total?)`: 根据传入长度或 `itemCount` 在数组内导航
- `setIndex(updater)`: 手动设置索引
- `bind`: 直接传入 `<ImagePreview {...preview.bind} items={items} />`，包含 `open/currentIndex/onClose/onIndexChange`

## 验证

- 默认提供键盘（←/→、空格、Esc）、鼠标滚轮缩放、双击放大/重置。
- 触摸场景下横向滑动 45px 以上触发上一张/下一张；拖拽在缩放后启用。
- `prefers-reduced-motion` 场景下降级为无动画。
- 若 `document` 不存在（SSR 阶段），组件保持 null，待客户端挂载后通过 Portal 渲染。
