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
