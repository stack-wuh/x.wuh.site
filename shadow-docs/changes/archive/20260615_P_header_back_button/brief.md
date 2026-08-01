# Blog/Weread Header 统一 & 返回首页按钮

> 原始变更名：`20260615_P_header_back_button`

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
# Blog/Weread Header 统一 & 返回首页按钮重设计

日期：2026-06-15 | 类型：需求 | 状态：approved

## 目标

统一 blog 和 weread 页面的 Header 布局，用现有 Button 组件实现"精致考究"的返回首页交互，替换当前过于简洁的纯文字链接。

## 范围

- **改**: blog 页 Header、weread 页 Header、新增共享组件
- **不改**: Button 组件本身、Post 详情页、SiteHeader 全局导航栏

## 设计

### 交互风格

"精致考究"——有视觉存在感但不喧宾夺主，过渡动画顺滑。hover 时图标微移、下划线淡入。

### 布局统一

blog 和 weread 的页面 Header 统一为"标题左、返回按钮右"的水平排列：

```
[标题 + 副标题]                    [← 返回首页]
```

### BackHomeLink 组件

新增 `app/components/BackHomeLink/`，用现有 Button 组件封装：

```tsx
<BackHomeLink href="/" label="返回首页" />
```

视觉规格：

| 属性 | 值 |
|------|-----|
| Button variant | text |
| Button color | secondary |
| 图标 | IconChevronLeft (14px) |
| 字号 | 13px |
| 字重 | 450 |
| 默认色 | #78716c (中性灰) |
| 内边距 | 6px 4px |
| 底部装饰线 | 1.5px transparent → hover primary |

交互状态：

| 状态 | 效果 |
|------|------|
| 默认 | 图标 + 文字，中性灰，无下划线 |
| hover | 图标右移 3px，底部 primary 色下划线淡入，文字色微暖 |
| active | 图标位移回弹 |
| focus-visible | 2px primary outline + 2px offset |
| prefers-reduced-motion | 禁用所有动画 |

### PageHeader 共享布局

新增 `app/components/PageHeader/`，从 blog/styles 提取：

- `Header` — 水平 flex，space-between
- `TitleGroup` — 标题 + 副标题列
- `Title` — h1，serif，xl
- `Subtitle` — muted text
- `HeaderActions` — 右侧操作区 flex

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/components/PageHeader/styles.ts` | 新增 | 共享 Header 布局组件 |
| `app/components/BackHomeLink/index.tsx` | 新增 | 返回首页链接 |
| `app/blog/styles/index.ts` | 修改 | 删除提取出的组件，从 PageHeader 重导出 |
| `app/blog/BlogListView.tsx` | 修改 | BackLink → BackHomeLink |
| `app/weread/WereadView.tsx` | 修改 | 改为水平 Header，引入 PageHeader + BackHomeLink |

## 任务
### Phase 1：历史任务
- [ ] **Step 1: 创建 PageHeader/styles.ts**
- [ ] **Step 2: 验证类型检查**
- [ ] **Step 1: 创建 BackHomeLink/index.tsx**
- [ ] **Step 2: 验证类型检查**
- [ ] **Step 1: 更新 blog/styles/index.ts**
- [ ] **Step 2: 更新 BlogListView.tsx**
- [ ] **Step 3: 验证类型检查**
- [ ] **Step 1: 更新 WereadView.tsx**
- [ ] **Step 2: 验证类型检查**
- [ ] **Step 1: 完整类型检查**
- [ ] **Step 2: 启动前端开发服务器，手动验证两个页面**

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: header-back-button
date: 2026-06-15
type: P
status: applied
```

### `design.md`
# Blog/Weread Header 统一 & 返回首页按钮重设计

日期：2026-06-15 | 类型：需求 | 状态：approved

## 目标

统一 blog 和 weread 页面的 Header 布局，用现有 Button 组件实现"精致考究"的返回首页交互，替换当前过于简洁的纯文字链接。

## 范围

- **改**: blog 页 Header、weread 页 Header、新增共享组件
- **不改**: Button 组件本身、Post 详情页、SiteHeader 全局导航栏

## 设计

### 交互风格

"精致考究"——有视觉存在感但不喧宾夺主，过渡动画顺滑。hover 时图标微移、下划线淡入。

### 布局统一

blog 和 weread 的页面 Header 统一为"标题左、返回按钮右"的水平排列：

```
[标题 + 副标题]                    [← 返回首页]
```

### BackHomeLink 组件

新增 `app/components/BackHomeLink/`，用现有 Button 组件封装：

```tsx
<BackHomeLink href="/" label="返回首页" />
```

视觉规格：

| 属性 | 值 |
|------|-----|
| Button variant | text |
| Button color | secondary |
| 图标 | IconChevronLeft (14px) |
| 字号 | 13px |
| 字重 | 450 |
| 默认色 | #78716c (中性灰) |
| 内边距 | 6px 4px |
| 底部装饰线 | 1.5px transparent → hover primary |

交互状态：

| 状态 | 效果 |
|------|------|
| 默认 | 图标 + 文字，中性灰，无下划线 |
| hover | 图标右移 3px，底部 primary 色下划线淡入，文字色微暖 |
| active | 图标位移回弹 |
| focus-visible | 2px primary outline + 2px offset |
| prefers-reduced-motion | 禁用所有动画 |

### PageHeader 共享布局

新增 `app/components/PageHeader/`，从 blog/styles 提取：

- `Header` — 水平 flex，space-between
- `TitleGroup` — 标题 + 副标题列
- `Title` — h1，serif，xl
- `Subtitle` — muted text
- `HeaderActions` — 右侧操作区 flex

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/components/PageHeader/styles.ts` | 新增 | 共享 Header 布局组件 |
| `app/components/BackHomeLink/index.tsx` | 新增 | 返回首页链接 |
| `app/blog/styles/index.ts` | 修改 | 删除提取出的组件，从 PageHeader 重导出 |
| `app/blog/BlogListView.tsx` | 修改 | BackLink → BackHomeLink |
| `app/weread/WereadView.tsx` | 修改 | 改为水平 Header，引入 PageHeader + BackHomeLink |

### `proposal.md`
# Blog/Weread Header 统一 & 返回首页按钮

统一 blog 和 weread 页面的 Header 布局，用现有 Button 组件实现精致的返回首页按钮，替换纯文字链接。

### `tasks.md`
# Blog/Weread Header 统一 & 返回首页按钮 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一 blog 和 weread 页面的 Header 布局，用现有 Button 组件实现精致的返回首页按钮

**Architecture:** 从 blog/styles 提取共享 Header 布局组件到 `PageHeader/styles.ts`，新建 `BackHomeLink` 组件封装 Button + 动画，blog 和 weread 页面共用

**Tech Stack:** Next.js 15 App Router, React 19, styled-components 6, TypeScript 5

**Spec:** `docs/superpowers/specs/2026-06-15-header-back-button-design.md`

---

### Task 1: 创建共享 PageHeader 布局组件

**Files:**
- Create: `packages/wuh.site.next/app/components/PageHeader/styles.ts`
- Source: `packages/wuh.site.next/app/blog/styles/index.ts:32-66` (提取)

将 blog/styles 中的 Header/TitleGroup/Title/Subtitle/HeaderActions 提取为共享组件。

- [ ] **Step 1: 创建 PageHeader/styles.ts**

```ts
import styled from '@wuh.site/components/styled'

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
```

- [ ] **Step 2: 验证类型检查**

```bash
pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -20
```

Expected: `PageHeader/styles.ts` 无类型错误

---

### Task 2: 创建 BackHomeLink 组件

**Files:**
- Create: `packages/wuh.site.next/app/components/BackHomeLink/index.tsx`

封装现有 Button 组件，添加箭头图标 + hover 动画（图标右移 + 下划线淡入）。

- [ ] **Step 1: 创建 BackHomeLink/index.tsx**

```tsx
'use client'

import styled from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { IconChevronLeft } from '@wuh.site/components/icons'

const Wrapper = styled.span`
  display: inline-flex;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 1.5px;
    background: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.25s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover .button-icon {
    transform: translateX(3px);
  }

  .button-icon {
    transition: transform 0.25s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after,
    .button-icon {
      transition: none;
    }
  }
`

type Props = {
  href: string
  label?: string
}

export default function BackHomeLink({ href, label = '返回首页' }: Props) {
  return (
    <Wrapper>
      <Button
        href={href}
        variant='text'
        color='secondary'
        size='small'
        icon={<IconChevronLeft />}
        iconPosition='left'
      >
        {label}
      </Button>
    </Wrapper>
  )
}
```

- [ ] **Step 2: 验证类型检查**

```bash
pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -20
```

Expected: `BackHomeLink/index.tsx` 无类型错误

---

### Task 3: 更新 Blog 页面

**Files:**
- Modify: `packages/wuh.site.next/app/blog/styles/index.ts`
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx`

blog/styles 中移除已被提取的 Header 系列组件和 BackLink，改为从 PageHeader 重导出。BlogListView 中将 BackLink 替换为 BackHomeLink。

- [ ] **Step 1: 更新 blog/styles/index.ts**

删除第 32-73 行的 Header/TitleGroup/Title/Subtitle/HeaderActions/BackLink 定义，改为从 PageHeader 重导出。

```ts
import styled from '@wuh.site/components/styled'
import Link from 'next/link'

// Header 布局系列从共享组件重导出
export { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'

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

- [ ] **Step 2: 更新 BlogListView.tsx**

将 `S.BackLink` 替换为 `BackHomeLink`。

```tsx
'use client'

import { useMemo } from 'react'
import Tag from '@wuh.site/components/tag'
import Pagination from '@wuh.site/components/pagination'
import BackHomeLink from '@/app/components/BackHomeLink'
import TitleWithTooltip from './components/TitleWithTooltip'
import type { PostListItem } from '@wuh.site/shared-contracts'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type Props = {
  posts: PostListItem[]
  pagination: { currentPage: number; lastPage: number }
}

const groupByYear = (posts: PostListItem[]) => {
  const map = new Map<number, PostListItem[]>()
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
            <BackHomeLink href='/' />
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

- [ ] **Step 3: 验证类型检查**

```bash
pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -30
```

Expected: 无类型错误

---

### Task 4: 更新 Weread 页面

**Files:**
- Modify: `packages/wuh.site.next/app/weread/WereadView.tsx`

Header 从垂直布局改为水平布局，引入 PageHeader + BackHomeLink 统一风格。删除不再需要的 BackLink 内联样式和 Link import。

- [ ] **Step 1: 更新 WereadView.tsx**

```tsx
'use client'

import styled from '@wuh.site/components/styled'
import Pagination from '@wuh.site/components/pagination'
import Image from '@wuh.site/components/image'
import BackHomeLink from '@/app/components/BackHomeLink'
import { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'
import type { WereadBook } from '@wuh.site/shared-contracts'

type Props = {
  books: WereadBook[]
  total: number
  currentPage: number
  totalPages: number
}

const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

const BookCover = styled(Image).attrs({
  showSkeleton: true,
  appearance: 'plain',
})`
  width: 40px;
  height: 54px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`

const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`

const CountTag = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;
`

const Empty = styled.div`
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-2xl) 0;
  font-size: var(--font-size-sm);
`

export default function WereadView({ books, total, currentPage, totalPages }: Props) {
  const reading = books.filter((b) => !b.finishReading)
  const finished = books.filter((b) => b.finishReading)

  return (
    <Root>
      <Main>
        <Header>
          <TitleGroup>
            <Title>微信读书</Title>
            <Subtitle>共 {total} 本书，本页 {reading.length} 本在读 · {finished.length} 本已读完</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <BackHomeLink href='/' />
          </HeaderActions>
        </Header>

        {books.length === 0 ? (
          <Empty>书架暂无数据</Empty>
        ) : (
          <BookList>
            {books.map((book) => (
              <BookRow key={book.bookId}>
                <BookCover src={book.cover || ''} alt={book.title} width={40} height={54} />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</BookMeta>
                </BookInfo>
                <CountTag>
                  {new Date(book.readUpdateTime * 1000).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </CountTag>
              </BookRow>
            ))}
          </BookList>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getPageUrl={(page) => (page <= 1 ? '/weread' : `/weread?page=${page}`)}
        />
      </Main>
    </Root>
  )
}
```

- [ ] **Step 2: 验证类型检查**

```bash
pnpm exec tsc --noEmit --project packages/wuh.site.next/tsconfig.json 2>&1 | head -30
```

Expected: 无类型错误

---

### Task 5: 最终验证

- [ ] **Step 1: 完整类型检查**

```bash
pnpm exec tsc --noEmit 2>&1
```

Expected: 零错误

- [ ] **Step 2: 启动前端开发服务器，手动验证两个页面**

```bash
pnpm dev:next
```

检查点：
- Blog 页 (`/blog`)：Header 标题左、"← 返回首页"按钮右，hover 时箭头右移 + 下划线出现
- Weread 页 (`/weread`)：Header 标题左、"← 返回首页"按钮右，布局与 blog 一致，hover 效果一致
- 两个页面的按钮视觉、动画、间距完全一致
- `prefers-reduced-motion` 时动画禁用
- focus-visible 时有 outline
