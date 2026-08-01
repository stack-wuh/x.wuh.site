---
keywords: [组件库, Image组件, ImagePreview, exports map, 语义角色, 图片角色]
---

# 组件包

组件包通过 `exports` map 导出，消费者使用 `@wuh.site/components/<name>` 直接映射到子路径，无需桶文件。

Image 组件支持语义角色（`avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr`），每个角色自动应用对应的 Wrapper 圆角、背景、边框、裁切、Skeleton 和 fallback 样式。图片外轮廓由 Wrapper 单点负责，Skeleton 和 fallback 继承相同外轮廓。消费者可通过 `imageClassName` 或 `imageStyle` 对内部图片应用专用样式。未传 `role` 时保持向后兼容，开发环境输出迁移提示，生产环境不输出。

ImagePreview 图片切换有过渡动画（淡入淡出 + 方向滑动），缩放和旋转使用 spring 弹性动画。组件按 types、hooks、Toolbar、MoreMenu、ThumbnailRail 拆分独立文件，主组件不超过 500 行。
