# Image 组件重写

## 背景

`@wuh.site/components/image` 组件存在三个核心问题：

| 问题 | 根因 |
|------|------|
| 缩略图尺寸过小 | `Frame` 无明确宽度，`StyledNextImage` 的 `width: auto` 导致尺寸塌缩 |
| 图片不可见（opacity 永远 0） | 依赖 Next.js `onLoadingComplete` 回调，缓存/hydration 时不触发 |
| 懒加载失效 | 仅用浏览器原生 `loading="lazy"`，无 IntersectionObserver 控制加载时机 |

## 目标

- 用 IntersectionObserver + 原生 `onLoad`/`onError` 替代不可靠的 `onLoadingComplete`
- 精简 DOM 结构：5 层（Figure/Frame/Skeleton/Img/Fallback）→ 2 层（Wrapper/Skeleton+Img+Fallback）
- 保留 `styled(Image)` 二次封装兼容性，所有消费者不改
- 移除项目中未使用的 `caption`、`overlay`、`disableTransition`、`imageClassName`、`imageStyle`

## 影响范围

- `packages/components/image/` — 组件和样式完全重写
- 消费者（BookCover、StyledLogo 等）— 不改，API 向后兼容
