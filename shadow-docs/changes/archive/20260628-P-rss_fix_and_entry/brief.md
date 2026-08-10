# RSS 修复 + 前端订阅入口

> 原始变更名：`20260628_P_rss_fix_and_entry`

## 元数据
- 日期：2026-06-28
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
RSS 模块已存在（`/v2/rss.xml`），但有两处 Bug + 前端没有入口：

1. 链接格式是 `/posts/slug` 而不是当前的 `/post/123-标题slug`
2. 没过滤 `state`，可能输出 closed issue

## 引用规范
- `specs/rss/spec.md`

## 决策
# 设计文档

## rss.service.ts 修复

```ts
// 修复前
link: `https://wuh.site/posts/${content.metadata?.slug || content.number}`

// 修复后
link: `https://wuh.site/post/${content.number}-${toSlug(content.title)}`

// 新增 state 过滤
state: 'open'
```

## layout.tsx <head> RSS link

```tsx
<link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/v2/rss.xml" />
```

## footer.tsx RSS 入口

在页脚加 RSS 订阅链接。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 旧 RSS URL 不变

## 任务
### Phase 1: 后端修复
- [ ] **文件:** `packages/wuh.site.nest/src/modules/rss/rss.service.ts`
- [ ] 链接 `/posts/slug` → `/post/number-标题slug`
- [ ] 查询加 `state: 'open'` 过滤
- [ ] **预计耗时:** 10 min
### Phase 2: 前端入口
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] `<head>` 加 `<link rel="alternate" type="application/rss+xml">`
- [ ] **预计耗时:** 5 min
- [ ] **文件:** `packages/components/layout/footer.tsx`
- [ ] 加 RSS 订阅链接
- [ ] **预计耗时:** 5 min
- [ ] `/v2/rss.xml` 返回正确链接格式 + 仅 open issues
- [ ] 页面 `<head>` 有 RSS link 标签
- [ ] 页脚有 RSS 订阅入口

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: rss-fix-and-entry
date: 2026-06-28
type: P
status: proposed
```

### `design.md`
# 设计文档

## rss.service.ts 修复

```ts
// 修复前
link: `https://wuh.site/posts/${content.metadata?.slug || content.number}`

// 修复后
link: `https://wuh.site/post/${content.number}-${toSlug(content.title)}`

// 新增 state 过滤
state: 'open'
```

## layout.tsx <head> RSS link

```tsx
<link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/v2/rss.xml" />
```

## footer.tsx RSS 入口

在页脚加 RSS 订阅链接。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 旧 RSS URL 不变

### `proposal.md`
# RSS 修复 + 前端订阅入口

## 背景

RSS 模块已存在（`/v2/rss.xml`），但有两处 Bug + 前端没有入口：

1. 链接格式是 `/posts/slug` 而不是当前的 `/post/123-标题slug`
2. 没过滤 `state`，可能输出 closed issue

## 目标

- 修复链接格式、加 state 过滤
- 前端 `<head>` 加 RSS `<link>` 标签（搜索引擎和 RSS 阅读器自动发现）
- footer 加 RSS 订阅入口

## 非目标

- 不新增定时同步
- 不新增依赖

## 影响范围

- `packages/wuh.site.nest/src/modules/rss/rss.service.ts` — 修复链接 + state 过滤
- `packages/wuh.site.next/app/layout.tsx` — <head> RSS <link>
- `packages/components/layout/footer.tsx` — RSS 订阅入口

### `specs/rss/spec.md`
# RSS

## MODIFIED

### Requirement: RSS feed URL 格式
- **GIVEN** 博客详情页链接格式为 `/post/<number>-<title-slug>`
- **WHEN** 生成 RSS feed
- **THEN** item link 格式为 `https://wuh.site/post/<number>-<title-slug>`
- **AND** 不再使用 `/posts/<slug>` 旧格式

### Requirement: RSS 仅输出已发布内容
- **GIVEN** 数据库中存在 open 和 closed 的 Issue
- **WHEN** 生成 RSS feed
- **THEN** 仅查询 `state: 'open'` 的内容

## ADDED

### Requirement: 前端 RSS 自动发现
- **GIVEN** 任意页面
- **WHEN** 浏览器或 RSS 阅读器访问
- **THEN** `<head>` 包含 `<link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/v2/rss.xml">`
- **AND** 页脚有 RSS 订阅入口链接

### `tasks.md`
# 任务清单

## Phase 1: 后端修复

### Task 1: 修复 rss.service.ts

- [ ] **文件:** `packages/wuh.site.nest/src/modules/rss/rss.service.ts`
- [ ] 链接 `/posts/slug` → `/post/number-标题slug`
- [ ] 查询加 `state: 'open'` 过滤
- [ ] **预计耗时:** 10 min

## Phase 2: 前端入口

### Task 2: layout.tsx 加 RSS <link>

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] `<head>` 加 `<link rel="alternate" type="application/rss+xml">`
- [ ] **预计耗时:** 5 min

### Task 3: footer.tsx 加 RSS 入口

- [ ] **文件:** `packages/components/layout/footer.tsx`
- [ ] 加 RSS 订阅链接
- [ ] **预计耗时:** 5 min

## 验收

- [ ] `/v2/rss.xml` 返回正确链接格式 + 仅 open issues
- [ ] 页面 `<head>` 有 RSS link 标签
- [ ] 页脚有 RSS 订阅入口
