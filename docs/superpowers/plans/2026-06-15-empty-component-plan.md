# Empty 组件增强 + 全站空状态统一 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给 Empty 组件新增 `actions` 按钮能力，统一替换全站散落的 6 处空状态为共享 Empty 组件

**Architecture:** 扩展 `@wuh.site/components/empty` 的 Props + 渲染逻辑，新增 4 个图标，替换 3 个页面的 6 处空状态

**Tech Stack:** React 19, styled-components, lucide-react, @wuh.site/components/button

---

## 文件映射

| Task | 文件 | 操作 | 职责 |
|------|------|------|------|
| 1 | `packages/components/empty/index.tsx` | 修改 | 新增 `actions` prop + ActionItem 类型 + 渲染 |
| 1 | `packages/components/icons/index.tsx` | 修改 | 新增 BookOpen/Calendar/Library/FolderGit2 |
| 2 | `packages/wuh.site.next/app/HomeView.tsx` | 修改 | 4 个 EmptyHint → Empty |
| 2 | `packages/wuh.site.next/app/styles/index.ts` | 修改 | 删除 EmptyHint |
| 3 | `packages/wuh.site.next/app/blog/BlogListView.tsx` | 修改 | 1 个 EmptyHint → Empty |
| 3 | `packages/wuh.site.next/app/blog/styles/index.ts` | 修改 | 删除 EmptyHint |
| 4 | `packages/wuh.site.next/app/weread/WereadView.tsx` | 修改 | 本地 Empty → 共享 Empty |

---

### Task 1: Empty 组件新增 actions prop + 新增图标

**Files:**
- Modify: `packages/components/empty/index.tsx`
- Modify: `packages/components/icons/index.tsx`

- [ ] **Step 1: 在 Empty 组件中添加 ActionItem 类型 + actions prop + 渲染逻辑**

编辑 `packages/components/empty/index.tsx`：

**1a.** 在现有 import 后添加 Button import：
```tsx
import Button, { type ButtonColor, type ButtonVariant } from '../button'
```

**1b.** 在 `EmptyDescription` styled 组件后添加 Actions wrapper：
```tsx
const EmptyActions = styled.div`
  margin-top: var(--space-xs, 8px);
  display: flex;
  gap: var(--space-xs, 8px);
  flex-wrap: wrap;
  justify-content: center;
`
```

**1c.** 在 `EmptyProps` 接口前添加 ActionItem 类型，并扩展接口：
```tsx
export interface ActionItem {
  label: string
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  color?: ButtonColor
}

export interface EmptyProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: ActionItem[]
}
```

**1d.** 在 `Empty` 组件的 return 中，`{resolvedDescription ...}` 之后、`</EmptyRoot>` 之前插入 actions 渲染：
```tsx
      {actions && actions.length > 0 && (
        <EmptyActions>
          {actions.map((action, i) => (
            <Button
              key={i}
              href={action.href}
              onClick={action.onClick}
              variant={action.variant ?? 'outlined'}
              color={action.color ?? 'primary'}
              size='small'
            >
              {action.label}
            </Button>
          ))}
        </EmptyActions>
      )}
```

- [ ] **Step 2: 在 icons/index.tsx 中新增 4 个图标**

编辑 `packages/components/icons/index.tsx`，在 lucide-react 的状态图标 export 块中添加：

```tsx
export {
  Info as IconInfo,
  CircleCheck as IconSuccess,
  TriangleAlert as IconWarning,
  CircleX as IconError,
  PackageOpen as IconEmpty,
  Image as IconFallbackImage,
  Compass as IconCompass,
  Clock as IconClock,
  Folder as IconFolder,
  ShieldCheck as IconShield,
  Tag as IconTag,
  BookOpen as IconBookOpen,
  Calendar as IconCalendar,
  Library as IconLibrary,
  FolderGit2 as IconFolderGit2
} from 'lucide-react'
```

- [ ] **Step 3: 验证类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 4: 提交**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/components/empty/index.tsx packages/components/icons/index.tsx
git commit -m "feat(empty): add actions prop with Button support, add BookOpen/Calendar/Library/FolderGit2 icons"
```

---

### Task 2: HomeView 4 个 EmptyHint → Empty + 删除 EmptyHint 样式

**Files:**
- Modify: `packages/wuh.site.next/app/HomeView.tsx`
- Modify: `packages/wuh.site.next/app/styles/index.ts`

- [ ] **Step 1: 更新 HomeView.tsx**

**1a.** 添加 import：
```tsx
import Empty from '@wuh.site/components/empty'
import { IconBookOpen, IconCalendar, IconLibrary, IconFolderGit2 } from '@wuh.site/components/icons'
```

**1b.** 替换 4 个 EmptyHint：

精选博客（~178行）：
```diff
- <S.EmptyHint>暂时无法获取 Issues 数据</S.EmptyHint>
+ <Empty icon={<IconBookOpen />} title="暂无博客" description="获取 Issues 数据失败，请稍后重试" />
```

年度总结（~215行）：
```diff
- <S.EmptyHint>暂无年度总结</S.EmptyHint>
+ <Empty icon={<IconCalendar />} title="暂无年度总结" description="还没有年度回顾文章" />
```

微信读书（~239行）：
```diff
- <S.EmptyHint>暂无书架数据</S.EmptyHint>
+ <Empty icon={<IconLibrary />} title="暂无书架" description="微信读书同步后这里会展示" actions={[{ label: '去看看书架', href: '/weread' }]} />
```

精选项目（~262行）：
```diff
- <S.EmptyHint>暂时无法获取 GitHub 数据</S.EmptyHint>
+ <Empty icon={<IconFolderGit2 />} title="暂无项目" description="获取 GitHub 数据失败，请稍后重试" />
```

- [ ] **Step 2: 删除 app/styles/index.ts 中的 EmptyHint 定义**

删除 `export const EmptyHint = styled.div...` 整个定义块（~315-335行附近的 EmptyHint）。

- [ ] **Step 3: 验证类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 4: 提交**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.next/app/HomeView.tsx packages/wuh.site.next/app/styles/index.ts
git commit -m "refactor: replace 4 EmptyHints on homepage with shared Empty component"
```

---

### Task 3: BlogListView EmptyHint → Empty

**Files:**
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx`
- Modify: `packages/wuh.site.next/app/blog/styles/index.ts`

- [ ] **Step 1: 更新 BlogListView.tsx**

**1a.** 添加 import：
```tsx
import Empty from '@wuh.site/components/empty'
import { IconBookOpen } from '@wuh.site/components/icons'
```

**1b.** 替换 EmptyHint（~51行）：
```diff
- <S.EmptyHint>暂时没有可展示的博客内容</S.EmptyHint>
+ <Empty icon={<IconBookOpen />} title="暂无内容" description="暂时没有可展示的博客" actions={[{ label: '返回首页', href: '/' }]} />
```

- [ ] **Step 2: 删除 blog/styles/index.ts 中的 EmptyHint 定义**

删除 `export const EmptyHint = styled.div...` 整个定义块。

- [ ] **Step 3: 验证类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 4: 提交**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.next/app/blog/BlogListView.tsx packages/wuh.site.next/app/blog/styles/index.ts
git commit -m "refactor: replace blog EmptyHint with shared Empty component"
```

---

### Task 4: WereadView 本地 Empty → 共享 Empty

**Files:**
- Modify: `packages/wuh.site.next/app/weread/WereadView.tsx`

- [ ] **Step 1: 更新 WereadView.tsx**

**1a.** 添加 import：
```tsx
import Empty from '@wuh.site/components/empty'
import { IconLibrary } from '@wuh.site/components/icons'
```

**1b.** 删除本地 Empty 定义（第113-118行）：
```diff
- const Empty = styled.div`
-   text-align: center;
-   color: var(--text-muted);
-   padding: var(--space-2xl) 0;
-   font-size: var(--font-size-sm);
- `
```

**1c.** 替换使用处（~134行）：
```diff
- <Empty>书架暂无数据</Empty>
+ <Empty icon={<IconLibrary />} title="书架为空" description="暂无同步的书籍数据" />
```

- [ ] **Step 2: 验证类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: 无 TS 错误

- [ ] **Step 3: 提交**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.next/app/weread/WereadView.tsx
git commit -m "refactor: replace weread local Empty with shared Empty component"
```

---

## 验收检查

1. `pnpm exec tsc --noEmit` 无错误
2. `pnpm build:next` 构建成功
3. 首页 4 个 section 数据为空时，各显示带图标+标题+描述的 Empty 组件
4. 微信读书空状态有「去看看书架」按钮，点击可跳转
5. 博客列表空状态有「返回首页」按钮
6. 微信读书页空状态使用共享 Empty
