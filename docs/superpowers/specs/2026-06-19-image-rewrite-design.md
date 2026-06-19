# Image 组件重写

日期：2026-06-19 | 类型：需求 | 状态：approved

## 目标

重写 `@wuh.site/components/image` 组件，修复三个核心问题，同时保留骨架屏、错误兜底、object-fit 变体和 styled 二次封装能力。

## 问题根因

| 问题 | 根因 |
|------|------|
| 图片过小（缩略图） | `Frame` 无明确宽度，`StyledNextImage` 的 `width: auto` 导致尺寸塌缩 |
| 图片不可见 | 依赖 Next.js `onLoadingComplete` 回调，缓存/hydration 时不触发，`opacity` 永远 0 |
| 懒加载失效 | 仅用浏览器原生 `loading="lazy"`，无 IntersectionObserver 控制 |

## 设计

### 架构简化

```
当前: Figure > Frame > [Skeleton + StyledNextImage + Fallback + Overlay] > Caption
重写: Wrapper > [Skeleton + NextImage + Fallback]
```

- 去掉 `Figure`/`Frame` 包裹层 — 减少 DOM 层级，消除 width 计算复杂度
- 去掉 `Caption`/`Overlay` — 项目中从未被使用
- `Wrapper` 转发 `className` 支持 `styled(Image)` 二次封装

### 懒加载（IntersectionObserver）

- 默认 `lazy: true`，`rootMargin: '200px'`
- 进入视口前：仅渲染骨架占位，不发图片网络请求
- 进入视口后：挂载 NextImage 组件，触发真实加载
- `priority` 或 `prefers-reduced-motion` 时跳过懒加载

### 状态机

| 状态 | 触发条件 | 渲染 |
|------|---------|------|
| `idle` | IntersectionObserver 未触发 | 仅骨架容器 |
| `visible` | 进入视口，图片加载中 | 骨架 + NextImage (opacity:0) |
| `loaded` | `onLoad` 触发 | NextImage (opacity:1) |
| `error` | `onError` 触发 | Fallback UI |

关键：使用原生 `onLoad`/`onError` 替代 `onLoadingComplete`，消除回调丢失问题。

### API

**保留：**
- NextImage 原生: `src`, `width`, `height`, `fill`, `priority`, `sizes`, `loading`, `alt`
- 变体: `variant` — `cover` | `contain` | `fill`
- 比例: `ratio` — 提供时自动启用 fill + aspect-ratio
- 骨架: `showSkeleton`, `skeleton`
- 兜底: `errorFallback`
- 样式: `className`, `appearance` (`default` | `plain`), `borderRadius`, `inline`
- 事件: `onError`, `onStatusChange`

**新增：**
- `lazy` — 启用 IntersectionObserver 懒加载，默认 `true`
- `rootMargin` — observer 提前量，默认 `'200px'`

**移除：**
- `caption`, `overlay` — 项目中未使用
- `onLoadingComplete` — 改用原生 `onLoad`
- `disableTransition` — prefers-reduced-motion 全局处理
- `imageClassName`, `imageStyle` — className 足够

### styled 二次封装兼容

保持当前 `styled(Image).attrs({ ... })` 用法不变：

```tsx
const BookCover = styled(Image).attrs({
  variant: 'contain',
  appearance: 'plain',
})`
  width: 40px;
  height: 54px;
  border-radius: 4px;
`
```

### 不改的文件

- 所有 `Image` 消费者（BookCover 等）的 `*.attrs()` 和 CSS 属性保持不变
- 外部只感知到 `onLoadingComplete` / `caption` / `overlay` 被移除（项目中恰好未使用）

## 与当前组件的对比

| 维度 | 当前 | 重写后 |
|------|------|--------|
| DOM 层级 | 5 层（Figure/Frame/Skeleton+Img+Fallback） | 2 层（Wrapper/Skeleton+Img+Fallback） |
| 懒加载 | 浏览器原生 `loading="lazy"` | IntersectionObserver |
| 加载感知 | `onLoadingComplete`（不可靠） | 原生 `onLoad`（可靠） |
| 状态机 | loading/loaded/error（3 态） | idle/visible/loaded/error（4 态） |
| Props 数量 | 25+ | ~18 |
