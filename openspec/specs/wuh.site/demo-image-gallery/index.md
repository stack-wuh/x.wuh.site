---
component: ImagePreview
hooks: [useImagePreview]
keywords:
  - ImagePreview
  - image preview
  - 图片预览
  - gallery
  - 画廊
  - lightbox
  - 灯箱
  - image viewer
  - 图片查看器
  - zoom
  - 缩放
  - rotate
  - 旋转
  - fullscreen
  - 全屏
  - thumbnail
  - 缩略图轨
  - keyboard navigation
  - 键盘导航
  - gesture
  - 手势
  - swipe
  - 滑动
  - useImagePreview
  - multi-image
  - 多图
  - carousel
related: [demo-image-cover]
---

## 图片画廊查看

点击图片触发看图模式，支持缩放/旋转/全屏/手势/键盘导航和缩略图轨。

`useImagePreview` 控制打开/关闭/切换索引，`bind` 传给 `ImagePreview`。

### 使用方式

```tsx
import ImagePreview from '@wuh.site/components/image-preview'
import { useImagePreview } from 'packages/hooks/useImagePreview'
```

### useImagePreview API

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `open` | `boolean` | 打开状态 |
| `index` | `number` | 当前索引 |
| `openPreview(index?)` | `() => void` | 打开并跳转到指定索引 |
| `closePreview` | `() => void` | 关闭 |
| `next(total?)` | `() => void` | 下一张 |
| `previous(total?)` | `() => void` | 上一张 |
| `bind` | `{ open, currentIndex, onClose, onIndexChange }` | 传给 ImagePreview |

### ImagePreview Props

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ src, alt?, title?, width?, height? }[]` | 图片列表 |
| `open` | `boolean` | 打开状态 |
| `currentIndex` | `number` | 当前索引 |
| `onClose` | `() => void` | 关闭回调 |
| `onIndexChange` | `(index) => void` | 索引变化回调 |
| `enableLoop` | `boolean` | 循环导航 |
| `showThumbnails` | `boolean` | 显示缩略图轨 |
| `allowZoom` | `boolean` | 允许缩放 |

### 注意事项

- `useImagePreview().bind` 可以直接展开传给 ImagePreview
- 预览内容通过 portal 渲染到 document.body
- 单张图片时不显示箭头导航
