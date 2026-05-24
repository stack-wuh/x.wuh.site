# 技术方案

## 动画方案: framer-motion

### 图片切换
- 用 `AnimatePresence` + `motion.img` 包裹 PreviewImage
- 切换时旧图 `opacity: 0, x: direction * 30` → 新图 `opacity: 1, x: 0`
- direction 由切换方向决定（next +30, prev -30）

### 缩放
- `motion.img` 的 `animate={{ scale: zoom }}` 替换 CSS transform scale
- `transition={{ type: 'spring', stiffness: 300, damping: 30 }}`

### 旋转
- `animate={{ rotate: rotation }}`

### 关闭/打开
- `AnimatePresence` 包裹整个 Portal
- 关闭时 `opacity: 0, scale: 0.95`
- 保留原有的 `Backdrop` 和 `PreviewSurface` 动画

### 手势（保留原生实现）
- pinch/pan/swipe 手势逻辑保留 Pointer Events 实现
- 仅在手势释放后由 framer-motion 接管动画过渡

## 拆分方案

```
image-preview/
├── index.tsx              ← 主组件 (~400行)
├── types.ts               ← ImagePreviewItem, ImagePreviewProps, ToolbarRenderProps 等
├── hooks/
│   ├── useControllableState.ts
│   ├── useMediaQuery.ts
│   ├── useLockScroll.ts
│   ├── useKeyboard.ts
│   └── useGesture.ts      ← handlePointerDown/Move/Up + double-tap
├── Toolbar.tsx            ← 桌面工具栏 + 移动端工具栏
├── MoreMenu.tsx           ← 移动端更多操作菜单
├── ThumbnailRail.tsx      ← 缩略图列表
└── styles/
    └── index.tsx          ← 不变
```

## 依赖

- `framer-motion`: 新增到 `packages/components/package.json`
