# Skeleton 骨架屏组件

> 原始变更名：`20260322_P_skeleton-component`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：Skeleton 组件

## 方案

### 1. 组件 API

```ts
interface SkeletonProps {
  variant?: 'text' | 'title' | 'image' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  animated?: boolean // 默认 true
}
```

### 2. 样式

- 灰阶背景: CSS 变量 `--skeleton-base` / `--skeleton-shimmer`
- Shimmer 动画: `@keyframes shimmer`，`background: linear-gradient(90deg, ...)`
- prefers-reduced-motion: 禁用 shimmer，显示静态占位

### 3. 页面 loading 场景

- 博客列表: 3 列卡片骨架（桌面）/ 1 列（移动端）
- 博客详情: 标题 + 段落条 + 图片块骨架

## 依赖

- 零新依赖

## 任务
### Phase 1 — Skeleton 组件实现
- [ ] T1: 实现 Skeleton 组件与 shimmer 动画
- [ ] T2: 更新导出与 README
### Phase 2 — 页面接入
- [ ] T3: 博客详情页 loading 接入
- [ ] T4: 博客列表页 loading 接入
### Phase 3 — 验证
- [ ] T5: 验证骨架屏展示与动效

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Skeleton组件
change: skeleton-component
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/37
```

### `design.md`
# 设计：Skeleton 组件

## 方案

### 1. 组件 API

```ts
interface SkeletonProps {
  variant?: 'text' | 'title' | 'image' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  animated?: boolean // 默认 true
}
```

### 2. 样式

- 灰阶背景: CSS 变量 `--skeleton-base` / `--skeleton-shimmer`
- Shimmer 动画: `@keyframes shimmer`，`background: linear-gradient(90deg, ...)`
- prefers-reduced-motion: 禁用 shimmer，显示静态占位

### 3. 页面 loading 场景

- 博客列表: 3 列卡片骨架（桌面）/ 1 列（移动端）
- 博客详情: 标题 + 段落条 + 图片块骨架

## 依赖

- 零新依赖

### `proposal.md`
# Skeleton 骨架屏组件

## 为什么做

页面切换的 Loading 过渡页过于简单。需要新增骨架屏公共组件，在数据加载时提供与内容结构一致的占位视觉，提升感知性能。

## 做什么

- 新增可复用 Skeleton 骨架屏组件
- GitHub 风格灰阶骨架：标题条 + 段落条 + 图文块
- 轻微 shimmer 动效
- 接入博客详情页和博客列表页 loading.tsx
- 遵循 prefers-reduced-motion（无动画）

## 影响范围

- `packages/components/skeleton/` — 新增
- `packages/wuh.site.next/app/post/[number]/loading.tsx` — 接入
- `packages/wuh.site.next/app/blog/loading.tsx` — 接入

### `tasks.md`
# 任务拆分

## Phase 1 — Skeleton 组件实现

- [ ] T1: 实现 Skeleton 组件与 shimmer 动画
  - 涉及文件: `packages/components/skeleton/index.tsx`, styles
  - 产出: GitHub 风格灰阶骨架屏

- [ ] T2: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, readme.md

## Phase 2 — 页面接入

- [ ] T3: 博客详情页 loading 接入
  - 涉及文件: `packages/wuh.site.next/app/post/[number]/loading.tsx`

- [ ] T4: 博客列表页 loading 接入
  - 涉及文件: `packages/wuh.site.next/app/blog/loading.tsx`

## Phase 3 — 验证

- [ ] T5: 验证骨架屏展示与动效
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证页面切换骨架、shimmer 动画、reduced-motion、dark 模式对比度
