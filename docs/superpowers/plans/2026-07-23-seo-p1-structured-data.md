# SEO P1 Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 wuh.site 首页和文章页建立一致、可测试的 Schema.org 结构化数据，并在文章页提供与 JSON-LD 对齐的可访问面包屑导航。

**Architecture:** 新增纯 TypeScript structured-data builder，集中构造 WebSite/Person、BlogPosting 和 BreadcrumbList，避免各页面手写并产生空字段。根布局消费站点 builder；文章页消费文章与面包屑 builder；PostView 负责渲染可见的站内面包屑，但不持有 schema 构造逻辑。

**Tech Stack:** Next.js 15 App Router、React 19、TypeScript、styled-components、Node test runner。

---

## 文件结构

- Create: `packages/wuh.site.next/app/lib/structured-data.ts` — 纯函数，生成 Site、Article 和 Breadcrumb JSON-LD。
- Modify: `packages/wuh.site.next/app/layout.tsx` — 输出站点级 WebSite + Person JSON-LD。
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx` — 使用 builder 输出增强 BlogPosting 与 BreadcrumbList。
- Modify: `packages/wuh.site.next/app/post/PostView.tsx` — 输出可访问的文章面包屑导航。
- Modify: `packages/wuh.site.next/app/post/styles/post-header.ts` — 提供面包屑样式。
- Modify: `packages/wuh.site.next/app/post/styles/index.ts` — 导出面包屑样式。
- Create: `packages/wuh.site.next/test/seo-p1-structured-data.test.mjs` — 覆盖 schema 和可见面包屑约束。
- Create: `docs/superpowers/plans/2026-07-23-seo-p1-structured-data.md` — 本计划。

## Task 1: 先写 structured-data builder 的失败测试

**Files:**
- Test: `packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
- Create: `packages/wuh.site.next/app/lib/structured-data.ts`

- [ ] **Step 1: 写失败测试**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createArticleStructuredData,
  createBreadcrumbStructuredData,
  createSiteStructuredData,
} from '../app/lib/structured-data.ts'

test('creates WebSite and Person entities in a single graph', () => {
  const data = createSiteStructuredData()
  assert.equal(data['@context'], 'https://schema.org')
  assert.deepEqual(data['@graph'].map((entry) => entry['@type']), ['WebSite', 'Person'])
})

test('creates a complete BlogPosting with optional content fields', () => {
  const data = createArticleStructuredData({
    url: 'https://wuh.site/post/123-nextjs-seo',
    title: 'Next.js SEO',
    description: '文章摘要',
    publishedAt: '2026-07-20T00:00:00.000Z',
    modifiedAt: '2026-07-21T00:00:00.000Z',
    image: 'https://cdn.wuh.site/cover.png',
    imageAlt: 'SEO 封面',
    keywords: ['Next.js', 'SEO'],
    labels: ['前端'],
  })

  assert.equal(data['@type'], 'BlogPosting')
  assert.equal(data.mainEntityOfPage['@id'], data.url)
  assert.equal(data.inLanguage, 'zh-CN')
  assert.equal(data.keywords, 'Next.js, SEO')
  assert.equal(data.articleSection, '前端')
  assert.equal(data.image.caption, 'SEO 封面')
})

test('omits absent optional BlogPosting fields instead of emitting undefined', () => {
  const data = createArticleStructuredData({
    url: 'https://wuh.site/post/123-nextjs-seo',
    title: 'Next.js SEO',
    description: '文章摘要',
    publishedAt: '2026-07-20T00:00:00.000Z',
  })

  assert.equal('image' in data, false)
  assert.equal('keywords' in data, false)
  assert.equal('articleSection' in data, false)
})

test('creates breadcrumb list items with stable positions and URLs', () => {
  const data = createBreadcrumbStructuredData([
    { name: '首页', url: 'https://wuh.site/' },
    { name: '博客', url: 'https://wuh.site/blog' },
    { name: 'Next.js SEO', url: 'https://wuh.site/post/123-nextjs-seo' },
  ])

  assert.equal(data['@type'], 'BreadcrumbList')
  assert.deepEqual(data.itemListElement.map((item) => item.position), [1, 2, 3])
  assert.equal(data.itemListElement[2].item, 'https://wuh.site/post/123-nextjs-seo')
})
```

- [ ] **Step 2: 运行测试，确认失败原因是缺少 builder 文件**

```bash
/Users/wuhong/.nvm/versions/node/v22.22.3/bin/node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs
```

Expected: FAIL with module-not-found for `app/lib/structured-data.ts`.

- [ ] **Step 3: 最小实现纯 builder**

实现站点、文章和面包屑的纯函数。站点常量固定为 `https://wuh.site`、`shadow` 与 `/about`；文章 builder 仅在输入存在时追加 image、keywords 和 articleSection。

- [ ] **Step 4: 重跑 builder 测试，确认通过**

Expected: 4 tests pass.

## Task 2: 根布局输出站点 JSON-LD

**Files:**
- Test: `packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
- Modify: `packages/wuh.site.next/app/layout.tsx`

- [ ] **Step 1: 增加失败的布局回归测试**

```js
const rootLayoutSource = await readFile(resolve(appRoot, 'app/layout.tsx'), 'utf8')

test('root layout renders site structured data', () => {
  assert.match(rootLayoutSource, /createSiteStructuredData/)
  assert.match(rootLayoutSource, /<JsonLd data=\{createSiteStructuredData\(\)\}/)
})
```

- [ ] **Step 2: 运行测试并确认失败**

Expected: FAIL because root layout does not import the builder or JsonLd.

- [ ] **Step 3: 在 RootLayout 中使用站点 builder**

```tsx
import JsonLd from './components/JsonLd'
import { createSiteStructuredData } from './lib/structured-data'

// render once inside body before AppProviders
<JsonLd data={createSiteStructuredData()} />
```

- [ ] **Step 4: 重跑测试并确认通过**

## Task 3: 文章增强 JSON-LD 与面包屑 JSON-LD

**Files:**
- Test: `packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx`

- [ ] **Step 1: 增加失败的页面回归测试**

```js
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')

test('post page builds article and breadcrumb structured data from the canonical URL', () => {
  assert.match(postPageSource, /createArticleStructuredData/)
  assert.match(postPageSource, /createBreadcrumbStructuredData/)
  assert.match(postPageSource, /name: '首页'/)
  assert.match(postPageSource, /name: '博客'/)
})
```

- [ ] **Step 2: 运行测试并确认失败**

Expected: FAIL because the page still has a handwritten minimal JSON-LD object.

- [ ] **Step 3: 将手写 schema 改为 builder 调用**

构造一个 `url` 常量并传入：标题、摘要、发布日期、更新时间、封面与 alt、`metadata.keywords`、标签名。再以首页、博客和当前文章 URL 构建面包屑。使用两个 `<JsonLd>` 标签输出两种 schema。

- [ ] **Step 4: 重跑测试并确认通过**

## Task 4: 渲染可见、可访问的文章面包屑

**Files:**
- Test: `packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
- Modify: `packages/wuh.site.next/app/post/PostView.tsx`
- Modify: `packages/wuh.site.next/app/post/styles/post-header.ts`
- Modify: `packages/wuh.site.next/app/post/styles/index.ts`

- [ ] **Step 1: 增加失败的可见面包屑测试**

```js
const postViewSource = await readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8')

test('post view renders an accessible breadcrumb using the canonical post URL', () => {
  assert.match(postViewSource, /BreadcrumbNav aria-label='文章面包屑'/)
  assert.match(postViewSource, /href='\/'/)
  assert.match(postViewSource, /href='\/blog'/)
  assert.match(postViewSource, /buildPostUrl\(issue.number, issue.title\)/)
})
```

- [ ] **Step 2: 运行测试并确认失败**

Expected: FAIL because no breadcrumb is currently rendered.

- [ ] **Step 3: 添加面包屑样式与语义导航**

在 `PostView` 的 `PostLead` 顶部渲染：

```tsx
<S.BreadcrumbNav aria-label='文章面包屑'>
  <ol>
    <li><a href='/'>首页</a></li>
    <li aria-hidden='true'>/</li>
    <li><a href='/blog'>博客</a></li>
    <li aria-hidden='true'>/</li>
    <li aria-current='page'>{issue.title}</li>
  </ol>
</S.BreadcrumbNav>
```

其中当前文章链接由 `buildPostUrl(issue.number, issue.title)` 写入 `data-url`，确保测试和 schema 同源；样式通过导出的 `BreadcrumbNav`、`BreadcrumbLink`、`BreadcrumbCurrent` 实现，使用站点既有令牌。

- [ ] **Step 4: 重跑测试并确认通过**

## Task 5: 验证、提交与同步

- [ ] **Step 1: 运行 3 个前端测试文件**

```bash
NODE=/Users/wuhong/.nvm/versions/node/v22.22.3/bin/node
for test_file in packages/wuh.site.next/test/blog-filter-utils.test.mjs packages/wuh.site.next/test/seo-p0.test.mjs packages/wuh.site.next/test/seo-p1-structured-data.test.mjs packages/wuh.site.next/test/site-header-theme-toggle.test.mjs; do
  "$NODE" --experimental-strip-types --test-concurrency=1 --test "$test_file"
done
```

Expected: all tests pass.

- [ ] **Step 2: lint 与 TypeScript**

```bash
/Users/wuhong/shadow-desktop/github/x.wuh.site/node_modules/.pnpm/oxlint@1.69.0/node_modules/oxlint/bin/oxlint app
node /Users/wuhong/shadow-desktop/github/x.wuh.site/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/bin/tsc --noEmit --project tsconfig.json --pretty false
```

Expected: both commands exit 0.

- [ ] **Step 3: final diff check**

```bash
git diff --check
git status --short
```

Expected: only P1 files and the plan/test files are changed.

- [ ] **Step 4: commit and push**

```bash
git add docs/superpowers/plans/2026-07-23-seo-p1-structured-data.md packages/wuh.site.next
git commit -m "feat: add SEO structured data"
git push -u origin codex/seo-p1
```

- [ ] **Step 5: create a chained PR and update Issue #236**

Create PR with base `codex/seo-p0` so P0 remains independently reviewable; link it using `Refs #236` and add verification evidence in the Issue comment.
