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
