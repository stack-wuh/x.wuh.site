# 博客 URL 添加标题 slug 提升 SEO

> 原始变更名：`20260627_P_blog_url_slug_seo`

## 元数据
- 日期：2026-06-27
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前博客详情页 URL 格式为 `/post/123`，仅包含文章编号。搜索引擎和用户无法从 URL 中获取内容信息，不利于 SEO 排名和用户分享体验。

## 引用规范
- `specs/seo/spec.md`

## 决策
路由结构不变，`/post/[number]` 路由保持不变。链接生成时将标题 slug 拼接到 number 后面，形成 `/post/123-标题slug` 格式。`page.tsx` 从 param 中提取数字部分。

```
首页 / HomeView         博客列表 / BlogListView
    │                        │
    └── /post/123-标题slug ◄─┘
              │
    page.tsx 解析 param → "123-标题slug".split("-")[0] → "123"
              │
              └── getIssue(123) → 后端 API 不变
```

| 维度 | 选择 | 理由 |
|------|------|------|
| Slug 生成 | 中文字符直接保留 | 中文 URL 在现代浏览器和搜索引擎中已成熟支持 |
| 路由变更 | 不动路由结构 | 最小改动，零破坏性 |
| 特殊字符处理 | 替换为 `-`，连续去重 | 保证 URL 整洁 |

## 任务
### Phase 1: 基础工具
- [ ] **文件:** `packages/wuh.site.next/app/lib/slug.ts`
- [ ] 实现 `toSlug(title)` — 中文直留，特殊字符 → `-`，连续压缩
- [ ] 实现 `buildPostUrl(number, title)` — 拼接 `/post/${number}-${slug}`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 单元测试兼容性手动验证
### Phase 2: 核心改造
- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`
- [ ] `params.number` 解析改为 `split('-')[0]` 提取数字
- [ ] 更新 `generateMetadata` 中的 canonical URL 包含 slug
- [ ] **预计耗时:** 20 min
- [ ] **验证:** `npx tsc --noEmit` 零错误，`/post/123` 和 `/post/123-任意标题` 均正常渲染
- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 精选博客 PostRow 链接改为 `buildPostUrl(post.number, post.title)`（第 145 行）
- [ ] 年度总结 PostRow 链接改为 `buildPostUrl(item.number, item.title)`（第 179 行）
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [ ] PostRow 链接改为 `buildPostUrl(post.number, post.title)`（第 61 行）
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostToolbar.tsx`
- [ ] 上一篇/下一篇链接加 slug
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误
### Phase 3: 验证
- [ ] 启动 `pnpm dev:next`
- [ ] 首页 → 点击博客链接 → URL 包含标题 slug
- [ ] 博客列表 → 点击博客链接 → URL 包含标题 slug
- [ ] 详情页 → 上下篇导航 → URL 包含标题 slug
- [ ] 直接用 `/post/123` 访问 → 正常渲染（不 404）
- [ ] **预计耗时:** 15 min
- [ ] 所有博客详情页 URL 包含中文标题 slug
- [ ] 旧格式 `/post/123` 仍可访问
- [ ] `npx tsc --noEmit` 零错误
- [ ] `npx eslint` 零新增警告

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: blog-url-slug-seo
date: 2026-06-27
type: P
status: proposed
```

### `design.md`
# 设计文档

## 架构

路由结构不变，`/post/[number]` 路由保持不变。链接生成时将标题 slug 拼接到 number 后面，形成 `/post/123-标题slug` 格式。`page.tsx` 从 param 中提取数字部分。

```
首页 / HomeView         博客列表 / BlogListView
    │                        │
    └── /post/123-标题slug ◄─┘
              │
    page.tsx 解析 param → "123-标题slug".split("-")[0] → "123"
              │
              └── getIssue(123) → 后端 API 不变
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Slug 生成 | 中文字符直接保留 | 中文 URL 在现代浏览器和搜索引擎中已成熟支持 |
| 路由变更 | 不动路由结构 | 最小改动，零破坏性 |
| 特殊字符处理 | 替换为 `-`，连续去重 | 保证 URL 整洁 |

## 组件/模块设计

### Slug 工具函数 `app/lib/slug.ts`

```ts
export function toSlug(title: string): string {
  return title
    .replace(/[#?&/\\]/g, '-')   // URL 敏感字符 → -
    .replace(/-+/g, '-')          // 连续 - 压缩
    .replace(/^-|-$/g, '')        // 去除首尾 -
}

export function buildPostUrl(number: number | string, title: string): string {
  return `/post/${number}-${toSlug(title)}`
}
```

### page.tsx 参数解析

```ts
const rawNumber = (await params).number
const number = rawNumber.split('-')[0]
```

### 链接生成

所有指向 `/post/${number}` 的链接统一使用 `buildPostUrl(post.number, post.title)`。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（路由不变，`/post/123` 仍可访问）
- **向后兼容:** `/post/123` 仍正常渲染（param 提取第一个 `-` 前的数字）
- **性能影响:** slug 函数为纯字符串操作，零性能影响

### `proposal.md`
# 博客 URL 添加标题 slug 提升 SEO

## 背景

当前博客详情页 URL 格式为 `/post/123`，仅包含文章编号。搜索引擎和用户无法从 URL 中获取内容信息，不利于 SEO 排名和用户分享体验。

## 目标

- 博客详情页 URL 包含文章标题 slug，格式为 `/post/123-标题slug`
- 首页、博客列表页、详情页导航中的链接全部使用新 URL 格式
- 不改变路由结构，不改变后端 API

## 非目标（明确不做）

- 不改变 Next.js 路由目录结构
- 不添加服务端重定向逻辑
- 不处理历史 URL 的 301（后续迭代）
- 不修改 API 接口

## 影响范围

- `packages/wuh.site.next/app/post/[number]/page.tsx` — param 解析从数字改为 "数字-标题slug"
- `packages/wuh.site.next/app/HomeView.tsx` — 博客链接加 slug
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 博客链接加 slug
- `packages/wuh.site.next/app/post/components/PostToolbar.tsx` — 上下篇导航链接加 slug
- `packages/wuh.site.next/app/lib/slug.ts` — 新增 slug 工具函数

### `specs/seo/spec.md`
# SEO

## ADDED

### Requirement: 博客 URL 包含标题 slug
- **GIVEN** 首页或博客列表页展示博客文章列表
- **WHEN** 用户或搜索引擎抓取链接
- **THEN** 博客详情页链接格式为 `/post/<number>-<title-slug>`
- **AND** slug 中保留中文字符，URL 敏感字符（`#`、`?`、`&`、`/`、`\`）替换为 `-`
- **AND** 连续的 `-` 压缩为单个 `-`

### Requirement: 旧 URL 格式向后兼容
- **GIVEN** 存在历史链接 `/post/123`（无 slug）
- **WHEN** 用户访问该链接
- **THEN** 页面正常渲染，不 404

## MODIFIED

### Requirement: canonical URL
- **GIVEN** 博客详情页
- **WHEN** 搜索引擎索引
- **THEN** canonical URL 包含标题 slug，格式为 `https://wuh.site/post/<number>-<slug>`
- **AND** slug 来源于文章标题

### `tasks.md`
# 任务清单

## Phase 1: 基础工具

### Task 1: 新建 slug 工具函数

- [ ] **文件:** `packages/wuh.site.next/app/lib/slug.ts`
- [ ] 实现 `toSlug(title)` — 中文直留，特殊字符 → `-`，连续压缩
- [ ] 实现 `buildPostUrl(number, title)` — 拼接 `/post/${number}-${slug}`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 单元测试兼容性手动验证

## Phase 2: 核心改造

### Task 2: 更新 page.tsx 参数解析

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`
- [ ] `params.number` 解析改为 `split('-')[0]` 提取数字
- [ ] 更新 `generateMetadata` 中的 canonical URL 包含 slug
- [ ] **预计耗时:** 20 min
- [ ] **验证:** `npx tsc --noEmit` 零错误，`/post/123` 和 `/post/123-任意标题` 均正常渲染

### Task 3: 更新首页博客链接

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 精选博客 PostRow 链接改为 `buildPostUrl(post.number, post.title)`（第 145 行）
- [ ] 年度总结 PostRow 链接改为 `buildPostUrl(item.number, item.title)`（第 179 行）
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 4: 更新博客列表链接

- [ ] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [ ] PostRow 链接改为 `buildPostUrl(post.number, post.title)`（第 61 行）
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 5: 更新详情页上下篇导航链接

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostToolbar.tsx`
- [ ] 上一篇/下一篇链接加 slug
- [ ] **预计耗时:** 10 min
- [ ] **验证:** `npx tsc --noEmit` 零错误

## Phase 3: 验证

### Task 6: 端到端验证

- [ ] 启动 `pnpm dev:next`
- [ ] 首页 → 点击博客链接 → URL 包含标题 slug
- [ ] 博客列表 → 点击博客链接 → URL 包含标题 slug
- [ ] 详情页 → 上下篇导航 → URL 包含标题 slug
- [ ] 直接用 `/post/123` 访问 → 正常渲染（不 404）
- [ ] **预计耗时:** 15 min

## 验收

- [ ] 所有博客详情页 URL 包含中文标题 slug
- [ ] 旧格式 `/post/123` 仍可访问
- [ ] `npx tsc --noEmit` 零错误
- [ ] `npx eslint` 零新增警告
