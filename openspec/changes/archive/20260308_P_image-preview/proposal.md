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
