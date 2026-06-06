# 骨架屏主题适配 + 渐进过渡 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Skeleton 组件通过 CSS 变量跟随所有主题，内容页通过 fade-in 实现平滑过渡

**Architecture:** 三个独立改动 — Skeleton 色值改 `var(--primary-*)` + shimmer 延迟，BlogListView/PostView 根容器加 `contentEnter` fade-in。CSS 变量级联自动处理主题切换。

**Tech Stack:** React 19, styled-components 6, Next.js 15 App Router

---

## 验证方式

本项目无视觉回归测试框架。三个任务均为纯 CSS 改动，验证方式：

```bash
pnpm dev:next
```

浏览器打开 `http://localhost:3000/blog` 和 `http://localhost:3000/post/1`，观察：
- 刷新页面时骨架屏是否随主题变色
- 内容是否以 fade-in 进入
- 切换到 plain 主题后骨架屏颜色是否跟随

---

### Task 1: Skeleton 组件色值改用 CSS 变量 + shimmer 延迟

**Files:**
- Modify: `packages/components/skeleton/index.tsx:31-45`

- [ ] **Step 1: 修改 SkeletonRoot 样式**

将 `SkeletonRoot` 的 background 和 `@media (prefers-color-scheme: dark)` 块替换为：

```tsx
const SkeletonRoot = styled.div<{
  $width: string
  $height: string
  $radius: string
  $shimmer: boolean
}>`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  border-radius: ${(p) => p.$radius};
  background: linear-gradient(90deg, var(--primary-100) 0%, var(--primary-300) 50%, var(--primary-100) 100%);
  background-size: 400% 100%;
  animation: ${(p) => (p.$shimmer ? css`${shimmer} 1.6s ease-in-out infinite` : 'none')};
  animation-delay: 0.15s;
  opacity: 0.85;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
```

改动点：
- `background` 从 `var(--background-200)`/`var(--normal-300)` 改为 `var(--primary-100)`/`var(--primary-300)`
- 删除整个 `@media (prefers-color-scheme: dark)` 块（共 3 行，行 43-45）
- 添加 `animation-delay: 0.15s`

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit --project packages/components/tsconfig.json 2>&1 | head -20
```

确保无新增类型错误。

- [ ] **Step 3: 提交**

```bash
git add packages/components/skeleton/index.tsx
git commit -m "fix(skeleton): 色值改用 CSS 变量支持主题切换，shimmer 延迟 150ms 避免闪烁"
```

---

### Task 2: BlogListView 根容器添加 fade-in 动画

**Files:**
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx:38-46`

- [ ] **Step 1: 在 Root styled-component 添加 contentEnter 动画**

`Root` 当前内容（行 38-46）：
```tsx
const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
`
```

改为：
```tsx
const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
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

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add packages/wuh.site.next/app/blog/BlogListView.tsx
git commit -m "feat(blog): 博客列表页内容 fade-in 过渡动画"
```

---

### Task 3: PostView Container 添加 fade-in 动画

**Files:**
- Modify: `packages/wuh.site.next/app/post/styles/index.ts:14-19`

- [ ] **Step 1: 在 Container styled-component 添加 contentEnter 动画**

`Container` 当前内容（行 14-19 起）：
```tsx
export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
```

在 `color: var(--text-color);` 之后插入：
```tsx
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
```

完整改动后：
```tsx
export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -20
```

- [ ] **Step 3: 提交**

```bash
git add packages/wuh.site.next/app/post/styles/index.ts
git commit -m "feat(post): 文章详情页内容 fade-in 过渡动画"
```
