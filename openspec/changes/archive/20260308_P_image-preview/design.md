# 设计：图片预览组件

## 方案

### 1. 组件 API

```ts
interface ImagePreviewProps {
  items: Array<{ id: string; src: string; alt?: string; width?: number; height?: number }>
  open: boolean
  onClose: () => void
  initialIndex?: number
  showThumbnails?: boolean
  allowDownload?: boolean
  onChange?: (index: number) => void
}
```

### 2. useImagePreview hook

```ts
function useImagePreview(): {
  open: boolean
  currentIndex: number
  onOpen: () => void
  onClose: () => void
  onIndexChange: (index: number) => void
  bind: { open: boolean; currentIndex: number; onClose: () => void; onIndexChange: (index: number) => void }
}
```

### 3. 交互设计

- 键盘导航: ← → 切换、Esc 关闭、Enter 全屏
- 鼠标: 点击切换、滚轮缩放、拖拽平移
- 触摸: 左右滑动切换、双指缩放
- 动画: overlay fade+scale（弹性缓动）、缩略图 150ms 滑动
- 尊重 prefers-reduced-motion

### 4. 博客详情页接入

- `dangerouslySetInnerHTML` 渲染后，通过 DOM 查询提取所有 img
- 绑定 click 事件，打开 ImagePreview，禁止默认新页签行为
- 使用 Dialog 组件包裹 ImagePreview

### 5. SSR 安全

- `'use client'` 指令
- 全屏 API / Pointer API 在 useEffect 中 lazy attach

## 依赖

- 零新依赖，手势使用 Pointer API 自行实现
