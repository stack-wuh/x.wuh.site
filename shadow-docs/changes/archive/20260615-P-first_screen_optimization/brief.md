# 首屏加载优化

> 原始变更名：`20260615_P_first_screen_optimization`

## 元数据
- 日期：2026-06-15
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 首屏加载优化设计

- **日期**: 2026-06-15
- **项目**: x.wuh.site
- **类型**: 需求 (P)

## 1. 问题分析

首页（`app/page.tsx` → `HomeView.tsx`）首屏加载了以下非必要资源：

**全局层 (`AppProviders` → `layout.tsx`)**:
- JetBrains Mono 字体：已在 root layout 加载，但首页无任何元素引用
- `Dialog` + `ContactCard` + CONTACT_CONFIG（7 个联系方式，~100 行配置）：点击联系按钮才需要，但总是同步渲染

**首页层 (`HomeView.tsx`)**:
- 微信读书 BookCover 使用 CSS `background: url()`，绕过了 `@wuh.site/components/image`（内置懒加载、WebP 转换、骨架屏）
- 首屏以下 3 个 section（年度总结、微信读书、精选项目）同步渲染，其中微信读书 section 含客户端交互

## 2. 设计决策

- **优先消除可见的浪费**：字体只加载用到的，图片用已有基础设施，弹窗按需加载
- **不改基础设施**：不引入新的懒加载库，用 `next/dynamic` + 已有的 `@wuh.site/components/image`
- **不拆 SSR 内容**：年度总结、精选项目纯文本无客户端 JS，保持 SSR

## 3. 优化项

### 3.1 JetBrains Mono 字体 — 移出全局 layout

**现状**：`layout.tsx` 加载 Inter + JetBrains_Mono + Noto_Serif_SC 三个字体，全部应用到 `<body>`。

**优化**：从 `layout.tsx` 移除 JetBrains Mono 的加载和 CSS variable。在用到代码块的页面（博客详情 `app/post/`）通过独立 layout 或页面内 `next/font/google` 单独加载。

**影响**：首页、博客列表、关于、微信读书页不再加载 JetBrains Mono。

### 3.2 BookCover — CSS background → @wuh.site/components/image

**现状**：`app/styles/index.ts` 中 `BookCover` 为 `styled.div`，通过 `background: url($p.$src)` 渲染封面图。

**优化**：改为 `@wuh.site/components/image`，该组件默认 `loading="lazy"`，自带骨架屏、WebP 转换、错误兜底。

**影响**：微信读书封面在首页和 `/weread` 页面实现懒加载 + 优化。

### 3.3 Dialog + ContactCard — next/dynamic 懒加载

**现状**：`HomeView.tsx` 直接 import `Dialog`、`ContactCard`，并在组件内定义 7 个联系方式的 `CONTACT_CONFIG` 对象（~100 行）。无论用户是否点击，弹窗代码都打入首屏 bundle。

**优化**：
- `CONTACT_CONFIG` 移到独立文件（如 `app/components/ContactConfig.ts`）
- 在 `HomeView.tsx` 中用 `next/dynamic` 懒加载 `Dialog` + `ContactCard`
- 点击联系按钮时触发 import

**影响**：首屏不加载弹窗组件，点击时才下载对应 chunk。

### 3.4 微信读书 section — IntersectionObserver + next/dynamic

**现状**：微信读书 section 渲染 `BookCover` 组件（改用 `@wuh.site/components/image` 后有客户端逻辑），跟随首页一同 SSR 渲染。

**优化**：用 `next/dynamic` + `IntersectionObserver` 包裹，滚到可视区才加载渲染。

**影响**：首屏以下的内容不会抢占首屏 JS 解析和渲染资源。

### 3.5 年度总结 / 精选项目 section — 保持不动

纯文本列表，无客户端组件，SSR 渲染成本极低，不值得加懒加载复杂度。

## 4. 不改范围

- iconfont（alicdn 外部 CSS）：暂不处理
- 年度总结 section：纯 SSR，不动
- 精选项目 section：纯 SSR，不动
- 全局 `AudioPlayerProvider` / `useExternal` / 分析脚本：不在本次范围

## 任务
### Phase 1：历史任务
- [ ] **Step 1: 从 layout.tsx 移除 JetBrains Mono**
- [ ] **Step 2: 创建 app/post/layout.tsx 按需加载 JetBrains Mono**
- [ ] **Step 3: 验证构建**
- [ ] **Step 4: 提交**
- [ ] **Step 1: 修改 app/styles/index.ts 中的 BookCover**
- [ ] **Step 2: 更新 HomeView.tsx 中 BookCover 的 props**
- [ ] **Step 3: 替换 WereadView.tsx 中的本地 BookCover**
- [ ] **Step 4: 验证构建**
- [ ] **Step 5: 提交**
- [ ] **Step 1: 创建 ContactConfig.ts**
- [ ] **Step 2: 修改 HomeView.tsx — 移除静态 import，改为 next/dynamic**
- [ ] **Step 3: 验证构建**
- [ ] **Step 4: 提交**
- [ ] **Step 1: 创建 LazySection 包装组件**
- [ ] **Step 2: 将微信读书 section 用 LazySection 包裹**
- [ ] **Step 3: 验证构建**
- [ ] **Step 4: 提交**

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: first-screen-optimization
date: 2026-06-15
type: P
status: applied
```

### `design.md`
# 首屏加载优化设计

- **日期**: 2026-06-15
- **项目**: x.wuh.site
- **类型**: 需求 (P)

## 1. 问题分析

首页（`app/page.tsx` → `HomeView.tsx`）首屏加载了以下非必要资源：

**全局层 (`AppProviders` → `layout.tsx`)**:
- JetBrains Mono 字体：已在 root layout 加载，但首页无任何元素引用
- `Dialog` + `ContactCard` + CONTACT_CONFIG（7 个联系方式，~100 行配置）：点击联系按钮才需要，但总是同步渲染

**首页层 (`HomeView.tsx`)**:
- 微信读书 BookCover 使用 CSS `background: url()`，绕过了 `@wuh.site/components/image`（内置懒加载、WebP 转换、骨架屏）
- 首屏以下 3 个 section（年度总结、微信读书、精选项目）同步渲染，其中微信读书 section 含客户端交互

## 2. 设计决策

- **优先消除可见的浪费**：字体只加载用到的，图片用已有基础设施，弹窗按需加载
- **不改基础设施**：不引入新的懒加载库，用 `next/dynamic` + 已有的 `@wuh.site/components/image`
- **不拆 SSR 内容**：年度总结、精选项目纯文本无客户端 JS，保持 SSR

## 3. 优化项

### 3.1 JetBrains Mono 字体 — 移出全局 layout

**现状**：`layout.tsx` 加载 Inter + JetBrains_Mono + Noto_Serif_SC 三个字体，全部应用到 `<body>`。

**优化**：从 `layout.tsx` 移除 JetBrains Mono 的加载和 CSS variable。在用到代码块的页面（博客详情 `app/post/`）通过独立 layout 或页面内 `next/font/google` 单独加载。

**影响**：首页、博客列表、关于、微信读书页不再加载 JetBrains Mono。

### 3.2 BookCover — CSS background → @wuh.site/components/image

**现状**：`app/styles/index.ts` 中 `BookCover` 为 `styled.div`，通过 `background: url($p.$src)` 渲染封面图。

**优化**：改为 `@wuh.site/components/image`，该组件默认 `loading="lazy"`，自带骨架屏、WebP 转换、错误兜底。

**影响**：微信读书封面在首页和 `/weread` 页面实现懒加载 + 优化。

### 3.3 Dialog + ContactCard — next/dynamic 懒加载

**现状**：`HomeView.tsx` 直接 import `Dialog`、`ContactCard`，并在组件内定义 7 个联系方式的 `CONTACT_CONFIG` 对象（~100 行）。无论用户是否点击，弹窗代码都打入首屏 bundle。

**优化**：
- `CONTACT_CONFIG` 移到独立文件（如 `app/components/ContactConfig.ts`）
- 在 `HomeView.tsx` 中用 `next/dynamic` 懒加载 `Dialog` + `ContactCard`
- 点击联系按钮时触发 import

**影响**：首屏不加载弹窗组件，点击时才下载对应 chunk。

### 3.4 微信读书 section — IntersectionObserver + next/dynamic

**现状**：微信读书 section 渲染 `BookCover` 组件（改用 `@wuh.site/components/image` 后有客户端逻辑），跟随首页一同 SSR 渲染。

**优化**：用 `next/dynamic` + `IntersectionObserver` 包裹，滚到可视区才加载渲染。

**影响**：首屏以下的内容不会抢占首屏 JS 解析和渲染资源。

### 3.5 年度总结 / 精选项目 section — 保持不动

纯文本列表，无客户端组件，SSR 渲染成本极低，不值得加懒加载复杂度。

## 4. 不改范围

- iconfont（alicdn 外部 CSS）：暂不处理
- 年度总结 section：纯 SSR，不动
- 精选项目 section：纯 SSR，不动
- 全局 `AudioPlayerProvider` / `useExternal` / 分析脚本：不在本次范围

### `proposal.md`
# 首屏加载优化

消除首页首屏非必要资源加载：移除非必要字体、图片懒加载、弹窗按需加载、首屏以下 section 懒加载。

### `tasks.md`
# 首屏加载优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除首页首屏非必要资源加载 — 移除非必要字体、图片懒加载、弹窗按需加载、首屏以下 section 懒加载

**Architecture:** 4 项独立优化，每项对应一个 task。使用项目已有的 `next/dynamic`、`@wuh.site/components/image`、`IntersectionObserver`，不引入新依赖。

**Tech Stack:** Next.js 15 (App Router), React 19, styled-components, next/dynamic

---

## 文件映射

| Task | 文件 | 操作 | 职责 |
|------|------|------|------|
| 1 | `app/layout.tsx` | 修改 | 移除 JetBrains Mono |
| 1 | `app/post/layout.tsx` | 创建 | 博客页按需加载 JetBrains Mono |
| 2 | `app/styles/index.ts` | 修改 | BookCover 改为 styled(Image) |
| 2 | `app/HomeView.tsx` | 修改 | 更新 BookCover props |
| 2 | `app/weread/WereadView.tsx` | 修改 | 更新 BookCover props + 本地定义 |
| 3 | `app/components/ContactConfig.ts` | 创建 | 提取 CONTACT_CONFIG |
| 3 | `app/HomeView.tsx` | 修改 | Dialog+ContactCard 改为 dynamic import |
| 4 | `app/HomeView.tsx` | 修改 | 微信读书 section 懒加载 |

---

### Task 1: 移除 JetBrains Mono 全局加载，博客页按需加载

**Files:**
- Modify: `packages/wuh.site.next/app/layout.tsx`
- Create: `packages/wuh.site.next/app/post/layout.tsx`

- [ ] **Step 1: 从 layout.tsx 移除 JetBrains Mono**

在 `app/layout.tsx` 中：

删除 import 行：
```diff
- import { Inter, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'
+ import { Inter, Noto_Serif_SC } from 'next/font/google'
```

删除字体定义（12-16 行）：
```diff
- const jetbrainsMono = JetBrains_Mono({
-   subsets: ['latin'],
-   variable: '--font-mono',
-   display: 'swap',
- })
```

从 body className 移除：
```diff
- <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable}`}>
+ <body className={`${inter.variable} ${notoSerifSC.variable}`}>
```

- [ ] **Step 2: 创建 app/post/layout.tsx 按需加载 JetBrains Mono**

新建文件内容：

```tsx
import type { ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default function PostLayout({ children }: { children: ReactNode }) {
  return <div className={jetbrainsMono.variable}>{children}</div>
}
```

- [ ] **Step 3: 验证构建**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm build:next 2>&1 | tail -5
```

Expected: 构建成功，无报错

- [ ] **Step 4: 提交**

```bash
git add packages/wuh.site.next/app/layout.tsx packages/wuh.site.next/app/post/layout.tsx
git commit -m "perf: remove JetBrains Mono from global layout, load only on post pages"
```

---

### Task 2: BookCover 从 CSS background 改为 @wuh.site/components/image

**Files:**
- Modify: `packages/wuh.site.next/app/styles/index.ts` — BookCover 改为 styled(Image)
- Modify: `packages/wuh.site.next/app/HomeView.tsx` — 更新 BookCover props
- Modify: `packages/wuh.site.next/app/weread/WereadView.tsx` — 替换本地 BookCover 定义

- [ ] **Step 1: 修改 app/styles/index.ts 中的 BookCover**

在 `app/styles/index.ts` 顶部添加 import：
```tsx
import Image from '@wuh.site/components/image'
```

找到 BookCover 定义（第 337-343 行），替换为：

```tsx
export const BookCover = styled(Image).attrs({
  showSkeleton: true,
  appearance: 'plain',
})`
  width: 32px;
  height: 42px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
`
```

- [ ] **Step 2: 更新 HomeView.tsx 中 BookCover 的 props**

在 `app/HomeView.tsx` 中（第 244 行），将：

```diff
- <S.BookCover $src={book.cover || undefined} />
+ <S.BookCover src={book.cover || ''} alt={book.title} width={32} height={42} />
```

- [ ] **Step 3: 替换 WereadView.tsx 中的本地 BookCover**

在 `app/weread/WereadView.tsx` 中：

顶部加 import：
```tsx
import Image from '@wuh.site/components/image'
```

替换本地 BookCover 定义：
```diff
- const BookCover = styled.div<{ $src?: string }>`
-   width: 32px;
-   height: 42px;
-   border-radius: 4px;
-   flex-shrink: 0;
-   background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'var(--background-300)')};
-   box-shadow: 0 1px 3px rgba(0,0,0,0.12);
- `
+ const BookCover = styled(Image).attrs({
+   showSkeleton: true,
+   appearance: 'plain',
+ })`
+   width: 32px;
+   height: 42px;
+   border-radius: 4px;
+   flex-shrink: 0;
+   box-shadow: 0 1px 3px rgba(0,0,0,0.12);
+ `
```

更新使用处（第 136 行）：
```diff
- <BookCover $src={book.cover || undefined} />
+ <BookCover src={book.cover || ''} alt={book.title} width={32} height={42} />
```

- [ ] **Step 4: 验证构建**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 5: 提交**

```bash
git add packages/wuh.site.next/app/styles/index.ts packages/wuh.site.next/app/HomeView.tsx packages/wuh.site.next/app/weread/WereadView.tsx
git commit -m "perf: convert BookCover from CSS background to @wuh.site/components/image with lazy loading"
```

---

### Task 3: Dialog + ContactCard + CONTACT_CONFIG 懒加载

**Files:**
- Create: `packages/wuh.site.next/app/components/ContactConfig.ts`
- Modify: `packages/wuh.site.next/app/HomeView.tsx`

- [ ] **Step 1: 创建 ContactConfig.ts**

新建 `app/components/ContactConfig.ts`，将 HomeView.tsx 中的 `CONTACT_CONFIG` 常量（第 29-98 行，约 70 行）完整移入：

```tsx
import type { ContactCardProps } from './ContactCard'

type ContactType = 'wechat' | 'qq' | 'twitter' | 'github' | 'douban' | 'netease' | 'discord'

export type { ContactType }
export type ContactDialogConfig = ContactCardProps

export const CONTACT_CONFIG: Record<ContactType, ContactDialogConfig> = {
  wechat: {
    badge: 'WeChat',
    qrSrc: 'https://cdn.wuh.site/web/wechat.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '工程化 & 可视化',
    tagline: '代码写诗，工具作画',
    hints: ['扫码即可开启一场 1:1 对话', '备注「官网来访」我们会更快相遇'],
  },
  // ... 其余 6 个配置保持完全不变
}
```

- [ ] **Step 2: 修改 HomeView.tsx — 移除静态 import，改为 next/dynamic**

删除静态 import：
```diff
- import Dialog from '@wuh.site/components/dialog'
- import ContactCard, { type ContactCardProps } from './components/ContactCard'
```

添加 dynamic import：
```tsx
import dynamic from 'next/dynamic'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('./components/ContactCard'), {
  loading: () => null,
})
```

删除本地 CONTACT_CONFIG 定义和 ContactDialogConfig 类型（已移到 ContactConfig.ts），改为 import：
```tsx
import { CONTACT_CONFIG, type ContactType, type ContactDialogConfig } from './components/ContactConfig'
```

- [ ] **Step 3: 验证构建**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 4: 提交**

```bash
git add packages/wuh.site.next/app/components/ContactConfig.ts packages/wuh.site.next/app/HomeView.tsx
git commit -m "perf: lazy load Dialog+ContactCard with next/dynamic"
```

---

### Task 4: 微信读书 section 懒加载

**Files:**
- Modify: `packages/wuh.site.next/app/HomeView.tsx`

- [ ] **Step 1: 创建 LazySection 包装组件**

在 `HomeView.tsx` 中添加，放在 `export default function HomeView` 之前：

```tsx
import { useInView } from 'react-intersection-observer'
```

如果项目未安装 `react-intersection-observer`，则使用原生 `IntersectionObserver`：

```tsx
function LazySection({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {visible ? children : <S.SectionSkeleton />}
    </div>
  )
}
```

在 `styles/index.ts` 中添加骨架占位：

```tsx
export const SectionSkeleton = styled.div`
  height: 200px;
  border-radius: var(--radius-md, 8px);
  background: linear-gradient(
    90deg,
    var(--background-200) 25%,
    var(--background-100) 50%,
    var(--background-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`
```

- [ ] **Step 2: 将微信读书 section 用 LazySection 包裹**

在 HomeView.tsx 中，将微信读书 section（`<S.Section>` 含 `<S.SectionHeader>微信读书</S.SectionHeader>` ...）用 `<LazySection>` 包裹：

```tsx
<OrnamentDivider />

<LazySection>
  <S.Section>
    <S.SectionHeader>
      <S.SectionTitle>微信读书</S.SectionTitle>
      {wereadBooks.length > 0 && <S.MoreLink href='/weread'>全部&nbsp;&rarr;</S.MoreLink>}
    </S.SectionHeader>
    {/* ... 微信读书内容保持不变 ... */}
  </S.Section>
</LazySection>

<OrnamentDivider />
```

- [ ] **Step 3: 验证构建**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 4: 提交**

```bash
git add packages/wuh.site.next/app/HomeView.tsx packages/wuh.site.next/app/styles/index.ts
git commit -m "perf: lazy load weread section on homepage with IntersectionObserver"
```

---

## 验收检查

1. **首页加载字体数**: 打开 Chrome DevTools → Network → Font，首页只有 Inter + Noto Serif SC，无 JetBrains Mono
2. **博客页字体**: 打开任意博客详情页，Network 面板出现 JetBrains Mono
3. **BookCover 懒加载**: 首页微信读书封面 `<img loading="lazy">`，非首屏才加载
4. **弹窗懒加载**: 首页 Network 面板无 Dialog/ContactCard chunk，点击联系按钮后才加载
5. **微信读书 section**: 首屏不渲染该 section，滚动接近（200px margin）时才出现
6. **构建无报错**: `pnpm build:next` 成功，`tsc --noEmit` 无错误
