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
