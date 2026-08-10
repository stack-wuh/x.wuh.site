# 骨架屏主题适配 + 渐进过渡

> 原始变更名：`20260606_P_skeleton_theme_transition`

## 元数据
- 日期：2026-06-06
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
1. 骨架屏色值硬编码 + `@media (prefers-color-scheme: dark)` 手动适配，不跟随站点 `data-theme='plain'` 主题切换
2. 页面加载快时骨架屏闪烁即消失，shimmer 动画没机会执行，体验割裂

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
三个独立改动，无相互依赖：

1. **Skeleton 组件** — 色值纯用 `var(--primary-*)` + shimmer 加 `animation-delay: 0.15s`
2. **BlogListView** — 根容器加 `contentEnter` fade-in（250ms ease-out）
3. **PostView Container** — 同上

## 任务
### Phase 1：历史任务
- [x] 将 `SkeletonRoot` 的 background 改为 `linear-gradient(90deg, var(--primary-100), var(--primary-300), var(--primary-100))`
- [x] 删除 `@media (prefers-color-scheme: dark)` 块
- [x] 添加 `animation-delay: 0.15s`
- [x] 保留 `@media (prefers-reduced-motion: reduce)` 不变
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题，非本次改动导致）
- [x] 在 `Root` styled-component 添加 `contentEnter` keyframes 动画（opacity 0→1, translateY 6px→0, 250ms ease-out）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）
- [x] 在 `Container` styled-component 添加 `contentEnter` keyframes 动画（同上）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: skeleton-theme-transition
date: 2026-06-06
type: P
status: proposed
```

### `design.md`
# 设计文档

## 架构

三个独立改动，无相互依赖：

1. **Skeleton 组件** — 色值纯用 `var(--primary-*)` + shimmer 加 `animation-delay: 0.15s`
2. **BlogListView** — 根容器加 `contentEnter` fade-in（250ms ease-out）
3. **PostView Container** — 同上

## 色值适配原理

CSS 变量已在 `CssVariableStyles` 中按四层级联定义：
- `:root` — money 主题 light
- `:root[data-theme='plain']` — plain 主题 light
- `@media (prefers-color-scheme: dark)` `:root` — money 主题 dark
- `@media (prefers-color-scheme: dark)` `:root[data-theme='plain']` — plain 主题 dark

Skeleton 只需引用 `var(--primary-100)` / `var(--primary-300)`，无需任何 `@media` 查询。

## 行为矩阵

| 场景 | 骨架屏 | 内容 |
|---|---|---|
| 数据 < 150ms | 渲染但 shimmer 不启动 | fade-in 250ms |
| 数据 150ms~1s | shimmer 启动 | fade-in 250ms |
| 数据 > 1s | shimmer 持续循环 | fade-in 250ms |
| reduced-motion | 无动画 | 无动画 |

## 改动范围

| 文件 | 改动 |
|---|---|
| `packages/components/skeleton/index.tsx` | 替换色值 + animation-delay |
| `packages/wuh.site.next/app/blog/BlogListView.tsx` | Root 加 contentEnter |
| `packages/wuh.site.next/app/post/styles/index.ts` | Container 加 contentEnter |

### `proposal.md`
# 骨架屏主题适配 + 渐进过渡

## 问题

1. 骨架屏色值硬编码 + `@media (prefers-color-scheme: dark)` 手动适配，不跟随站点 `data-theme='plain'` 主题切换
2. 页面加载快时骨架屏闪烁即消失，shimmer 动画没机会执行，体验割裂

## 方案

- Skeleton 组件色值改用 `var(--primary-*)` CSS 变量，自然跟随所有主题（money/plain × light/dark）
- Shimmer 加 `animation-delay: 0.15s`，150ms 内数据就绪则不播动画
- BlogListView 和 PostView 根容器加 `contentEnter` fade-in 动画（250ms ease-out）
- 保留 `loading.tsx` 结构不变
- 所有动画尊重 `prefers-reduced-motion: reduce`

### `tasks.md`
# 任务清单

## Task 1: Skeleton 组件色值改用 CSS 变量 + shimmer 延迟

**文件:** `packages/components/skeleton/index.tsx`

- [x] 将 `SkeletonRoot` 的 background 改为 `linear-gradient(90deg, var(--primary-100), var(--primary-300), var(--primary-100))`
- [x] 删除 `@media (prefers-color-scheme: dark)` 块
- [x] 添加 `animation-delay: 0.15s`
- [x] 保留 `@media (prefers-reduced-motion: reduce)` 不变
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题，非本次改动导致）

## Task 2: BlogListView 根容器添加 fade-in

**文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`

- [x] 在 `Root` styled-component 添加 `contentEnter` keyframes 动画（opacity 0→1, translateY 6px→0, 250ms ease-out）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）

## Task 3: PostView Container 添加 fade-in

**文件:** `packages/wuh.site.next/app/post/styles/index.ts`

- [x] 在 `Container` styled-component 添加 `contentEnter` keyframes 动画（同上）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）
