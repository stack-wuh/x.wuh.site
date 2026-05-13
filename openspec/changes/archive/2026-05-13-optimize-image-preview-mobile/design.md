# 设计文档：图片预览组件移动端优化

## 1. 断点策略

- 桌面端：`>= 768px`，保持现有布局不变
- 移动端：`< 768px`，全面重新设计

通过 styled-components 的 `@media (max-width: 767px)` 实现响应式，组件逻辑层通过 `matchMedia` 判断当前屏幕。

## 2. 移动端布局设计

### 2.1 桌面端布局（不变）

```
┌──────────────────────────────────────────┐
│ Header: Title + Subtitle  │  [全部工具栏按钮]  │
├──────────────────────────────────────────┤
│                                          │
│              图片展示区                    │
│                                          │
├──────────────────────────────────────────┤
│ Caption + Counter                        │
│ 缩略图条                                  │
│ 键盘快捷键提示                             │
└──────────────────────────────────────────┘
```

### 2.2 移动端布局（全新）

```
┌──────────────────────────────────────────┐
│ [关闭]             标题             [更多] │  ← 精简顶部栏
│                                          │
│  [<]                              [>]    │  ← 浮动导航箭头
│              图片展示区                    │
│         （支持全部手势操作）                │
│                                          │
├──────────────────────────────────────────┤
│ 1/5                        缩略图条（可选）│  ← 精简底部栏
└──────────────────────────────────────────┘
```

### 2.3 更多菜单（移动端）

点击「更多」按钮弹出底部弹出式菜单（Bottom Sheet），包含：
- 放大 / 缩小
- 旋转
- 下载
- 全屏

关闭方式：点击遮罩、下滑菜单、点选菜单项后自动关闭。

### 2.4 主要尺寸调整

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| PreviewSurface `border-radius` | 20px | 0（全屏沉浸） |
| Backdrop `padding` | `clamp(12px, 3vh, 32px)` | 0 |
| IconButton | 36x36, `border-radius: 10px` | 44x44, `border-radius: 12px`（更大触控区） |
| PreviewImage `max-width` | `min(92vw, 1300px)` | `100vw` |
| PreviewImage `max-height` | `78vh` | `100vh`（撑满屏幕） |
| Header padding | `12px clamp(16px, 2vw, 32px)` | `safe-area-inset-top + 8px 12px` |
| Footer padding | `12px clamp(16px, 2vw, 32px) 16px` | `8px 12px safe-area-inset-bottom` |
| KeyboardLegend | 显示 | 隐藏 |
| 浮动导航箭头 | 不显示 | 显示 |

## 3. 手势系统设计

### 3.1 手势优先级

```
单指触摸
  ├── zoom > 1 → 拖拽平移 (pan)
  └── zoom = 1 → 水平滑动切换（左右）+ 下滑关闭
双指触摸 → 缩放 (pinch zoom)
双击 → 切换缩放（1x ↔ max step）
```

### 3.2 水平滑动切换（已有，增强）

现有实现逻辑保持不变。增强点：
- 滑动时图片跟随手指移动（目前只检测阈值方向，不跟随）
- 松手后：超过 30% 宽度阈值则切换到下一张（带动画回弹），否则回弹

### 3.3 下滑关闭（新增）

触发条件：`zoom === 1` 且单指垂直滑动

```
pointerdown → 记录起始位置
pointermove → 计算 deltaY
  - 图片和背景跟随手指向下移动，透明度线性降低
  - 背景透明度 = 1 - min(deltaY / viewportHeight * 2, 1)
pointerup →
  - deltaY > 100px 或 > 25% 视口高度 → 触发关闭动画
  - 否则 → 弹簧回弹到原位
```

### 3.4 双指缩放（新增）

使用双 Pointer 事件，弃用传统的 touchstart/touchmove/touchend。

```
pointerdown (第2个手指) → 记录两指初始距离
pointermove → 计算当前两指距离
  - scaleFactor = currentDistance / initialDistance
  - 应用连续缩放（非阶梯式，松手后 snap 到最近 step）
  - 同时计算中心偏移，支持缩放时保持焦点位置
pointerup (任一手指) → snap 到最近 zoom step
```

### 3.5 双击缩放（新增）

使用 Pointer Events + 时间戳判断：

```
pointerdown → 记录点击位置和时间
  - 两次点击间距 < 300ms 且 位置偏移 < 30px → 触发双击
  - 当前 zoom = 1 → 缩放到 zoomSteps 第二个值
  - 当前 zoom > 1 → 重置到 1x
```

## 4. iOS 滚动锁定

当前方案 `body.style.overflow = 'hidden'` 在 iOS Safari 上不足。

增强方案：
1. 在 Backdrop 上添加 `touch-action: none`（防止浏览器默认手势）
2. 在 Backdrop 上添加 `overscroll-behavior: contain`（防止滚动链）
3. 保留现有 `overflow: hidden` 设置
4. 关闭时恢复所有设置

## 5. 组件结构变更

### 5.1 新增 styled-components（styles/index.tsx）

- `MobileNavArrow` — 左右浮动导航箭头
- `MoreMenu` / `MoreMenuOverlay` / `MoreMenuItem` — 更多菜单（Bottom Sheet）
- 所有现有组件增加 `@media (max-width: 767px)` 样式

### 5.2 组件逻辑变更（index.tsx）

- 新增 `isMobile` 状态（`matchMedia('(max-width: 767px)')`）
- 新增 `moreMenuOpen` 状态
- 新增 `pinchZoom` 逻辑（双指缩放）
- 新增 `swipeToClose` 逻辑（下滑关闭）
- 新增 `doubleTap` 逻辑（双击缩放）
- 增强现有 `handlePointerMove` 实现图片跟随手指

## 6. 不涉及的部分

- 不修改 `useImagePreview` hook
- 不修改 `usePostImagePreview` hook
- 不修改 `ContactCard.tsx` 调用方式
- 不修改 props 接口（完全向后兼容）
