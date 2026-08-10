# 设计文档

> 原始变更名：`20250606_P_web_fonts`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计文档

## 目标

解决 Mac/Windows 跨系统字体渲染不一致问题，中英文全换 web font。

## 字体选择

| 字体 | 用途 | 方式 | 时机 |
|---|---|---|---|
| Inter (variable) | 全局 UI/正文 sans-serif | `next/font/google` 自托管 | 构建时内联，首屏可用 |
| Noto Serif SC | 博客正文/标题 serif | JS 动态注入 Google Fonts CSS | `window.load` 后才加载 |
| JetBrains Mono | 代码块 | `next/font/google` 自托管 | 构建时内联，首屏可用 |

## CSS 变量

```css
--font-sans:   <Inter-variable>, ui-sans-serif, system-ui, -apple-system, ...;
--font-mono:   <JetBrainsMono-variable>, ui-monospace, SFMono-Regular, ...;
--font-serif:  'Noto Serif SC', Georgia, 'Songti SC', 'STSong', serif;
```

Noto Serif SC 加载前回退到 Georgia/Songti SC，加载后浏览器自动切换。

## 加载策略

- Inter + JetBrains Mono：`next/font/google` 构建时下载，CSS 内联到首屏 HTML，零额外请求，立即可用
- Noto Serif SC：通过 `<script>` 在 `window.load` 事件后动态创建 `<link>` 加载 Google Fonts CDN

## 改动文件

- `app/layout.tsx` — `next/font/google` 加载 Inter + JetBrains Mono，挂载 CSS 变量，注入延迟加载脚本
- `packages/components/themes/cssVariableProvider.tsx` — 更新三个字体 CSS 变量
- 全站替换 `var(--font-geist-sans)` → `var(--font-sans)`

## 任务
### Phase 1：历史任务
- [ ] **Step 1: 添加 next/font/google import 和实例**
- [ ] **Step 2: 在 body 上加 CSS variable class**
- [ ] **Step 3: 删除旧的 CSS variable 引用**
- [ ] **Step 4: Build 验证**
- [ ] **Step 1: 更新 cssVariableProvider.tsx**
- [ ] **Step 2: 全站替换 `var(--font-geist-sans)` → `var(--font-sans)`**
- [ ] **Step 3: Build 验证**

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `design.md`
# 设计文档

## 目标

解决 Mac/Windows 跨系统字体渲染不一致问题，中英文全换 web font。

## 字体选择

| 字体 | 用途 | 方式 | 时机 |
|---|---|---|---|
| Inter (variable) | 全局 UI/正文 sans-serif | `next/font/google` 自托管 | 构建时内联，首屏可用 |
| Noto Serif SC | 博客正文/标题 serif | JS 动态注入 Google Fonts CSS | `window.load` 后才加载 |
| JetBrains Mono | 代码块 | `next/font/google` 自托管 | 构建时内联，首屏可用 |

## CSS 变量

```css
--font-sans:   <Inter-variable>, ui-sans-serif, system-ui, -apple-system, ...;
--font-mono:   <JetBrainsMono-variable>, ui-monospace, SFMono-Regular, ...;
--font-serif:  'Noto Serif SC', Georgia, 'Songti SC', 'STSong', serif;
```

Noto Serif SC 加载前回退到 Georgia/Songti SC，加载后浏览器自动切换。

## 加载策略

- Inter + JetBrains Mono：`next/font/google` 构建时下载，CSS 内联到首屏 HTML，零额外请求，立即可用
- Noto Serif SC：通过 `<script>` 在 `window.load` 事件后动态创建 `<link>` 加载 Google Fonts CDN

## 改动文件

- `app/layout.tsx` — `next/font/google` 加载 Inter + JetBrains Mono，挂载 CSS 变量，注入延迟加载脚本
- `packages/components/themes/cssVariableProvider.tsx` — 更新三个字体 CSS 变量
- 全站替换 `var(--font-geist-sans)` → `var(--font-sans)`

### `tasks.md`
# Web Fonts 跨平台字体一致性 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 用 web font 替换系统字体栈，解决 Mac/Windows 跨系统字体渲染不一致

**Architecture:** `next/font/google` 自托管 Inter + JetBrains Mono（首屏可用），Noto Serif SC 通过 JS 在 `window.load` 后动态注入（不阻塞首屏）

**Tech Stack:** Next.js 15 App Router, `next/font/google`, styled-components v6.4

---

### Task 1: 加载 Inter + JetBrains Mono 并挂载 CSS 变量

**Files:**
- Modify: `packages/wuh.site.next/app/layout.tsx`

- [ ] **Step 1: 添加 next/font/google import 和实例**

在 `import dynamic from 'next/dynamic'` 之前添加：

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google'
```

在 `const DynamicGlobalAudioPlayer = dynamic(...)` 之前添加：

```tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

- [ ] **Step 2: 在 body 上加 CSS variable class**

```diff
-          <body>
+          <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
```

- [ ] **Step 3: 删除旧的 CSS variable 引用**

`next/font` 自动创建 `--font-sans` 和 `--font-mono` CSS 变量，不需要在 cssVariableProvider 中定义。但为保证 fallback 栈完整，保留 cssVariableProvider 中的定义作为 fallback。

- [ ] **Step 4: Build 验证**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm build:next
```

Expected: Build 成功，Inter 和 JetBrains Mono 被内联到 HTML

---

### Task 2: 延迟加载 Noto Serif SC

**Files:**
- Modify: `packages/wuh.site.next/app/layout.tsx`

在 `<body>` 结束标签前（`</body>` 之前）添加：

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.addEventListener('load', function() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap';
        document.head.appendChild(link);
      });
    `,
  }}
/>
```

---

### Task 3: 更新 CSS 变量 + 全站替换引用

**Files:**
- Modify: `packages/components/themes/cssVariableProvider.tsx`
- Modify: `packages/wuh.site.next/app/HomeView.tsx`
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx`
- Modify: `packages/wuh.site.next/app/blog/loading.tsx`
- Modify: `packages/wuh.site.next/app/components/ErrorPage.tsx`
- Modify: `packages/wuh.site.next/app/about/styles.ts`
- Modify: `packages/components/audio-player/MiniPlayer.tsx`
- Modify: `packages/components/audio-player/PlayerPanel.tsx`

- [ ] **Step 1: 更新 cssVariableProvider.tsx**

改动 `packages/components/themes/cssVariableProvider.tsx`，将三行 CSS 变量替换为：

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  --font-serif: 'Noto Serif SC', Georgia, 'Songti SC', 'STSong', serif;
}
```

（`--font-sans` 和 `--font-mono` 作为 fallback，当 `next/font` 的 CSS 变量因为某些原因未定义时使用；`--font-serif` 中 Noto Serif SC 排首位）

- [ ] **Step 2: 全站替换 `var(--font-geist-sans)` → `var(--font-sans)`**

逐个文件替换：

| 文件 | 替换 |
|---|---|
| `app/HomeView.tsx:46` | `var(--font-geist-sans)` → `var(--font-sans)` |
| `app/blog/BlogListView.tsx:43` | `var(--font-geist-sans)` → `var(--font-sans)` |
| `app/blog/loading.tsx:11` | `var(--font-geist-sans)` → `var(--font-sans)` |
| `app/components/ErrorPage.tsx:21` | `var(--font-geist-sans)` → `var(--font-sans)` |
| `app/about/styles.ts:13` | `var(--font-geist-sans)` → `var(--font-sans)` |
| `packages/components/audio-player/MiniPlayer.tsx:18` | `var(--font-geist-sans, 'Geist', system-ui)` → `var(--font-sans)` |
| `packages/components/audio-player/PlayerPanel.tsx:49` | `var(--font-geist-sans, 'Geist', system-ui)` → `var(--font-sans)` |

注意：MiniPlayer 和 PlayerPanel 中 `, 'Geist', system-ui` 的 fallback 也一并移除，由 CSS 变量统一管理。

- [ ] **Step 3: Build 验证**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm build:next
```

Expected: Build 成功，无 TS 错误
