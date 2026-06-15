# Empty 组件增强 + 全站空状态统一设计

- **日期**: 2026-06-15
- **项目**: x.wuh.site
- **类型**: 需求 (P)

## 1. 问题分析

`@wuh.site/components/empty` 已存在，支持 `icon` / `title` / `description`，但缺失 `actions` 按钮能力。同时多处页面用各自的 `<S.EmptyHint>` 或本地 `<Empty>` 展示空状态，未复用公共组件。

**散落位置**：

| 位置 | 当前实现 | 问题 |
|------|---------|------|
| 首页·精选博客 | `<S.EmptyHint>` | 无图标/按钮 |
| 首页·年度总结 | `<S.EmptyHint>` | 同上 |
| 首页·微信读书 | `<S.EmptyHint>` | 同上 |
| 首页·精选项目 | `<S.EmptyHint>` | 同上 |
| 博客列表 | `<S.EmptyHint>` | 同上 |
| 微信读书页 | 本地 `styled.div` | 完全未复用 |

## 2. 设计决策

- **增强而非重写**：在现有 Empty 组件上加 `actions` prop，不改变已有 API
- **复用 Button**：actions 内部使用 `@wuh.site/components/button`，保持按钮样式一致
- **各自定制**：每个业务空状态使用不同的 icon + title + description

## 3. Empty 组件 Props 扩展

在 `packages/components/empty/index.tsx` 新增：

```tsx
interface ActionItem {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'filled' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

// EmptyProps 新增
actions?: ActionItem[]
```

渲染逻辑：当 `actions` 存在时，在 description 下方渲染一组 Button，gap 间距与组件 gap 一致。

## 4. 替换清单

| 位置 | icon | title | description | actions |
|------|------|-------|-------------|---------|
| 首页·精选博客 | `BookOpen` | 暂无博客 | 获取 Issues 数据失败，请稍后重试 | — |
| 首页·年度总结 | `Calendar` | 暂无年度总结 | 还没有年度回顾文章 | — |
| 首页·微信读书 | `Library` | 暂无书架 | 微信读书同步后这里会展示 | 去看看书架 → `/weread` |
| 首页·精选项目 | `FolderGit2` | 暂无项目 | 获取 GitHub 数据失败，请稍后重试 | — |
| 博客列表 | `BookOpen` | 暂无内容 | 暂时没有可展示的博客 | 返回首页 → `/` |
| 微信读书页 | `Library` | 书架为空 | 暂无同步的书籍数据 | — |

## 5. 文件改动

```
packages/components/empty/index.tsx              → 新增 actions prop + 渲染逻辑
packages/components/icons/index.tsx              → 新增 BookOpen/Calendar/Library/FolderGit2 图标
packages/wuh.site.next/app/HomeView.tsx          → 4 个 EmptyHint 改为 Empty
packages/wuh.site.next/app/blog/BlogListView.tsx → 1 个 EmptyHint 改为 Empty
packages/wuh.site.next/app/weread/WereadView.tsx → 本地 Empty 改为共享 Empty
packages/wuh.site.next/app/styles/index.ts       → 删除 EmptyHint 定义
packages/wuh.site.next/app/blog/styles/index.ts  → 删除 EmptyHint 定义
```

## 6. 不改范围

- `post/PostView.tsx` 已使用 `StatusEmpty`（styled(Empty)），保持不变
- `post/[number]/error.tsx` 使用不同组件（Result），不动
- 其余 EmptyHint 之外的样式不动
