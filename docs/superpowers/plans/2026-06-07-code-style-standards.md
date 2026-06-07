# Code Style Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce code style standards — split 4 files >300 lines, add JSDoc to exports, extract all styled-components to standalone styles/index.ts files.

**Architecture:** Each task extracts styled-components from a component file into a co-located `styles/index.ts` via `import * as S from './styles'` pattern. The 1102-line `post/styles/index.ts` is split by consumer boundary. Sub-components (TitleWithTooltip, OrnamentDivider) are extracted to components/ directories.

**Tech Stack:** TypeScript, styled-components v6, Next.js 15 App Router

**Note on verification:** Local `tsc --noEmit` may fail with SIGSEGV (known env issue). Static verification (import path tracing, named export cross-check) is the fallback.

---

### Task 1: Create CODE_STYLE.md

**Files:**
- Create: `packages/wuh.site.next/CODE_STYLE.md`

- [ ] **Step 1: Create the file**

Write `packages/wuh.site.next/CODE_STYLE.md`:

```markdown
# 代码风格约定

## 文件长度
- 单文件不超过 300 行，超过时拆分
- 拆分方式：样式拆到 styles/index.ts，子组件拆到 components/ 目录

## 注释
- 所有导出函数、组件必须加 JSDoc（描述用途、参数、返回值）
- 复杂/反直觉的逻辑处加行内注释解释"为什么"
- 自解释代码不加注释

## 样式
- styled-components 统一定义在独立的 styles/index.ts 文件中
- 组件文件通过 `import * as S from './styles'` 命名空间导入
```

- [ ] **Step 2: Commit**

```bash
git add packages/wuh.site.next/CODE_STYLE.md
git commit -m "docs: 添加代码风格约定 CODE_STYLE.md"
```

---

### Task 2: Split app/post/styles/index.ts (1102 lines)

**Files:**
- Create: `packages/wuh.site.next/app/post/styles/post-layout.ts`
- Create: `packages/wuh.site.next/app/post/styles/post-article.ts`
- Create: `packages/wuh.site.next/app/post/styles/post-toc.ts`
- Create: `packages/wuh.site.next/app/post/styles/post-toolbar.ts`
- Create: `packages/wuh.site.next/app/post/styles/post-header.ts`
- Create: `packages/wuh.site.next/app/post/styles/post-floating.ts`
- Modify: `packages/wuh.site.next/app/post/styles/index.ts` (rewrite as re-exports only)

**Import graph (who uses what):**

| Consumer | Imports from './styles' or '../styles' |
|----------|--------------------------------------|
| `PostView.tsx` (`./styles`) | ArticleCard, CommentPlaceholder, Container, ContentGrid, MainColumn, MarkdownBody, RedundantInfoCard, ShareCardInner, ShareInfoCard, StatusEmpty, TocAside, TocCard, TocItemLink, TocList, TocMobile, TocTitle |
| `components/PostHeader.tsx` (`../styles`) | CoverImage, AuthorRow, AuthorAvatar, AuthorInfo, Header, Title, Summary, OrnamentDivider |
| `components/PostToolbar.tsx` (`../styles`) | Toolbar |
| `components/FloatingActions.tsx` (`../styles`) | FloatingButtonGroup, FloatingButton |

- [ ] **Step 1: Create post-layout.ts**

Move lines 1-56 from `index.ts` (imports + Container + ContentGrid + MainColumn). Write `packages/wuh.site.next/app/post/styles/post-layout.ts`:

```typescript
import styled, { css, keyframes } from '@wuh.site/components/styled'

const scrollProgress = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 9999;
    background: var(--primary-color);
    transform-origin: left center;
    pointer-events: none;

    @supports (animation-timeline: scroll()) {
      animation: ${scrollProgress} auto linear;
      animation-timeline: scroll(root);
    }

    @supports not (animation-timeline: scroll()) {
      transform: scaleX(0);
    }
  }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 820px) 260px;
    gap: 24px;
    justify-content: center;
  }
`

export const MainColumn = styled.div`
  min-width: 0;
`
```

- [ ] **Step 2: Create post-toc.ts**

Move lines 76-177 from `index.ts` (TocAside through TocMobile). Write `packages/wuh.site.next/app/post/styles/post-toc.ts`:

```typescript
import styled from '@wuh.site/components/styled'

export const TocAside = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: 88px;
    align-self: start;
  }
`

export const TocCard = styled.div`
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  padding: 16px 16px 12px;

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 55%, transparent);
  }
`

export const TocTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--text-primary) 75%, transparent);
  margin-bottom: 10px;
`

export const TocList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
`

export const TocItemLink = styled.a<{ $active?: boolean; $depth?: number }>`
  display: block;
  text-decoration: none;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'color-mix(in oklab, var(--text-primary) 84%, transparent)')};
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${({ $active }) => ($active ? 'color-mix(in oklab, var(--primary-color) 12%, transparent)' : 'transparent')};
  margin-left: ${({ $depth }) => `${Math.min(2, Math.max(0, ($depth ?? 2) - 2)) * 10}px`};
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease, color var(--transition-fast) ease;

  &:hover {
    color: var(--text-primary);
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }
`

export const TocMobile = styled.details`
  margin: 0 0 var(--space-md);
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  overflow: hidden;

  @media (min-width: 1024px) {
    display: none;
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 700;
    color: var(--text-primary);
  }

  summary::-webkit-details-marker {
    display: none;
  }

  &[open] summary {
    border-bottom: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  }

  .toc-body {
    padding: 10px 10px 12px;
  }
`
```

- [ ] **Step 3: Create post-article.ts**

Move lines 1-4 (styled/Card/Empty imports) + 209-617 (ArticleCard through MarkdownBody end) from `index.ts`. Write `packages/wuh.site.next/app/post/styles/post-article.ts`:

```typescript
import styled from '@wuh.site/components/styled'
import Card from '@wuh.site/components/card'
import Empty from '@wuh.site/components/empty'

export const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  padding: 32px;
  color: var(--text-primary);
  box-shadow:
    var(--elevation-card),
    inset 0 1px 0 rgba(255,255,255,0.5);
  transition: box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (max-width: 640px) {
    padding: 20px;
  }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, rgba(0,0,0,0.06));
    box-shadow:
      var(--elevation-card-hover),
      inset 0 1px 0 rgba(255,255,255,0.5);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    box-shadow:
      var(--elevation-card),
      inset 0 1px 0 rgba(255,255,255,0.03);

    &:hover {
      box-shadow:
        var(--elevation-card-hover),
        inset 0 1px 0 rgba(255,255,255,0.03);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const RedundantInfoCard = styled(Card)`
  margin-top: var(--space-md);
  width: 100%;
  border-radius: var(--radius-card);
  border-color: color-mix(in oklab, var(--primary-color) 12%, var(--normal-300) 88%);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--primary-color) 7%, transparent), transparent 52%),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 97%, var(--primary-color) 3%),
      var(--background-100)
    );
  box-shadow: none;
`

export const ShareInfoCard = styled(RedundantInfoCard)`
  margin-top: var(--space-sm);
`

export const ShareCardInner = styled.div`
  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  button {
    background: transparent !important;
    border-color: var(--normal-300) !important;
    border-radius: 4px !important;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border-color: var(--normal-500) !important;
    }
  }
`

export const MarkdownBody = styled.article`
  --github-border: color-mix(in oklab, var(--accent-color) 18%, var(--normal-300));
  --github-muted: var(--text-secondary);
  --atom-inline-bg: color-mix(in oklab, var(--accent-color) 8%, transparent);
  --atom-inline-border: color-mix(in oklab, var(--accent-color) 22%, transparent);
  --atom-pre-bg: color-mix(in oklab, var(--background-200) 85%, var(--normal-300) 15%);
  --atom-pre-border: color-mix(in oklab, var(--normal-300) 35%, transparent);
  --code-color: var(--text-primary);
  --code-keyword: var(--accent-color);
  --code-string: #3b7c3b;
  --code-comment: var(--text-secondary);
  --code-function: #5a4e9e;
  --code-number: #b35c1e;
  --code-literal: #7a3e8c;
  --code-type: #2d7a8c;
  --code-title: var(--text-primary);
  --code-attr: #b3801e;
  --code-tag: #2d5a8c;

  @media (prefers-color-scheme: dark) {
    --github-border: color-mix(in oklab, var(--normal-600) 55%, transparent);
    --github-muted: var(--text-secondary);
    --atom-inline-bg: color-mix(in oklab, var(--accent-color) 14%, transparent);
    --atom-inline-border: color-mix(in oklab, var(--accent-color) 28%, transparent);
    --atom-pre-bg: #1a1a1a;
    --atom-pre-border: rgba(255, 255, 255, 0.06);
    --code-color: #d4d4d4;
    --code-keyword: #c678dd;
    --code-string: #98c379;
    --code-comment: #5c6370;
    --code-function: #61afef;
    --code-number: #d19a66;
    --code-literal: #56b6c2;
    --code-type: #e5c07b;
    --code-title: #e06c75;
    --code-attr: #e5c07b;
    --code-tag: #e06c75;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: var(--line-height-heading);
    margin: 36px 0 18px;
    color: inherit;
  }

  h1, h2 {
    font-family: var(--font-serif);
    padding-bottom: 0.35em;
    border-bottom: 1px solid var(--github-border);
  }

  h1 { font-size: var(--font-size-2xl); }
  h2 { font-size: var(--font-size-xl); }
  h3 { font-size: var(--font-size-lg); }
  h4 { font-size: var(--font-size-md); }
  h5 { font-size: var(--font-size-base); }
  h6 { font-size: var(--font-size-sm); color: var(--github-muted); }

  p {
    margin: 20px 0;
    font-size: var(--font-size-base);
    line-height: var(--line-height-body);
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
    border-bottom: 1px dashed color-mix(in oklab, var(--accent-color) 42%, transparent);
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  a:hover {
    border-bottom-style: solid;
    border-bottom-color: var(--accent-color);
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.9em;
    background: var(--atom-inline-bg);
    padding: 0.15em 0.45em;
    border-radius: 5px;
    border: 1px solid var(--atom-inline-border);
  }

  pre {
    background: var(--atom-pre-bg);
    border: 1px solid var(--atom-pre-border);
    border-radius: 10px;
    padding: 20px 22px;
    overflow: auto;
    font-size: 0.9em;
    position: relative;
    margin: 24px 0;
    box-shadow: var(--elevation-soft);
  }

  pre code {
    background: transparent;
    padding: 0;
    border: none;
    display: block;
    color: var(--code-color);
  }

  .copy-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 12px;
    border-radius: 8px;
    border: 1px solid var(--atom-pre-border);
    background: color-mix(in oklab, var(--atom-pre-bg) 60%, transparent);
    color: var(--text-secondary);
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .copy-btn:hover {
    background: var(--atom-pre-border);
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .anchor {
    margin-left: 6px;
    opacity: 0;
    text-decoration: none;
    border-bottom: none;
    color: var(--text-secondary);
    transition: opacity 0.2s ease;
  }

  h1:hover .anchor,
  h2:hover .anchor,
  h3:hover .anchor,
  h4:hover .anchor,
  h5:hover .anchor,
  h6:hover .anchor {
    opacity: 1;
  }

  blockquote {
    margin: 24px 0;
    padding: 16px 20px;
    border-left: 4px solid var(--accent-color);
    color: var(--text-secondary);
    background: color-mix(in oklab, var(--accent-color) 5%, var(--background-200));
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }

  blockquote p {
    margin: 8px 0;
  }

  ul,
  ol {
    margin: 20px 0 20px 1.8em;
  }

  li + li {
    margin-top: 8px;
  }

  .task-list-item {
    list-style: none;
    margin-left: -1.4em;
  }

  .task-list-item input {
    margin-right: 0.5em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 0.95em;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--github-border);
  }

  th,
  td {
    border: 1px solid var(--github-border);
    padding: 10px 14px;
    text-align: left;
  }

  th {
    background: color-mix(in oklab, var(--accent-color) 8%, var(--background-200));
    font-weight: 600;
  }

  tr:nth-child(even) td {
    background: color-mix(in oklab, var(--background-200) 45%, transparent);
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: var(--background-100);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  img[data-preview-index] {
    cursor: zoom-in;
  }

  img[data-preview-index]:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }

  hr {
    border: none;
    border-bottom: 1px solid var(--github-border);
    margin: 36px 0;
  }

  kbd {
    display: inline-block;
    padding: 3px 6px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    background: var(--atom-inline-bg);
    border: 1px solid var(--atom-inline-border);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  }

  details {
    border: 1px solid var(--github-border);
    border-radius: 10px;
    padding: 12px 16px;
    background: color-mix(in oklab, var(--background-200) 55%, transparent);
    margin: 16px 0;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
  }

  /* highlight.js code theme */
  .hljs { background: transparent; color: var(--code-color); }
  .hljs-keyword, .hljs-selector-tag, .hljs-deletion { color: var(--code-keyword); }
  .hljs-string, .hljs-addition { color: var(--code-string); }
  .hljs-comment, .hljs-quote { color: var(--code-comment); font-style: italic; }
  .hljs-function, .hljs-title.function_ { color: var(--code-function); }
  .hljs-number, .hljs-meta .hljs-string { color: var(--code-number); }
  .hljs-literal, .hljs-variable.language_ { color: var(--code-literal); }
  .hljs-type, .hljs-built_in { color: var(--code-type); }
  .hljs-title { color: var(--code-title); }
  .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-selector-attr, .hljs-selector-pseudo { color: var(--code-attr); }
  .hljs-tag, .hljs-selector-class { color: var(--code-tag); }
  .hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta { color: var(--accent-color); }
  .hljs-section, .hljs-name { color: var(--accent-color); }
  .hljs-emphasis { font-style: italic; }
  .hljs-strong { font-weight: bold; }
`

export const StatusEmpty = styled(Empty)`
  margin-bottom: var(--space-lg);
  min-height: 220px;
`

export const CommentPlaceholder = styled(Empty)`
  margin-top: var(--space-md);
`
```

- [ ] **Step 4: Create post-toolbar.ts**

Move lines 620-911 from `index.ts` (Toolbar styled component). Write `packages/wuh.site.next/app/post/styles/post-toolbar.ts`:

```typescript
import styled from '@wuh.site/components/styled'

export const Toolbar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-top: var(--space-xl);

  .toolbar-link {
    display: flex;
    align-items: center;
    min-height: 64px;
    padding: 14px 18px;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--radius-card);
    border: 1px solid color-mix(in oklab, var(--normal-400) 18%, transparent);
    background: var(--background-100);
    box-shadow: var(--elevation-soft);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.25s cubic-bezier(0.2, 0, 0, 1),
      box-shadow 0.25s cubic-bezier(0.2, 0, 0, 1),
      border-color 0.25s ease;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      width: 4px;
      height: 0;
      border-radius: 2px;
      background: var(--primary-color);
      transform: translateY(-50%);
      transition: height 0.3s cubic-bezier(0.2, 0, 0, 1);
    }
  }

  .toolbar-link.prev {
    width: 100%;
    justify-content: flex-start;
    &::before { left: 0; }
  }

  .toolbar-link.next {
    width: 56%;
    align-self: flex-end;
    justify-content: flex-end;
    &::before { right: 0; }
  }

  .toolbar-icon {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in oklab, var(--normal-300) 14%, transparent);
    transition: background 0.25s ease;
  }

  .toolbar-icon svg {
    width: 18px;
    height: 18px;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.25s ease;
  }

  .toolbar-label {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 14px;
    font-size: 0.9rem;
    line-height: 1.45;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toolbar-link.next .toolbar-icon { order: 2; }
  .toolbar-link.next .toolbar-label { order: 1; text-align: right; }

  /* flow indicator */
  .toolbar-flow {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .toolbar-flow-line,
  .toolbar-position { pointer-events: none; }

  .toolbar-flow-line {
    width: 2px;
    height: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    opacity: 0.35;
  }

  .toolbar-flow-line::before,
  .toolbar-flow-line::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--normal-400);
  }

  .toolbar-flow-line::before { margin-bottom: auto; }

  .toolbar-back {
    position: absolute;
    right: 14px;
    top: 0;
    height: 64px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--normal-400);
    text-decoration: none;
    opacity: 0.45;
    transition: opacity 0.2s ease, color 0.2s ease;
    z-index: 2;
  }

  .toolbar-back svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .toolbar-back:hover {
    opacity: 0.9;
    color: var(--primary-color);
  }

  .toolbar-position {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--normal-400);
    opacity: 0.55;
    white-space: nowrap;
    user-select: none;
  }

  /* disabled */
  .toolbar-link[aria-disabled='true'] {
    color: var(--text-primary);
    opacity: 0.45;
    background: color-mix(in oklab, var(--background-200) 76%, var(--normal-200) 24%);
    border-color: color-mix(in srgb, var(--normal-300) 50%, transparent);
    box-shadow: none;
    cursor: not-allowed;
    &::before { background: var(--normal-400); }
  }

  .toolbar-link[aria-disabled='true'] * { cursor: not-allowed; }

  /* hover */
  a.toolbar-link:hover {
    border-color: color-mix(in oklab, var(--primary-color) 40%, transparent);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    &::before { height: 28px; }
  }

  a.toolbar-link.prev:hover .toolbar-icon svg { transform: translateX(-3px); }
  a.toolbar-link.next:hover .toolbar-icon svg { transform: translateX(3px); }
  a.toolbar-link.prev:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 18%, transparent); }
  a.toolbar-link.next:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 18%, transparent); }

  a.toolbar-link:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar-link,
    .toolbar-link::before,
    .toolbar-icon,
    .toolbar-icon svg { transition: none; }
    a.toolbar-link:hover { transform: none; }
  }

  @media (max-width: 640px) {
    gap: 20px;
    .toolbar-link.next { width: 100%; align-self: stretch; }
    .toolbar-flow-line { height: 10px; }
    .toolbar-back { display: none; }
    .toolbar-position { font-size: 0.68rem; }
    a.toolbar-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
  }

  @media (prefers-color-scheme: dark) {
    .toolbar-link { border-color: color-mix(in oklab, var(--normal-700) 40%, transparent); }
    .toolbar-icon { background: color-mix(in oklab, var(--normal-700) 30%, transparent); }
    .toolbar-flow-line::before,
    .toolbar-flow-line::after { background: var(--normal-600); }
    a.toolbar-link:hover {
      border-color: color-mix(in oklab, var(--primary-color) 50%, transparent);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
    }
    a.toolbar-link:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 22%, transparent); }
  }
`
```

- [ ] **Step 5: Create post-header.ts**

Move lines 179-207 (Header through TagGroup) + 1025-1102 (CoverImage through OrnamentDivider) from `index.ts`. Write `packages/wuh.site.next/app/post/styles/post-header.ts`:

```typescript
import styled from '@wuh.site/components/styled'

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

export const Title = styled.h1`
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: color-mix(in oklab, var(--text-color) 76%, transparent);
  font-size: var(--font-size-sm);
  align-items: center;
`

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const CoverImage = styled.div`
  width: 100%;
  max-height: 360px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: var(--space-lg);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`

export const AuthorAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid color-mix(in oklab, var(--accent-color) 30%, transparent);
  flex-shrink: 0;
`

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`

export const Summary = styled.blockquote`
  margin: 0 0 var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--accent-color);
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  background: color-mix(in oklab, var(--accent-color) 6%, transparent);
  border-radius: 0 8px 8px 0;
`

export const OrnamentDivider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;

  .divider-line {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.35;
  }

  .divider-diamond {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }
`
```

- [ ] **Step 6: Create post-floating.ts**

Move lines 922-1021 from `index.ts` (FloatingButtonGroup through FloatingButton). Write `packages/wuh.site.next/app/post/styles/post-floating.ts`:

```typescript
import styled, { css } from '@wuh.site/components/styled'

export const FloatingButtonGroup = styled.div`
  --float-button-width: 50px;
  --float-divider: var(--normal-300);

  position: fixed;
  right: 0;
  bottom: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 20;
  border: 1px solid var(--normal-300);
  border-right: 0;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  overflow: hidden;
  background: var(--background-100);

  & > * {
    width: var(--float-button-width);
  }

  & > * + * {
    border-top: 1px solid var(--float-divider);
  }

  @media (max-width: 640px) {
    --float-button-width: 50px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    border-right-color: transparent;
    background: color-mix(in oklab, var(--background-200) 75%, var(--background-900) 25%);
    --float-divider: var(--normal-600);

    & > * + * {
      border-top-color: var(--float-divider);
    }
  }
`

const floatingButtonBase = css`
  border: none;
  background: transparent;
  color: var(--text-primary);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  min-width: 50px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
  will-change: transform;

  &:hover {
    color: var(--primary-color);
    background: var(--background-200);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
    transform: translateX(-2px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (prefers-color-scheme: dark) {
    background: transparent;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);

    &:hover {
      background: color-mix(in oklab, var(--background-300) 70%, var(--background-900) 30%);
    }
  }
`

export const FloatingButton = styled.button`
  ${floatingButtonBase}
  padding: 0;
`
```

- [ ] **Step 7: Rewrite index.ts as re-exports only**

Replace all content in `packages/wuh.site.next/app/post/styles/index.ts` with:

```typescript
export { Container, ContentGrid, MainColumn } from './post-layout'
export { TocAside, TocCard, TocTitle, TocList, TocItemLink, TocMobile } from './post-toc'
export { ArticleCard, RedundantInfoCard, ShareInfoCard, ShareCardInner, MarkdownBody, StatusEmpty, CommentPlaceholder } from './post-article'
export { Toolbar } from './post-toolbar'
export { Header, Title, MetaRow, TagGroup, CoverImage, AuthorRow, AuthorAvatar, AuthorInfo, Summary, OrnamentDivider } from './post-header'
export { FloatingButtonGroup, FloatingButton } from './post-floating'
```

- [ ] **Step 8: Verify**

All consumer imports (`PostView.tsx`, `PostHeader.tsx`, `PostToolbar.tsx`, `FloatingActions.tsx`) use `'./styles'` or `'../styles'` which resolves to `index.ts`. The re-exports are named exactly the same as the original exports. No consumer file needs modification.

Run: `wc -l packages/wuh.site.next/app/post/styles/*.ts` to confirm each file is under 300 lines.

- [ ] **Step 9: Commit**

```bash
git add packages/wuh.site.next/app/post/styles/
git commit -m "refactor: 拆分 post/styles/index.ts 为 6 个按板块组织的样式文件"
```

---

### Task 3: Split app/HomeView.tsx (715 lines)

**Files:**
- Create: `packages/wuh.site.next/app/styles/index.ts`
- Modify: `packages/wuh.site.next/app/HomeView.tsx`

- [ ] **Step 1: Create styles/index.ts**

Move all styled components (lines 59-198, 200-261, 263-335, 337-442) from `HomeView.tsx` into `packages/wuh.site.next/app/styles/index.ts`:

```typescript
import styled from '@wuh.site/components/styled'
import Link from 'next/link'
import Image from '@wuh.site/components/image'

export const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

export const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

export const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-xl) 0 var(--space-md);
`

export const StyledLogo = styled(Image).attrs({
  showSkeleton: false,
  inline: true,
  appearance: 'plain',
  imageClassName: 'logo-img'
})`
  width: fit-content;

  .logo-img {
    display: block;
    transition: filter 0.2s ease;
    width: 64px;
    height: auto;
  }

  @media (prefers-color-scheme: dark) {
    .logo-img { filter: invert(); }
  }
`

export const SiteTitle = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  margin-top: var(--space-xs);
`

export const SiteTagline = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  letter-spacing: 0.06em;
`

export const Motto = styled.blockquote`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.8;
  color: var(--text-secondary);
  text-align: center;
  padding: var(--space-md) 0;
  border-left: none;
  position: relative;
  margin: 0 auto;

  @media (max-width: 520px) { max-width: 320px; }

  &::after {
    content: '';
    display: block;
    width: 28px;
    height: 2px;
    margin: var(--space-md) auto 0;
    background: var(--accent-color);
    opacity: 0.5;
  }
`

export const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
`

export const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: var(--space-xs);
`

export const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;
`

export const DividerLine = styled.span`
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--space-md);
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`

export const SectionTitle = styled.h2`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.03em;
`

export const MoreLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast) ease;
  font-family: var(--font-serif);

  &:hover {
    color: var(--primary-color);
    text-decoration: none;
  }
`

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

export const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const YearLabel = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--space-xs) 0;
  letter-spacing: 0.05em;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--text-muted) 20%, transparent);
  }
`

export const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`

export const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

export const PostTitle = styled.span`
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
  }
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.5;
`

export const PostTags = styled.span`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
    width: 100%;
  }
`

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

export const ProjectLink = styled.a`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    text-decoration: none;
  }

  @media (max-width: 520px) { flex-wrap: wrap; }
`

export const ProjectName = styled.span`
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  min-width: fit-content;
`

export const ProjectDesc = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 520px) { white-space: normal; }
`

export const ProjectMeta = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-left: auto;
  flex-shrink: 0;

  @media (max-width: 520px) { margin-left: 0; }
`

export const EmptyHint = styled.div`
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-xl) 0;
  font-size: var(--font-size-sm);
`

export const BooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

export const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

export const BookCover = styled.div<{ $src?: string }>`
  width: 32px;
  height: 42px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'var(--background-300)')};
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
`

export const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

export const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`
```

- [ ] **Step 2: Update HomeView.tsx**

Rewrite `HomeView.tsx` - keep types, helpers, CONTACT_CONFIG, and component logic. Replace all styled-components with namespace import. Add JSDoc.

```typescript
'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import Button from '@wuh.site/components/button'
import Dialog from '@wuh.site/components/dialog'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'
import Image from '@wuh.site/components/image'
import ContactCard, { type ContactCardProps } from './components/ContactCard'
import { IconMusic, IconDiscord, DiamondDivider } from '@wuh.site/components/icons'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type Repo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  homepage: string | null
  fork: boolean
}

type TagItem = {
  name: string
  color?: string | null
}

type Props = {
  repos: Repo[]
  posts: {
    id: number
    number: number
    title: string
    html_url: string
    comments: number
    created_at: string
    labels: TagItem[]
  }[]
  yearlySummaries: {
    id: number
    number: number
    title: string
    created_at: string
  }[]
  wereadBooks: {
    bookId: string
    title: string
    author: string
    cover: string
    readUpdateTime: number
    finishReading: number
  }[]
}

type ContactDialogConfig = ContactCardProps

const CONTACT_CONFIG: Record<'wechat' | 'qq' | 'twitter' | 'github' | 'douban' | 'netease' | 'discord', ContactDialogConfig> = {
  wechat: {
    badge: 'WeChat',
    qrSrc: 'https://cdn.wuh.site/web/wechat.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '工程化 & 可视化',
    tagline: '代码写诗，工具作画',
    hints: ['扫码即可开启一场 1:1 对话', '备注「官网来访」我们会更快相遇'],
  },
  qq: {
    badge: 'QQ',
    qrSrc: 'https://cdn.wuh.site/web/qq.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '实时沟通',
    tagline: '山海皆可平，何况是聊个天',
    hints: ['扫码即刻语音或文字交流', '备注「官网来访」我们会更快相遇'],
  },
  twitter: {
    badge: 'Twitter',
    linkUrl: 'https://x.com/wuh131420',
    linkLabel: '前往 Twitter 主页',
    name: 'wuh131420',
    handle: '@wuh131420',
    title: 'Twitter',
    tagline: '碎片灵感，即时分享',
    hints: ['技术观察 & 灵感速写 & 碎碎念'],
  },
  github: {
    badge: 'GitHub',
    linkUrl: 'https://github.com/stack-wuh',
    linkLabel: '前往 GitHub 主页',
    name: 'stack-wuh',
    handle: '@stack-wuh',
    title: 'GitHub',
    tagline: '开源是一种信仰',
    hints: ['你是什么样的人，就会看到什么样的代码'],
  },
  douban: {
    badge: '豆瓣',
    linkUrl: 'https://www.douban.com/people/wuh-site/?_i=6001540Kgx5FFN',
    linkLabel: '前往豆瓣主页',
    name: 'wuh.site',
    handle: 'wuh-site',
    title: '豆瓣',
    tagline: '书影音标记，精神自留地',
    hints: ['标记过的书影音，构成了一个人的轮廓'],
  },
  netease: {
    badge: '网易云',
    linkUrl: 'https://music.163.com/#/user/home?id=398326271',
    linkLabel: '前往网易云主页',
    name: 'stack-wuh',
    handle: 'wuh131420',
    title: '网易云音乐',
    tagline: '算法推荐不了一颗有趣的灵魂',
    hints: ['用耳朵投票，每一首都算数'],
  },
  discord: {
    badge: 'Discord',
    linkUrl: 'https://discord.com/users/shadowoo1995',
    linkLabel: '前往 Discord',
    name: 'shadowoo1995',
    handle: '@shadowoo1995',
    title: 'Discord',
    tagline: '语音频道见，比 issue 更快',
    hints: ['技术闲聊 & 问题讨论 & 摸鱼胜地'],
  },
}

type ContactType = keyof typeof CONTACT_CONFIG

const groupByYear = (posts: Props['posts']) => {
  const map = new Map<number, Props['posts']>()
  posts.forEach(post => {
    const year = new Date(post.created_at).getFullYear()
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  })
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
}

/** 装饰分隔线 */
function OrnamentDivider() {
  return (
    <S.DividerRow aria-hidden='true'>
      <S.DividerLine />
      <DiamondDivider />
      <S.DividerLine />
    </S.DividerRow>
  )
}

/**
 * 首页视图，展示 Hero、格言、社交链接、精选博客、年度总结、微信读书、精选项目等板块。
 */
export default function HomeView({ repos, posts, yearlySummaries, wereadBooks }: Props) {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  const yearGroups = useMemo(() => groupByYear(posts), [posts])
  return (
    <S.Root>
      <S.Main>
        <S.Hero>
          <S.StyledLogo src='/logo.svg' alt='wuh.site.logo' width={64} height={38.4} priority />
          <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</S.SiteTitle>
          <S.SiteTagline>雾失楼台，月迷津渡</S.SiteTagline>
        </S.Hero>

        <S.Motto>
          写作是抵抗遗忘的方式，代码是构建世界的语言。
        </S.Motto>

        <S.Ctas>
          <Button href='/blog' variant='outlined' color='primary' size='small'>查看博客</Button>
          <Button href='/about' variant='outlined' color='secondary' size='small'>关于我</Button>
        </S.Ctas>
        <S.SocialRow>
          <LinkGroup
            items={[
              { type: 'wechat', title: '微信', onClick: () => openContact('wechat') },
              { type: 'qq', title: 'QQ', onClick: () => openContact('qq') },
              { type: 'twitter', title: 'Twitter', onClick: () => openContact('twitter') },
              { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: '邮箱' },
              { type: 'github', title: 'GitHub', onClick: () => openContact('github') },
              { type: 'douban', title: '豆瓣', onClick: () => openContact('douban') },
              { type: 'custom', title: '网易云', icon: <IconMusic />, onClick: () => openContact('netease') },
              { type: 'custom', title: 'Discord', icon: <IconDiscord />, onClick: () => openContact('discord') },
            ]}
            size='medium'
          />
        </S.SocialRow>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>精选博客</S.SectionTitle>
            <S.MoreLink href='/blog'>全部博客&nbsp;&rarr;</S.MoreLink>
          </S.SectionHeader>
          {posts.length === 0 ? (
            <S.EmptyHint>暂时无法获取 Issues 数据</S.EmptyHint>
          ) : (
            <S.Timeline>
              {yearGroups.map(([year, yearPosts]) => (
                <S.YearGroup key={year}>
                  <S.YearLabel>{year}</S.YearLabel>
                  {yearPosts.map(post => (
                    <S.PostRow key={post.id} href={`/post/${post.number}`}>
                      <S.InkDot />
                      <S.PostTitle>{post.title}</S.PostTitle>
                      {post.labels?.length > 0 && (
                        <S.PostTags>
                          {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                            <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                          ))}
                        </S.PostTags>
                      )}
                      <S.PostMeta>
                        <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                        <S.MetaDot />
                        <span>{post.comments}</span>
                      </S.PostMeta>
                    </S.PostRow>
                  ))}
                </S.YearGroup>
              ))}
            </S.Timeline>
          )}
        </S.Section>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>年度总结</S.SectionTitle>
          </S.SectionHeader>
          {yearlySummaries.length === 0 ? (
            <S.EmptyHint>暂无年度总结</S.EmptyHint>
          ) : (
            <S.ProjectList>
              {yearlySummaries.map(item => (
                <S.PostRow key={item.id} href={`/post/${item.number}`}>
                  <S.InkDot />
                  <S.PostTitle>{item.title}</S.PostTitle>
                  <S.PostMeta>
                    <span>{new Date(item.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                  </S.PostMeta>
                </S.PostRow>
              ))}
            </S.ProjectList>
          )}
        </S.Section>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>微信读书</S.SectionTitle>
            {wereadBooks.length > 0 && <S.MoreLink href='/weread'>全部&nbsp;&rarr;</S.MoreLink>}
          </S.SectionHeader>
          {wereadBooks.length === 0 ? (
            <S.EmptyHint>暂无书架数据</S.EmptyHint>
          ) : (
            <S.BooksList>
              {wereadBooks.map((book) => (
                <S.BookRow key={book.bookId}>
                  <S.BookCover $src={book.cover || undefined} />
                  <S.BookInfo>
                    <S.BookTitle>{book.title}</S.BookTitle>
                    <S.BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</S.BookMeta>
                  </S.BookInfo>
                </S.BookRow>
              ))}
            </S.BooksList>
          )}
        </S.Section>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>精选项目</S.SectionTitle>
          </S.SectionHeader>
          {repos.length === 0 ? (
            <S.EmptyHint>暂时无法获取 GitHub 数据</S.EmptyHint>
          ) : (
            <S.ProjectList>
              {repos.map(repo => (
                <S.ProjectLink
                  key={repo.html_url}
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <S.ProjectName>{repo.name}</S.ProjectName>
                  {repo.description && <S.ProjectDesc>{repo.description}</S.ProjectDesc>}
                  <S.ProjectMeta>{repo.language ?? ''}{repo.stargazers_count > 0 ? ` \u00b7 \u2606 ${repo.stargazers_count}` : ''}</S.ProjectMeta>
                </S.ProjectLink>
              ))}
            </S.ProjectList>
          )}
        </S.Section>

        <Dialog
          open={Boolean(activeContactConfig)}
          onClose={closeContact}
          title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
          fullScreen={false}
          width='min(760px, calc(100vw - 32px))'
        >
          {activeContactConfig && <ContactCard {...activeContactConfig} />}
        </Dialog>
      </S.Main>
    </S.Root>
  )
}
```

- [ ] **Step 3: Verify**

All styled component names are preserved (only renamed `Empty` → `EmptyHint` to avoid shadowing the `Empty` component import that was removed). Verify `styled` import is removed from `HomeView.tsx` (no longer needed since styles moved). Verify `Link`, `Image` imports removed from `HomeView.tsx` if only used in styles.

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/HomeView.tsx packages/wuh.site.next/app/styles/index.ts
git commit -m "refactor: 拆分 HomeView 样式到 styles/index.ts 并补充 JSDoc"
```

---

### Task 4: Split app/blog/BlogListView.tsx (387 lines)

**Files:**
- Create: `packages/wuh.site.next/app/blog/styles/index.ts`
- Create: `packages/wuh.site.next/app/blog/components/TitleWithTooltip.tsx`
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx`

- [ ] **Step 1: Create styles/index.ts**

Move all styled components from `BlogListView.tsx` (lines 32-314) into `packages/wuh.site.next/app/blog/styles/index.ts`:

```typescript
import styled from '@wuh.site/components/styled'
import Link from 'next/link'

export const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: clamp(24px, 3vw, 48px) clamp(20px, 5vw, 32px);
`

export const Header = styled.header`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

export const Title = styled.h1`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
  color: var(--text-primary);
`

export const Subtitle = styled.p`
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-muted);
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`

export const BackLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-decoration: none;
  &:hover { color: var(--text-primary); }
`

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

export const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  animation: blogRowRise 0.35s ease forwards;

  @keyframes blogRowRise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; opacity: 1; }
`

export const YearLabel = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--space-xs) 0;
  letter-spacing: 0.05em;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--text-muted) 20%, transparent);
  }
`

export const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
    text-decoration: none;
  }

  @media (max-width: 520px) { flex-wrap: wrap; gap: 6px; }
`

export const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

export const IssueNumber = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  opacity: 0.6;
  flex-shrink: 0;
  min-width: 36px;
  text-align: right;
`

export const PostTags = styled.span`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
    width: 100%;
  }
`

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
  }
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.5;
`

export const EmptyHint = styled.div`
  width: 100%;
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-2xl) 0;
  font-size: var(--font-size-sm);
`
```

- [ ] **Step 2: Create TitleWithTooltip.tsx**

Extract the `TitleWithTooltip` sub-component and its styled dependencies (`TitleTextContainer`, `TitleText`, `TitleTooltip`) into `packages/wuh.site.next/app/blog/components/TitleWithTooltip.tsx`:

```typescript
'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import styled from '@wuh.site/components/styled'

const TitleTextContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`

const TitleText = styled.span`
  display: block;
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: min(360px, 80vw);
  padding: var(--space-sm);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  color: var(--text-primary);
  box-shadow: var(--elevation-card);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '4px')});
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
`

interface TitleWithTooltipProps {
  text: string
}

export default function TitleWithTooltip({ text }: TitleWithTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [hovering, setHovering] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const checkOverflow = () => {
      setOverflow(el.scrollWidth - el.clientWidth > 1)
    }
    checkOverflow()
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(checkOverflow)
      observer.observe(el)
    }
    window.addEventListener('resize', checkOverflow)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text])

  return (
    <TitleTextContainer
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <TitleText ref={textRef} title={overflow ? text : undefined}>
        {text}
      </TitleText>
      {overflow && (
        <TitleTooltip role='tooltip' $visible={hovering}>
          {text}
        </TitleTooltip>
      )}
    </TitleTextContainer>
  )
}
```

- [ ] **Step 3: Update BlogListView.tsx**

Replace all content with the slimmed version using namespace imports:

```typescript
'use client'

import { useMemo } from 'react'
import Tag from '@wuh.site/components/tag'
import Pagination from '@wuh.site/components/pagination'
import TitleWithTooltip from './components/TitleWithTooltip'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type TagItem = {
  name: string
  color?: string | null
}

type PostItem = {
  id: number
  number: number
  title: string
  comments: number
  created_at: string
  labels: TagItem[]
}

type Props = {
  posts: PostItem[]
  pagination: { currentPage: number; lastPage: number }
}

const groupByYear = (posts: PostItem[]) => {
  const map = new Map<number, PostItem[]>()
  posts.forEach(post => {
    const year = new Date(post.created_at).getFullYear()
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  })
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
}

/**
 * 博客列表视图，按年份分组展示博客文章，支持分页。
 */
export default function BlogListView({ posts, pagination }: Props) {
  const yearGroups = useMemo(() => groupByYear(posts), [posts])

  return (
    <S.Root>
      <S.Main>
        <S.Header>
          <S.TitleGroup>
            <S.Title>全部博客</S.Title>
            <S.Subtitle>收录 GitHub Issues 中的全部博客文章</S.Subtitle>
          </S.TitleGroup>
          <S.HeaderActions>
            <S.BackLink href='/'>返回首页</S.BackLink>
          </S.HeaderActions>
        </S.Header>

        {posts.length === 0 ? (
          <S.EmptyHint>暂时没有可展示的博客内容</S.EmptyHint>
        ) : (
          <S.Timeline>
            {yearGroups.map(([year, yearPosts]) => (
              <S.YearGroup key={year}>
                <S.YearLabel>{year}</S.YearLabel>
                {yearPosts.map(post => (
                  <S.PostRow key={post.id} href={`/post/${post.number}`}>
                    <S.InkDot />
                    <TitleWithTooltip text={post.title} />
                    <S.IssueNumber>#{post.number}</S.IssueNumber>
                    {post.labels?.length > 0 && (
                      <S.PostTags>
                        {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                          <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                        ))}
                      </S.PostTags>
                    )}
                    <S.PostMeta>
                      <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      <S.MetaDot />
                      <span>{post.comments}</span>
                    </S.PostMeta>
                  </S.PostRow>
                ))}
              </S.YearGroup>
            ))}
          </S.Timeline>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          getPageUrl={(page) => (page <= 1 ? '/blog' : `/blog?page=${page}`)}
        />
      </S.Main>
    </S.Root>
  )
}
```

- [ ] **Step 4: Verify**

The `TitleWithTooltip` component is extracted to its own file with its own styled-components. The `BlogListView.tsx` file now uses `* as S` for styles. The `TitleWithTooltip` import is updated to `./components/TitleWithTooltip`.

- [ ] **Step 5: Commit**

```bash
git add packages/wuh.site.next/app/blog/
git commit -m "refactor: 拆分 BlogListView 样式和 TitleWithTooltip 子组件，补充 JSDoc"
```

---

### Task 5: Split app/components/SiteHeader.tsx (325 lines)

**Files:**
- Create: `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- Modify: `packages/wuh.site.next/app/components/SiteHeader.tsx`

- [ ] **Step 1: Create styles/index.ts**

Move all styled components (lines 12-241) from `SiteHeader.tsx` into `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`:

```typescript
import styled from '@wuh.site/components/styled'
import Link from 'next/link'

const BREAKPOINT = '768px'

export const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-color) 72%, transparent),
      color-mix(in oklab, var(--background-color) 84%, transparent)
    );
  backdrop-filter: blur(10px);
`

export const HeaderInner = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 14px clamp(16px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-sm);
`

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0;
  color: var(--text-color);
  min-width: 0;

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
    border-radius: 10px;
  }
`

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 12px;

  @media (min-width: ${BREAKPOINT}) { display: flex; }
`

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const NavLink = styled(Link)`
  text-decoration: none;
  color: color-mix(in oklab, var(--text-color) 78%, transparent);
  font-size: var(--font-size-sm);
  padding: 10px 12px;
  border-radius: 999px;
  transition: background var(--transition-fast) ease, color var(--transition-fast) ease, transform var(--transition-fast) ease;

  &:hover {
    color: var(--text-color);
    background: color-mix(in oklab, var(--background-100) 75%, transparent);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

export const MobileToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  background: color-mix(in oklab, var(--background-100) 70%, transparent);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform var(--transition-fast) ease, background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (min-width: ${BREAKPOINT}) { display: none; }

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 35%, var(--normal-300) 65%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
`

export const ThemeToggle = styled.button`
  --toggle-h: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: var(--toggle-h);
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 26%, rgba(0, 0, 0, 0.06));
  background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100) 86%);
  color: var(--primary-color);
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform var(--transition-fast) ease, border-color var(--transition-fast) ease, background var(--transition-fast) ease;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 38%, rgba(0, 0, 0, 0.06));
    background: color-mix(in oklab, var(--primary-color) 20%, var(--background-100) 80%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
  @media (max-width: ${BREAKPOINT}) { display: none; }
`

export const ThemeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
`

export const MobilePanel = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  padding: 0 clamp(16px, 4vw, 60px) 14px;

  @media (min-width: ${BREAKPOINT}) { display: none; }
`

export const MobileNav = styled.nav`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 12px;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  display: grid;
  gap: 10px;
`

export const MobileItem = styled(Link)`
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 25%, var(--normal-300) 75%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

export const MobileActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const MobileActionButton = styled.button`
  padding: 12px 14px;
  border-radius: 14px;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid color-mix(in oklab, var(--primary-color) 26%, rgba(0,0,0,0.06));
  cursor: pointer;
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 12%, var(--background-100) 88%);
    border-color: color-mix(in oklab, var(--primary-color) 40%, rgba(0,0,0,0.06));
    box-shadow: var(--elevation-soft);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

export const MobileThemeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
```

- [ ] **Step 2: Update SiteHeader.tsx**

Rewrite `SiteHeader.tsx` with namespace style import and JSDoc:

```typescript
'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import Image from '@wuh.site/components/image'
import { IconBars } from '@wuh.site/components/icons'
import { useThemeMode } from '../theme/ThemeModeProvider'
import * as S from './styles'

/**
 * 站点顶部导航栏，支持桌面端/移动端两种布局，具有主题切换功能。
 * 移动端通过汉堡菜单展开/收起导航面板，按 Escape 可关闭。
 */
export default function SiteHeader() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const { mode, toggleMode } = useThemeMode()

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <S.HeaderRoot>
      <S.HeaderInner>
        <S.Brand aria-label='站点标识'>
          <Image src='/logo.svg' alt='wuh.site' width={42} height={26} priority inline showSkeleton={false} appearance='plain' />
        </S.Brand>

        <S.Right>
          <S.Nav aria-label='主导航'>
            <S.NavLink href='/blog'>博客</S.NavLink>
            <S.NavLink href='/about'>关于</S.NavLink>
            <S.NavLink href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer'>
              知识库
            </S.NavLink>
          </S.Nav>

          <S.ThemeToggle type='button' onClick={toggleMode} aria-label={`切换主题（当前：${mode === 'money' ? '酒红' : '素雅'}）`}>
            <S.ThemeDot aria-hidden='true' />
            <span>{mode === 'money' ? '酒红' : '素雅'}</span>
          </S.ThemeToggle>

          <S.MobileToggle
            type='button'
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <IconBars />
          </S.MobileToggle>
        </S.Right>
      </S.HeaderInner>

      <S.MobilePanel id={panelId} $open={open}>
        <S.MobileNav aria-label='移动端导航'>
          <S.MobileItem href='/' onClick={close}>首页</S.MobileItem>
          <S.MobileItem href='/blog' onClick={close}>博客</S.MobileItem>
          <S.MobileItem href='/about' onClick={close}>关于</S.MobileItem>
          <S.MobileItem href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' onClick={close}>
            知识库
          </S.MobileItem>
          <S.MobileActions>
            <S.MobileActionButton
              type='button'
              onClick={() => {
                toggleMode()
                close()
              }}
            >
              <S.MobileThemeLabel>
                <S.ThemeDot aria-hidden='true' />
                <span>主题：{mode === 'money' ? '酒红' : '素雅'}</span>
              </S.MobileThemeLabel>
            </S.MobileActionButton>
          </S.MobileActions>
        </S.MobileNav>
      </S.MobilePanel>
    </S.HeaderRoot>
  )
}
```

Note: `import Link from 'next/link'` is kept in `SiteHeader.tsx` because the component no longer directly uses `NavLink` or `MobileItem` (which contain `Link`) — but wait, the component doesn't use `Link` directly. Since `NavLink` and `MobileItem` are now in `S.*`, the `Link` import can be removed from `SiteHeader.tsx`.

Actually, reviewing the JSX — `SiteHeader.tsx` uses `S.NavLink`, `S.MobileItem` (which contain `Link` internally in the styles file), but the component itself no longer uses `Link` directly. So `Link` import should be removed from `SiteHeader.tsx`.

- [ ] **Step 3: Verify**

`SiteHeader.tsx` no longer needs `styled` or `Link` imports. The `BREAKPOINT` constant moves with styles to `styles/index.ts`.

- [ ] **Step 4: Commit**

```bash
git add packages/wuh.site.next/app/components/SiteHeader/
git commit -m "refactor: 拆分 SiteHeader 样式到 styles/index.ts 并补充 JSDoc"
```

---

### Task 6: Final verification

- [ ] **Step 1: Verify file sizes**

```bash
wc -l packages/wuh.site.next/app/post/styles/*.ts
wc -l packages/wuh.site.next/app/HomeView.tsx packages/wuh.site.next/app/styles/index.ts
wc -l packages/wuh.site.next/app/blog/BlogListView.tsx packages/wuh.site.next/app/blog/styles/index.ts packages/wuh.site.next/app/blog/components/TitleWithTooltip.tsx
wc -l packages/wuh.site.next/app/components/SiteHeader.tsx packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
```

All files should be under 300 lines.

- [ ] **Step 2: Import cross-check**

Verify all named exports from new style files match original export names. All consumer imports resolve through `index.ts` re-exports (for post/styles) or direct `./styles` imports.

- [ ] **Step 3: Commit openspec update**

```bash
git add openspec/changes/20260607_P_code_style_standards/
git commit -m "docs: 更新 code-style-standards tasks 完成状态"
```
