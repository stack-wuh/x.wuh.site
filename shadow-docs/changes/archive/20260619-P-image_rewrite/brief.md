# Image 组件重写

> 原始变更名：`20260619_P_image_rewrite`

## 元数据
- 日期：2026-06-19
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
`@wuh.site/components/image` 组件存在三个核心问题：

| 问题 | 根因 |
|------|------|
| 缩略图尺寸过小 | `Frame` 无明确宽度，`StyledNextImage` 的 `width: auto` 导致尺寸塌缩 |
| 图片不可见（opacity 永远 0） | 依赖 Next.js `onLoadingComplete` 回调，缓存/hydration 时不触发 |
| 懒加载失效 | 仅用浏览器原生 `loading="lazy"`，无 IntersectionObserver 控制加载时机 |

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1：历史任务
- [x] **文件:** `packages/components/image/styles/index.tsx`
- [x] 删除 Figure/Frame/Overlay/Caption/StyledNextImage
- [x] 新增 Wrapper（单层容器，`$hasExplicitSize` 时不设 width）
- [x] 新增 ImgWrapper — `styled(NextImage)`，opacity 由 `$status` 控制
- [x] 新增 Skeleton — 绝对定位骨架屏，`$visible` 控制显隐
- [x] 新增 Fallback — 绝对定位错误兜底
- [x] ImageStatus 扩展为 `idle | visible | loaded | error`（4 态）
- [x] ImageVariant 精简为 `cover | contain | fill`
- [x] **类型检查:** `pnpm exec tsc --noEmit --project packages/components/tsconfig.json`
- [x] **文件:** `packages/components/image/index.tsx`
- [x] IntersectionObserver 懒加载（`lazy` + `rootMargin` 控制）
- [x] `prefers-reduced-motion` 检测，跳过懒加载
- [x] 状态机：idle → visible（进视口）→ loaded（onLoad）/ error（onError）
- [x] 用原生 `onLoad` 替代 `onLoadingComplete`
- [x] ratio 模式下自动启用 fill + aspect-ratio
- [x] Wrapper 转发 `ref`（IntersectionObserver 目标）+ `className`（styled 兼容）
- [x] 移除 `caption`、`overlay`、`disableTransition`、`imageClassName`、`imageStyle`
- [x] Props 从 25+ 精简到 ~18
- [x] **类型检查:** `pnpm exec tsc --noEmit --project packages/components/tsconfig.json`
- [x] **文件:** `app/styles/index.ts` — BookCover `styled(Image).attrs({ showSkeleton, appearance: 'plain', variant: 'contain' })` ✓
- [x] **文件:** `app/weread/WereadView.tsx` — BookCover 同上 ✓
- [x] **文件:** `app/components/SiteHeader/index.tsx` — `<Image ... inline showSkeleton={false} priority>` ✓
- [x] **文件:** `packages/components/layout/footer.tsx` — `<Image src='/logo.svg' width={100} ... />` ✓
- [x] import 路径 `@wuh.site/components/image` 不变
- [x] **完整类型检查:** `pnpm exec tsc --noEmit`

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: image-rewrite
date: 2026-06-19
type: P
status: archived
```

### `design.md`
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

### `proposal.md`
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

### `tasks.md`
# 任务清单

## Task 1: 重写 Image 样式文件

- [x] **文件:** `packages/components/image/styles/index.tsx`
- [x] 删除 Figure/Frame/Overlay/Caption/StyledNextImage
- [x] 新增 Wrapper（单层容器，`$hasExplicitSize` 时不设 width）
- [x] 新增 ImgWrapper — `styled(NextImage)`，opacity 由 `$status` 控制
- [x] 新增 Skeleton — 绝对定位骨架屏，`$visible` 控制显隐
- [x] 新增 Fallback — 绝对定位错误兜底
- [x] ImageStatus 扩展为 `idle | visible | loaded | error`（4 态）
- [x] ImageVariant 精简为 `cover | contain | fill`
- [x] **类型检查:** `pnpm exec tsc --noEmit --project packages/components/tsconfig.json`

## Task 2: 重写 Image 组件逻辑

- [x] **文件:** `packages/components/image/index.tsx`
- [x] IntersectionObserver 懒加载（`lazy` + `rootMargin` 控制）
- [x] `prefers-reduced-motion` 检测，跳过懒加载
- [x] 状态机：idle → visible（进视口）→ loaded（onLoad）/ error（onError）
- [x] 用原生 `onLoad` 替代 `onLoadingComplete`
- [x] ratio 模式下自动启用 fill + aspect-ratio
- [x] Wrapper 转发 `ref`（IntersectionObserver 目标）+ `className`（styled 兼容）
- [x] 移除 `caption`、`overlay`、`disableTransition`、`imageClassName`、`imageStyle`
- [x] Props 从 25+ 精简到 ~18
- [x] **类型检查:** `pnpm exec tsc --noEmit --project packages/components/tsconfig.json`

## Task 3: 验证消费者兼容性

- [x] **文件:** `app/styles/index.ts` — BookCover `styled(Image).attrs({ showSkeleton, appearance: 'plain', variant: 'contain' })` ✓
- [x] **文件:** `app/weread/WereadView.tsx` — BookCover 同上 ✓
- [x] **文件:** `app/components/SiteHeader/index.tsx` — `<Image ... inline showSkeleton={false} priority>` ✓
- [x] **文件:** `packages/components/layout/footer.tsx` — `<Image src='/logo.svg' width={100} ... />` ✓
- [x] import 路径 `@wuh.site/components/image` 不变
- [x] **完整类型检查:** `pnpm exec tsc --noEmit`
