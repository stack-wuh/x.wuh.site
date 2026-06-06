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
