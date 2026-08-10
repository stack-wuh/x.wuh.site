# 图片预览组件

> 原始变更名：`20260308_P_image-preview`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — ImagePreview 组件实现
- [ ] T1: 搭建组件目录与基础预览
- [ ] T2: 实现缩略图轨道与交互增强
- [ ] T3: 实现 useImagePreview hook
### Phase 2 — 博客详情页接入
- [ ] T4: PostView 接入 ImagePreview
### Phase 3 — 验证
- [ ] T5: 功能与回归验证

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 图片预览组件
change: image-preview
date: 2026-03-08
type: P
status: applied
```

### `design.md`
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

### `proposal.md`
# 图片预览组件

## 为什么做

站点相册、文章、项目页各自使用原生 img 或第三方 Lightbox，体验分散。需要统一图片预览组件，提供缩略图同步、键盘导览、触屏手势与错误兜底。

## 做什么

- 在 `packages/components/image-preview/` 创建 ImagePreview 组件
- 支持列表/单图两种入口，包含缩略图轨道、主预览视窗、全屏模式
- 键盘（← → Esc Enter）、鼠标滚轮/拖拽、触摸滑动导航
- 内置 zoom（1x/2x/4x）、双击/双指放大、图片旋转 90°、下载按钮
- 暴露 `useImagePreview` hook 供页面控制
- 博客详情页接入：点击正文图片打开 ImagePreview，不打开新页签

## 影响范围

- `packages/components/image-preview/` — 新增
- `packages/hooks/useImagePreview/` — 新增
- `packages/wuh.site.next/app/post/PostView.tsx` — 接入预览

## 不改什么

- 不新增第三方预览/手势依赖
- 不改动 Next.js Image loader / CDN 配置

### `tasks.md`
# 任务拆分

## Phase 1 — ImagePreview 组件实现

- [ ] T1: 搭建组件目录与基础预览
  - 涉及文件: `packages/components/image-preview/index.tsx`, types, styles
  - 产出: 受控/非受控预览，键盘+点击导航，overlay 动画

- [ ] T2: 实现缩略图轨道与交互增强
  - 涉及文件: `packages/components/image-preview/ThumbnailRail.tsx`, `Toolbar.tsx`
  - 产出: 缩略图同步、zoom/rotate/drag、全屏、下载

- [ ] T3: 实现 useImagePreview hook
  - 涉及文件: `packages/hooks/useImagePreview/index.ts`

## Phase 2 — 博客详情页接入

- [ ] T4: PostView 接入 ImagePreview
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 点击正文图片打开预览，提取图片列表与索引映射

## Phase 3 — 验证

- [ ] T5: 功能与回归验证
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证: 多图/单图/无图、键盘/触摸/鼠标、light/dark、reduced-motion
