# 设计文档

## 架构对比

```
当前: Figure > Frame > [Skeleton + StyledNextImage + Fallback + Overlay] > Caption
重写: Wrapper > [Skeleton + NextImage + Fallback]
```

## DOM 结构

- `Wrapper`（div）— 外层容器，转发 `className` 支持 `styled(Image)` 二次封装，透传 `ref` 给 IntersectionObserver
  - `Skeleton` — 骨架屏，绝对定位覆盖
  - `ImgWrapper`（NextImage）— 图片本体，条件渲染（仅在进入视口后挂载）
  - `Fallback` — 错误兜底，绝对定位覆盖

## 状态机

| 状态 | 触发条件 | 渲染 |
|------|---------|------|
| `idle` | IntersectionObserver 未触发 | 仅骨架容器 |
| `visible` | 进入视口，图片加载中 | 骨架 + NextImage (opacity:0) |
| `loaded` | 原生 `onLoad` 触发 | NextImage (opacity:1) |
| `error` | 原生 `onError` 触发 | Fallback UI |

关键：使用原生 `onLoad`/`onError` 替代 `onLoadingComplete`，消除回调丢失。

## 懒加载（IntersectionObserver）

- 默认 `lazy: true`，`rootMargin: '200px'`
- 进入视口前：仅渲染骨架占位，不发图片网络请求
- 进入视口后：挂载 NextImage 组件，触发真实加载
- `priority` 或 `prefers-reduced-motion` 时跳过懒加载

## API 变更

### 保留

NextImage 原生 props（`src`, `width`, `height`, `fill`, `priority`, `sizes`, `loading`, `alt`）+ `variant`, `ratio`, `showSkeleton`, `skeleton`, `errorFallback`, `className`, `appearance`, `borderRadius`, `inline`, `onError`, `onStatusChange`

### 新增

- `lazy` — 启用 IntersectionObserver 懒加载，默认 `true`
- `rootMargin` — observer 提前量，默认 `'200px'`

### 移除

- `caption`, `overlay` — 项目中未使用
- `onLoadingComplete` — 改用原生 `onLoad`
- `disableTransition` — prefers-reduced-motion 全局处理
- `imageClassName`, `imageStyle` — className 足够
- `variant` 子选项 `scale-down`, `none` — 项目中未使用

## styled 二次封装兼容

保持 `styled(Image).attrs({ ... })` 用法不变：

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

`Wrapper` 转发 `className`，外层 CSS 属性可直接覆盖内部样式。
