# SEO P1.2 Related Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在文章详情页展示最多三篇按标签相关度排序的相关文章，增加规范化的语义内部链接。

**Architecture:** 文章服务端页面用当前文章最多三个标签并发获取候选文章；纯函数负责排除当前文章、去重、按共享标签数和更新时间排序并截取前三项。客户端 PostView 仅负责在有结果时渲染语义化 section，所有链接复用 `buildPostUrl`。

**Tech Stack:** Next.js App Router、TypeScript、styled-components、Node test runner、现有 Content API。

---

## 文件结构

- Create: `packages/wuh.site.next/app/lib/related-posts.ts` — 候选文章映射与排序纯函数。
- Modify: `packages/wuh.site.next/app/post/PostView.types.ts` — 定义 RelatedPost 和 props。
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx` — 按标签获取候选文章并传给视图。
- Modify: `packages/wuh.site.next/app/post/PostView.tsx` — 条件渲染相关文章 section。
- Modify: `packages/wuh.site.next/app/post/styles/post-article.ts` — 相关文章样式。
- Modify: `packages/wuh.site.next/app/post/styles/index.ts` — 导出相关文章样式。
- Create: `packages/wuh.site.next/test/related-posts.test.mjs` — 相关度排序和去重测试。
- Create: `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` — 页面与可见内部链接回归测试。

## Task 1: 候选筛选的失败测试

**Files:**
- Test: `packages/wuh.site.next/test/related-posts.test.mjs`
- Create: `packages/wuh.site.next/app/lib/related-posts.ts`

- [ ] **Step 1: 写失败测试**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { selectRelatedPosts } from '../app/lib/related-posts.ts'

test('selects unique related posts by shared labels and recency', () => {
  const posts = selectRelatedPosts(
    { number: 10, labels: ['Next.js', 'SEO'] },
    [
      { number: 10, title: '当前文章', labels: ['Next.js'], updatedAt: '2026-07-22' },
      { number: 11, title: '两个标签', labels: ['Next.js', 'SEO'], updatedAt: '2026-07-20' },
      { number: 12, title: '一个标签较新', labels: ['SEO'], updatedAt: '2026-07-23' },
      { number: 12, title: '重复数据', labels: ['SEO'], updatedAt: '2026-07-19' },
      { number: 13, title: '无关文章', labels: ['NestJS'], updatedAt: '2026-07-24' },
    ],
  )

  assert.deepEqual(posts.map((post) => post.number), [11, 12])
})

test('caps related posts at three items', () => {
  const posts = selectRelatedPosts(
    { number: 10, labels: ['Next.js'] },
    [11, 12, 13, 14].map((number) => ({
      number,
      title: `文章 ${number}`,
      labels: ['Next.js'],
      updatedAt: `2026-07-${number}`,
    })),
  )

  assert.equal(posts.length, 3)
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
/Users/wuhong/.nvm/versions/node/v22.22.3/bin/node --experimental-strip-types --test packages/wuh.site.next/test/related-posts.test.mjs
```

Expected: module-not-found for the new helper.

- [ ] **Step 3: 最小实现纯筛选函数**

接受当前文章 number/labels 与候选项；排除当前编号，跳过无共享标签项，按 shared label count 降序、updatedAt 降序、number 升序排序，用 number 去重，返回 3 项。

- [ ] **Step 4: 重跑测试确认通过**

## Task 2: 服务端获取相关文章

**Files:**
- Test: `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx`
- Modify: `packages/wuh.site.next/app/post/PostView.types.ts`

- [ ] **Step 1: 增加失败的页面测试**

测试必须断言文章页面包含：`getRelatedPosts`、标签 `Promise.all`、`revalidate: 3600`、`selectRelatedPosts`，并将 `relatedPosts` 传给 `PostView`。

- [ ] **Step 2: 运行并确认失败**

- [ ] **Step 3: 实现候选获取与映射**

从 `issue.labels` 提取最多三个非空标签。每个标签请求：

```ts
contentService.getPosts.server({
  query: { labels: [label], limit: '10', state: 'open' },
  revalidate: 3600,
})
```

把成功响应的 `ContentItem` 映射成 RelatedPost 候选，调用 `selectRelatedPosts`。无标签和请求失败返回空数组。将结果通过 `relatedPosts` prop 传入 `PostView`。

- [ ] **Step 4: 重跑页面测试确认通过**

## Task 3: 渲染语义化相关文章模块

**Files:**
- Test: `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
- Modify: `packages/wuh.site.next/app/post/PostView.tsx`
- Modify: `packages/wuh.site.next/app/post/styles/post-article.ts`
- Modify: `packages/wuh.site.next/app/post/styles/index.ts`

- [ ] **Step 1: 添加失败的视图测试**

断言 `PostView`：

- 读取 `relatedPosts` props；
- 仅在 `relatedPosts.length > 0` 时渲染 `RelatedPostsSection`；
- section 有 `aria-labelledby='related-posts-title'`；
- 每篇文章使用 `buildPostUrl(post.number, post.title)`。

- [ ] **Step 2: 运行并确认失败**

- [ ] **Step 3: 最小实现组件和样式**

在 `ArticleCard` 后、`ImagePreview` 前渲染 `<section>`，其中为 `<h2 id='related-posts-title'>相关文章</h2>` 和 `<ul>`。每篇内容显示标题与最多两个共同标签，链接为 canonical URL。空数组不渲染。

- [ ] **Step 4: 重跑测试确认通过**

## Task 4: 验证、提交、推送和创建链式 PR

- [ ] **Step 1: 运行全部前端测试文件**

```bash
NODE=/Users/wuhong/.nvm/versions/node/v22.22.3/bin/node
for test_file in packages/wuh.site.next/test/*.test.mjs; do
  "$NODE" --experimental-strip-types --test-concurrency=1 --test "$test_file"
done
```

- [ ] **Step 2: lint、diff 和 TypeScript 尝试**

```bash
/Users/wuhong/shadow-desktop/github/x.wuh.site/node_modules/.pnpm/oxlint@1.69.0/node_modules/oxlint/bin/oxlint app
git diff --check
node /Users/wuhong/shadow-desktop/github/x.wuh.site/node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc --noEmit --project tsconfig.json --pretty false
```

记录任何环境级 TypeScript SIGSEGV，不把它误报为通过。

- [ ] **Step 3: 提交、推送并创建 PR**

```bash
git add docs/superpowers/plans/2026-07-24-seo-p12-related-posts.md packages/wuh.site.next
git commit -m "feat: add related post links"
git push -u origin codex/seo-p12
```

PR base 为 `codex/seo-p1`，关联 `Refs #238`；在 #238 写入提交号、PR 和验证证据。
