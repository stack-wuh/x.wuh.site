# 骨架屏主题适配 + 渐进过渡

> 解决骨架屏两问题：① 不跟随站点主题（money/plain）切换色彩；② 加载快时骨架屏闪烁即消失，体验割裂。

**目标：** Skeleton 组件通过 CSS 变量跟随所有主题，内容页通过 fade-in 动画实现骨架屏→内容的平滑过渡。

**范围：** Skeleton 组件 + BlogListView + PostView，不动 loading.tsx 结构。

---

## 架构

三层改动，各自独立：

1. **Skeleton 组件** — 色值纯用 `var(--primary-*)` CSS 变量 + shimmer 加 `animation-delay`
2. **BlogListView** — 根容器加 `contentEnter` fade-in 动画
3. **PostView** — 根容器加 `contentEnter` fade-in 动画

CSS 变量体系已将 `--primary-100` ~ `--primary-900` 在 `:root`、`[data-theme='plain']`、`prefers-color-scheme: dark`、`[data-theme='plain']` + dark 四层全部定义好。Skeleton 只需引用变量，自然跟随所有主题。

---

## 改动明细

### 1. `packages/components/skeleton/index.tsx`

**SkeletonRoot styled-component：**

- 移除 `@media (prefers-color-scheme: dark)` 块
- 渐变色改为 `var(--primary-100)` / `var(--primary-300)` / `var(--primary-100)`
- 添加 `animation-delay: 0.15s`（150ms 内数据就绪则不播动画，超过则启动 shimmer）
- `prefers-reduced-motion` 保持不变

```css
/* Before */
background: linear-gradient(90deg, var(--background-200) 0%, var(--normal-300) 50%, var(--background-200) 100%);
@media (prefers-color-scheme: dark) {
  background: linear-gradient(90deg, var(--background-300) 0%, var(--normal-600) 50%, var(--background-300) 100%);
}

/* After */
background: linear-gradient(90deg, var(--primary-100) 0%, var(--primary-300) 50%, var(--primary-100) 100%);
background-size: 400% 100%;
animation: ${(p) => (p.$shimmer ? css`${shimmer} 1.6s ease-in-out infinite` : 'none')};
animation-delay: 0.15s;
```

### 2. `packages/wuh.site.next/app/blog/BlogListView.tsx`

**Root styled-component** 添加进入动画：

```css
const Root = styled.div`
  /* ...existing styles... */
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
```

### 3. `packages/wuh.site.next/app/post/styles/index.ts`

**Container styled-component** 添加进入动画（同上 `contentEnter`）。

---

## 行为矩阵

| 场景 | 骨架屏表现 | 内容表现 |
|---|---|---|
| 数据 < 150ms | 骨架屏渲染但 shimmer 不启动（animation-delay），随即卸载 | fade-in 250ms |
| 数据 150ms ~ 1s | shimmer 启动，用户感知加载中 → 卸载 | fade-in 250ms |
| 数据 > 1s | shimmer 持续循环，自然等待 | fade-in 250ms |
| `prefers-reduced-motion` | shimmer 不播，contentEnter 不播 | 直接显示 |
| 切换到 plain 主题 | Skeleton 色值自动跟随 `--primary-*` | 无影响 |
| 切换到 dark 模式 | Skeleton 色值自动跟随 `--primary-*` | 无影响 |

---

## 不影响

- `loading.tsx` 文件结构和 Suspense 行为
- Image 组件内置骨架屏（独立实现，本次不改）
- 首页（`/`）和其他无 loading.tsx 的页面
- YearGroup 的 `blogRowRise` 动画（与 contentEnter 并存，叠加效果自然）
