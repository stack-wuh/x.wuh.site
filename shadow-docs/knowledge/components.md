---
title: 组件包
domain: components
keywords: [组件库, Image组件, ImagePreview, exports map, 语义角色, 图片角色, Divider, 分割线]
scope:
  - packages/components
  - packages/hooks
status: active
source:
  - changes/archive/2026-07-12-P-component-standardization/brief.md
  - changes/archive/2026-07-25-P-semantic-image-roles/brief.md
  - changes/archive/20260524_P_image_preview_optimize/brief.md
  - changes/20260829-feature-guestbook-letter-style/brief.md
  - changes/20260902-style-post-detail-polish/brief.md
  - changes/20260903-style-post-toc-mobile-polish/brief.md
verified: 2026-09-03
---

# 组件包

## 当前结论

组件包通过 `exports` map 导出，消费者使用 `@wuh.site/components/<name>` 直接映射到子路径，无需桶文件。

Image 组件支持语义角色（`avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr`），每个角色自动应用对应的 Wrapper 圆角、背景、边框、裁切、Skeleton 和 fallback 样式。图片外轮廓由 Wrapper 单点负责，Skeleton 和 fallback 继承相同外轮廓。消费者可通过 `imageClassName` 或 `imageStyle` 对内部图片应用专用样式。未传 `role` 时保持向后兼容，开发环境输出迁移提示，生产环境不输出。

ImagePreview 图片切换有过渡动画（淡入淡出 + 方向滑动），缩放和旋转使用 spring 弹性动画。组件按 types、hooks、Toolbar、MoreMenu、ThumbnailRail 拆分独立文件，主组件不超过 500 行。

ScrollArea 为 shadcn ScrollArea 移植（`@radix-ui/react-scroll-area` 封装），滚动条独立 DOM 渲染、hover 浮现、不虚拟化；`viewportRef` prop 供消费方监听滚动与程序化滚动。MessageCard 组件集（message-card 包）为信笺风留言卡片：MessageCard / MessageAvatar / MessageMeta / MessageName / MessageTime / MessageStatus / MessageContent，只负责视觉（长什么样），布局（怎么摆）由消费方组合。

Divider 组件（`@wuh.site/components/divider`）负责页面结构性分割线，用色分工：variant `hairline`（默认，灰发丝线 `color-mix(in oklab, var(--normal-400) 55%, transparent)`，承载结构性分段）/ `ornament`（中置朱砂点缀线——两侧线由 transparent 渐入 `var(--primary-color)` 45%、右线镜像，点缀字符同 `--primary-color`，children 可替换），渲染为 `role='separator'`；颜色仅语义 token、禁用 `prefers-color-scheme`，暗色随站点 `data-color-scheme` 自动生效。正文章节记号、列表条目分隔线等排版语言不使用 Divider。

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
