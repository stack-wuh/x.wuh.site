# 全站图片语义角色与展示规范优化

## 背景

共享 `@wuh.site/components/image` 当前将统一的默认圆角、背景、边框、Skeleton 和错误态应用于所有图片 Wrapper。不同图片语义依赖页面级 `styled(Image)` 或内部 `style` 局部覆盖，导致 Wrapper 与内部图片的视觉职责混淆。

已确认的可见问题包括：

- 微信读书小尺寸封面受过大的通用圆角影响，实体书封轮廓被过度圆润。
- About 页 GitHub 头像只对内部图片设置圆形，外层 Wrapper 仍保留默认背景和圆角，透明区域或加载状态会露出黑色/深色方底。
- 文章头图、Logo、二维码、缩略图等场景存在双层圆角、透明背景不稳定或内部图片样式通道失效的问题。
- Markdown、评论和足迹正文中的 HTML 图片没有统一遵循共享图片的内容图视觉规则。

本次属于现有图片组件与页面展示的 **chore 优化**：一次性建立基于实际使用场景的图片角色体系，并迁移可安全治理的现有调用点。

## 目标

- 为共享 Image 增加 `avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr` 语义角色。
- 明确 Wrapper 负责圆角、背景、边框、裁切、Skeleton 和 fallback，内部图片负责 object-fit、filter 和 transform。
- 微信读书封面统一使用 2px 小圆角和中性纸张底色。
- 头像统一使用圆形透明 Wrapper，不添加黑色、品牌色或纸张色底板。
- Logo 使用 0 圆角透明外观，并提供稳定的内部图片 class/style 通道。
- 内容图、页面封面、缩略图和二维码分别使用符合语义的视觉规则。
- 一次性迁移现有可安全迁移的 React 图片调用，并规范 HTML 内容图片。
- 保留未传 `role` 的兼容默认行为，在开发环境提示迁移，避免破坏未知消费者。

## 非目标（明确不做）

- 不改变图片源地址、上传流程、GitHub/微信读书数据或后端接口。
- 不将 ImagePreview 主图和内部缩略图强制迁移到共享 Image。
- 不处理地图 SDK 内部瓦片、marker 或媒体资源。
- 不将微信分享独立 popup 文档中的原生二维码图片改为 React/Next Image。
- 不重写 Markdown、评论和足迹 HTML 的渲染架构；仅统一其图片 CSS 视觉规范。
- 不删除现有 `variant`、`appearance`、`borderRadius` 等覆盖属性。

## 影响范围

- `packages/components/image/index.tsx` — 增加语义角色解析、内部图片样式通道和兼容提示。
- `packages/components/image/styles/index.tsx` — 按角色定义 Wrapper、Skeleton、fallback 和内部图片视觉。
- `packages/components/image/readme.md` — 记录角色 API、覆盖优先级、迁移规则和例外。
- `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts` — 首页 Logo 与书封迁移。
- `packages/wuh.site.next/app/weread/WereadView.tsx` — 微信读书封面迁移。
- `packages/wuh.site.next/app/about/AboutView.tsx`、`app/about/styles.ts` — About 头像迁移并移除内部 style 修补。
- `packages/wuh.site.next/app/post/components/`、`app/post/styles/` — 文章作者头像、评论头像、文章头图与内容 HTML 图片规范。
- `packages/wuh.site.next/app/components/ContactCard.tsx` — Logo 与二维码迁移。
- `packages/components/footprint-map/`、`packages/wuh.site.next/app/footprint/` — 足迹缩略图和内容 HTML 图片规范。
- `packages/components/image-preview/` — 仅记录明确例外，不改变专用交互实现。
- 影响包：`@wuh.site/components`、`@wuh.site/next`。
