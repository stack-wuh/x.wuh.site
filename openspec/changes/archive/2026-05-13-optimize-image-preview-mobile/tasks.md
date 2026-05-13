# 任务分解

| # | 任务 | 模式 | 依赖 | 涉及文件 |
|---|------|------|------|----------|
| 1 | 移动端响应式样式 — 精简 Header/Footer，Backdrop 全屏，隐藏键盘提示 | 前台 | 无 | `styles/index.tsx` |
| 2 | 新增移动端专属组件 — 浮动导航箭头 + 更多菜单(Bottom Sheet) | 前台 | 无 | `styles/index.tsx` |
| 3 | 增强滚动锁定 — touch-action + overscroll-behavior 修复 iOS Safari 穿透 | 前台 | 1 | `index.tsx`, `styles/index.tsx` |
| 4 | 双指缩放(Pinch Zoom)手势 | 前台 | 无 | `index.tsx` |
| 5 | 下滑关闭(Swipe to Dismiss)手势 | 前台 | 无 | `index.tsx` |
| 6 | 双击缩放(Double Tap)手势 + 滑动时图片跟随手指 | 前台 | 无 | `index.tsx` |
| 7 | 更多菜单交互 — 打开/关闭/选中逻辑 | 前台 | 2 | `index.tsx` |
| 8 | 最终验证 — 桌面端无退化、移动端完整走通 | 前台 | 1-7 | `index.tsx`, `styles/index.tsx` |

## 任务详情

### 1. 移动端响应式样式
- 为 Backdrop, PreviewSurface, Header, Footer, IconButton, PreviewImage, KeyboardLegend 添加 `@media (max-width: 767px)` 样式
- Backdrop: `padding: 0`
- PreviewSurface: `border-radius: 0`
- IconButton: 44x44px，`border-radius: 12px`
- Header: 引入 `safe-area-inset-top`，关闭 Subtitle，只保留 Title
- Footer: 引入 `safe-area-inset-bottom`，隐藏 KeyboardLegend
- PreviewImage: `max-width: 100vw`, `max-height: 100vh`

### 2. 新增移动端专属组件
- `MobileNavArrow` — 绝对定位在图片区域左右两侧的半透明箭头按钮
- `MoreMenuOverlay` — 底部弹出菜单的遮罩
- `MoreMenuContainer` — 底部弹出菜单容器（Bottom Sheet）
- `MoreMenuItem` — 菜单项按钮（带图标+文字）

### 3. 增强滚动锁定
- Backdrop 增加 `touch-action: none`（阻止浏览器默认手势）
- Backdrop 增加 `overscroll-behavior: contain`（阻止滚动链）
- 组件内 overflow hidden 逻辑保持不变

### 4. 双指缩放
- 扩展 `pointerState` ref 支持双指状态（两个 pointerId + 初始距离）
- pointerdown: 检测是否已有活动 pointer，如有则记录第二指并计算初始距离
- pointermove: 双指时计算距离比 → 实时缩放
- pointerup: 手指松开时 snap 到最近的 zoom step
- pointercancel: 同 pointerup

### 5. 下滑关闭
- pointerdown: zoom=1 时记录起始 Y 坐标
- pointermove: 计算 deltaY，超过阈值后跟随手指移动图片 + 降低背景透明度
- pointerup: deltaY > 100px → 触发关闭；否则弹回
- 需要新增 `dismissOffset` 状态控制位移

### 6. 双击缩放 + 滑动跟随
- 双击检测：记录上次点击时间和位置，300ms 内且位移 < 30px → 触发
- 双击时缩放：当前非 1x → 回到 1x；当前 1x → 缩放到 steps[1]
- 滑动跟随：handlePointerMove 中 zoom=1 时，更新图片 translateX 让图片跟手移动

### 7. 更多菜单
- `moreMenuOpen` 状态控制菜单显隐
- 点击更多按钮 → 打开菜单
- 点击遮罩 → 关闭菜单
- 点击菜单项 → 执行操作 + 关闭菜单
- 下滑菜单区域 → 关闭菜单

### 8. 最终验证
- 桌面端浏览器：确认布局、工具栏、手势与优化前一致
- 移动端浏览器 / Chrome DevTools：确认全部功能和手势正常
- TypeScript 类型检查通过
