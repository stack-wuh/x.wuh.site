---
title: 组件包
domain: components
keywords: [组件库, Image组件, ImagePreview, exports map, 语义角色, 图片角色]
scope:
  - packages/components
  - packages/hooks
status: active
source:
  - changes/archive/2026-07-12-P-component-standardization/brief.md
  - changes/archive/2026-07-25-P-semantic-image-roles/brief.md
  - changes/archive/20260524_P_image_preview_optimize/brief.md
verified: 2026-08-08
---

# 组件包

## 当前结论

组件包通过 `exports` map 导出，消费者使用 `@wuh.site/components/<name>` 直接映射到子路径，无需桶文件。

Image 组件支持语义角色（`avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr`），每个角色自动应用对应的 Wrapper 圆角、背景、边框、裁切、Skeleton 和 fallback 样式。图片外轮廓由 Wrapper 单点负责，Skeleton 和 fallback 继承相同外轮廓。消费者可通过 `imageClassName` 或 `imageStyle` 对内部图片应用专用样式。未传 `role` 时保持向后兼容，开发环境输出迁移提示，生产环境不输出。

ImagePreview 图片切换有过渡动画（淡入淡出 + 方向滑动），缩放和旋转使用 spring 弹性动画。组件按 types、hooks、Toolbar、MoreMenu、ThumbnailRail 拆分独立文件，主组件不超过 500 行。

## 执行约束

- 消费者使用 `@wuh.site/components/<name>` 子路径；Image 外轮廓由 Wrapper 单点负责，预览组件保持职责拆分。

## 适用边界

具体业务页面的组合和文案不属于组件包约束。

## 验证方式

检查 `packages/components/package.json` exports、Image role 实现和 ImagePreview 文件边界，并搜索消费者的 `/index` 导入。

## 关联知识

- [icon system](./icon-system.md)
- [pagination](./pagination.md)
- [design system](./design-system.md)
