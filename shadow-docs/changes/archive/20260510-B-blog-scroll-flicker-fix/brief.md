# 博客详情页滚动闪屏修复

> 原始变更名：`20260510_B_blog-scroll-flicker-fix`

## 元数据
- 日期：2026-05-10
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
滚动时频繁触发 `requestAnimationFrame` 回调导致页面闪屏。原有的 `useScrollProgress` hook 和 `ReadingProgressBar` 组件各自独立监听 scroll 事件，每次滚动都触发 DOM 更新和 React 重渲染。

改用 CSS scroll-driven animation 后，进度条动画由浏览器原生渲染管线驱动，零 JS 开销，不触发重绘/重排。

## 引用规范
- `specs/blog-scroll-flicker-fix/spec.md`

## 决策
# 设计文档

## 架构对比

### 之前

```
PostView.tsx
  ├── useScrollProgress() → scroll + resize 事件 → setState → 重渲染
  ├── ReadingProgressBar → scroll + resize 事件 → 直接 DOM 操作
  └── FloatingActions ← scrollPercent prop → 渐变背景计算
```

### 之后

```
Container::before (纯 CSS)
  ├── position: fixed, top: 0, left: 0, right: 0, height: 3px
  ├── animation-timeline: scroll(root)
  └── @keyframes scroll-progress { from { scaleX(0) } to { scaleX(1) } }
```

## 关键决策

- **零 JS 方案**: CSS `animation-timeline: scroll(root)` 由浏览器渲染引擎原生驱动
- **降级策略**: `@supports not (animation-timeline: scroll())` 时隐藏进度条
- **删除 IntersectionObserver 保留**: `useHeadingObserver` 驱动 TOC 高亮，非滚动事件

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/post/hooks/useScrollProgress.ts` | 删除 | 移除 scroll 事件 hook |
| `app/post/components/ReadingProgressBar.tsx` | 删除 | 移除 JS 驱动进度条组件 |
| `app/post/PostView.tsx` | 修改 | 移除导入和调用 |
| `app/post/components/FloatingActions.tsx` | 修改 | 移除 scrollPercent prop |
| `app/post/styles/index.ts` | 修改 | 添加 CSS 滚动动画进度条, 移除死代码 |

## 任务
### Phase 1 — 移除滚动事件
- [x] T1: 删除 `useScrollProgress.ts`
- [x] T2: 删除 `ReadingProgressBar.tsx`
- [x] T3: 更新 `PostView.tsx` 移除相关导入和调用
- [x] T4: 更新 `FloatingActions.tsx` 移除 scrollPercent prop
### Phase 2 — 纯 CSS 进度条
- [x] T5: Container::before 添加 scroll-driven animation 进度条
- [x] T6: 移除 createLightGradient/createDarkGradient 死代码
### Phase 3 — 验证
- [x] T7: 本地 dev server 手动验证进度条正常、无闪屏

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 博客详情页滚动闪屏修复
change: blog-scroll-flicker-fix
date: 2026-05-10
type: B
status: applied
```

### `design.md`
# 设计文档

## 架构对比

### 之前

```
PostView.tsx
  ├── useScrollProgress() → scroll + resize 事件 → setState → 重渲染
  ├── ReadingProgressBar → scroll + resize 事件 → 直接 DOM 操作
  └── FloatingActions ← scrollPercent prop → 渐变背景计算
```

### 之后

```
Container::before (纯 CSS)
  ├── position: fixed, top: 0, left: 0, right: 0, height: 3px
  ├── animation-timeline: scroll(root)
  └── @keyframes scroll-progress { from { scaleX(0) } to { scaleX(1) } }
```

## 关键决策

- **零 JS 方案**: CSS `animation-timeline: scroll(root)` 由浏览器渲染引擎原生驱动
- **降级策略**: `@supports not (animation-timeline: scroll())` 时隐藏进度条
- **删除 IntersectionObserver 保留**: `useHeadingObserver` 驱动 TOC 高亮，非滚动事件

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/post/hooks/useScrollProgress.ts` | 删除 | 移除 scroll 事件 hook |
| `app/post/components/ReadingProgressBar.tsx` | 删除 | 移除 JS 驱动进度条组件 |
| `app/post/PostView.tsx` | 修改 | 移除导入和调用 |
| `app/post/components/FloatingActions.tsx` | 修改 | 移除 scrollPercent prop |
| `app/post/styles/index.ts` | 修改 | 添加 CSS 滚动动画进度条, 移除死代码 |

### `proposal.md`
# 博客详情页滚动闪屏修复

## What

移除博客详情页所有 scroll 事件监听器，将阅读进度条改为纯 CSS `animation-timeline: scroll()` 驱动。

## Why

滚动时频繁触发 `requestAnimationFrame` 回调导致页面闪屏。原有的 `useScrollProgress` hook 和 `ReadingProgressBar` 组件各自独立监听 scroll 事件，每次滚动都触发 DOM 更新和 React 重渲染。

改用 CSS scroll-driven animation 后，进度条动画由浏览器原生渲染管线驱动，零 JS 开销，不触发重绘/重排。

### `specs/blog-scroll-flicker-fix/spec.md`
# 博客详情页滚动闪屏修复

## R1 — 移除所有 scroll 事件监听

博客详情页不添加任何 `scroll` 或 `resize` 事件监听器。`useScrollProgress` hook 和 `ReadingProgressBar` 组件已删除。

## R2 — 纯 CSS 阅读进度条

阅读进度条通过 `Container::before` 伪元素 + CSS `animation-timeline: scroll(root)` 实现。固定于页面顶部，滚动时从 `scaleX(0)` 平滑过渡到 `scaleX(1)`。

## R3 — 浏览器兼容性

支持 `animation-timeline` 的浏览器（Chrome 115+, Edge 115+, Safari 18.2+）显示进度条。不支持的浏览器自动降级隐藏。

## R4 — 保留现有功能

以下功能不受影响：
- 代码高亮和复制按钮
- 图片预览
- 目录 (TOC) 导航
- 浮动操作按钮（回首页、回页头、点赞）

### `tasks.md`
# 任务拆分

## Phase 1 — 移除滚动事件

- [x] T1: 删除 `useScrollProgress.ts`
- [x] T2: 删除 `ReadingProgressBar.tsx`
- [x] T3: 更新 `PostView.tsx` 移除相关导入和调用
- [x] T4: 更新 `FloatingActions.tsx` 移除 scrollPercent prop

## Phase 2 — 纯 CSS 进度条

- [x] T5: Container::before 添加 scroll-driven animation 进度条
- [x] T6: 移除 createLightGradient/createDarkGradient 死代码

## Phase 3 — 验证

- [x] T7: 本地 dev server 手动验证进度条正常、无闪屏
