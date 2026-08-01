# 优化博客详情页底部上一条/下一条的数据来源

> 原始变更名：`20260524_P_fix_blog_adjacent_posts`

## 元数据
- 日期：2026-05-24
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
博客详情页（`/post/[number]`）底部的「上一条/下一条」导航使用 `issueNumber ± 1` 查找相邻文章，与 `/blog` 列表页的数据源和排序规则不一致。

`/blog` 列表页按 `createdAtGitHub` 降序排列，只展示 `state: 'open'` 的文章。而详情页的 prev/next 仅基于 GitHub Issue 编号 ±1，存在以下问题：

- Issue 编号可能存在空缺（PR、已删除 Issue、非博客文章）
- Issue 编号顺序不等于发布时间顺序
- 未过滤 `state`，可能导航到已关闭的文章

## 引用规范
- `specs/content/spec.md`

## 决策
# 技术方案

## 方案: 在详情接口中附带 prev/next

修改 `GET /content/posts/:slugOrNumber`，在响应中增加 `prev` 和 `next` 字段。

### 后端

`ContentService.findAdjacentPosts(currentPost, baseQuery)`:

- 接收当前文章和查询条件（`{ state: 'open' }`）
- 并行查询 prev 和 next
- prev: `createdAtGitHub > current` 中最小者（ASC + number ASC 二级排序）
- next: `createdAtGitHub < current` 中最大者（DESC + number DESC 二级排序）
- 同日期时用 `number` 做二级排序，保证确定性
- 返回 `{ prev: { number, title } | null, next: { number, title } | null }`

`ContentController.getPostDetail`:

- 找到文章后调用 `findAdjacentPosts(result, { state: 'open' })`
- 返回 `{ ...result.toJSON(), prev, next }`

### 前端

`api.content.getPost` 返回类型扩展为 `ContentItem & { prev: AdjacentPost | null; next: AdjacentPost | null }`。

`[number]/page.tsx`:

- 删除 `getAdjacentIssue` 函数
- `getIssue` 改为返回 `{ issue, prev, next }`
- `Page` 组件直接从 `getIssue` 解构 prev/next

`PostView.tsx` / `PostToolbar.tsx`: 无需改动。

## 影响分析

- 无数据库 schema 变更
- 无新增 API 端点
- `GET /content/posts/:slugOrNumber` 响应新增 `prev`/`next` 字段（向后兼容）
- 详情页少发 2 个 HTTP 请求（原来 prev 和 next 各一次）

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: fix-blog-adjacent-posts
date: 2026-05-24
type: P
status: proposed
```

### `design.md`
# 技术方案

## 方案: 在详情接口中附带 prev/next

修改 `GET /content/posts/:slugOrNumber`，在响应中增加 `prev` 和 `next` 字段。

### 后端

`ContentService.findAdjacentPosts(currentPost, baseQuery)`:

- 接收当前文章和查询条件（`{ state: 'open' }`）
- 并行查询 prev 和 next
- prev: `createdAtGitHub > current` 中最小者（ASC + number ASC 二级排序）
- next: `createdAtGitHub < current` 中最大者（DESC + number DESC 二级排序）
- 同日期时用 `number` 做二级排序，保证确定性
- 返回 `{ prev: { number, title } | null, next: { number, title } | null }`

`ContentController.getPostDetail`:

- 找到文章后调用 `findAdjacentPosts(result, { state: 'open' })`
- 返回 `{ ...result.toJSON(), prev, next }`

### 前端

`api.content.getPost` 返回类型扩展为 `ContentItem & { prev: AdjacentPost | null; next: AdjacentPost | null }`。

`[number]/page.tsx`:

- 删除 `getAdjacentIssue` 函数
- `getIssue` 改为返回 `{ issue, prev, next }`
- `Page` 组件直接从 `getIssue` 解构 prev/next

`PostView.tsx` / `PostToolbar.tsx`: 无需改动。

## 影响分析

- 无数据库 schema 变更
- 无新增 API 端点
- `GET /content/posts/:slugOrNumber` 响应新增 `prev`/`next` 字段（向后兼容）
- 详情页少发 2 个 HTTP 请求（原来 prev 和 next 各一次）

### `proposal.md`
# 优化博客详情页底部上一条/下一条的数据来源

## 动机

博客详情页（`/post/[number]`）底部的「上一条/下一条」导航使用 `issueNumber ± 1` 查找相邻文章，与 `/blog` 列表页的数据源和排序规则不一致。

`/blog` 列表页按 `createdAtGitHub` 降序排列，只展示 `state: 'open'` 的文章。而详情页的 prev/next 仅基于 GitHub Issue 编号 ±1，存在以下问题：

- Issue 编号可能存在空缺（PR、已删除 Issue、非博客文章）
- Issue 编号顺序不等于发布时间顺序
- 未过滤 `state`，可能导航到已关闭的文章

## 变更范围

- 后端新增 `ContentService.findAdjacentPosts` 方法，基于 `createdAtGitHub` 排序查找前后文章
- 后端 `ContentController.getPostDetail` 在响应中附带 `prev`/`next`
- 前端删除 `getAdjacentIssue` 函数，直接从 API 响应获取 prev/next
- 前端 `PostView` / `PostToolbar` 组件无需改动（props 接口保持不变）

## 非目标

- 不修改 `/blog` 列表页的排序逻辑
- 不修改 `PostToolbar` 的 UI 样式
- 不新增 API 端点

### `specs/content/spec.md`
# Content API — 文章详情接口

## MODIFIED

### GET /content/posts/:slugOrNumber

**GIVEN** 一篇已存在的文章
**WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
**THEN** 响应包含文章的完整信息
**AND** 响应包含 `prev` 字段（`{ number, title }` 或 `null`），表示按 `createdAtGitHub` 降序 + `state: 'open'` 过滤后，紧邻当前文章的上一条（更新的文章）
**AND** 响应包含 `next` 字段（`{ number, title }` 或 `null`），表示同排序规则下紧邻当前文章的下一条（更旧的文章）
**AND** 当文章为列表中第一篇时 `prev` 为 `null`
**AND** 当文章为列表中最后一篇时 `next` 为 `null`
**AND** `prev`/`next` 的排序规则与 `GET /content/posts?state=open` 一致

### `tasks.md`
# 实施任务

| # | 任务 | 模式 | 依赖 | 涉及文件 |
|---|------|------|------|----------|
| 1 | ContentService 新增 findAdjacentPosts | 后台 | 无 | `content.service.ts` |
| 2 | ContentController 返回 prev/next | 后台 | 1 | `content.controller.ts` |
| 3 | 前端 API 类型 + page.tsx 适配 | 前台 | 2 | `api.ts`, `[number]/page.tsx` |

---

### Task 1: ContentService 新增 findAdjacentPosts 方法

**文件:**
- Modify: `packages/wuh.site.nest/src/modules/content/content.service.ts`

在 `findByNumber` 方法之后插入：

```typescript
async findAdjacentPosts(
  currentPost: ContentDocument,
  baseQuery: Record<string, any> = {},
): Promise<{ prev: { number: number; title: string } | null; next: { number: number; title: string } | null }> {
  const query = { ...baseQuery };

  const [prev, next] = await Promise.all([
    this.contentModel
      .findOne({
        ...query,
        $or: [
          { createdAtGitHub: { $gt: currentPost.createdAtGitHub } },
          {
            createdAtGitHub: currentPost.createdAtGitHub,
            number: { $gt: currentPost.number },
          },
        ],
      })
      .sort({ createdAtGitHub: 1, number: 1 })
      .select('number title')
      .lean()
      .exec(),

    this.contentModel
      .findOne({
        ...query,
        $or: [
          { createdAtGitHub: { $lt: currentPost.createdAtGitHub } },
          {
            createdAtGitHub: currentPost.createdAtGitHub,
            number: { $lt: currentPost.number },
          },
        ],
      })
      .sort({ createdAtGitHub: -1, number: -1 })
      .select('number title')
      .lean()
      .exec(),
  ]);

  return {
    prev: prev ? { number: prev.number, title: prev.title } : null,
    next: next ? { number: next.number, title: next.title } : null,
  };
}
```

**验证:** `pnpm exec tsc --noEmit -p packages/wuh.site.nest/tsconfig.json` 无新增错误。

---

### Task 2: ContentController 返回 prev/next

**文件:**
- Modify: `packages/wuh.site.nest/src/modules/content/content.controller.ts`

替换 `getPostDetail` 方法：

```typescript
@Get('posts/:slugOrNumber')
@ApiOperation({ summary: 'Get a single post by slug or issue number' })
@ApiResponse({ status: 200, description: 'Post details with prev/next adjacent posts' })
@ApiResponse({ status: 404, description: 'Post not found' })
async getPostDetail(@Param('slugOrNumber') slugOrNumber: string) {
  const result = await this.contentService.findBySlugOrNumber(slugOrNumber);
  if (!result) {
    throw new NotFoundException(`Post not found: ${slugOrNumber}`);
  }

  const { prev, next } = await this.contentService.findAdjacentPosts(result, {
    state: 'open',
  });

  return {
    ...result.toJSON(),
    prev,
    next,
  };
}
```

**验证:** `pnpm exec tsc --noEmit -p packages/wuh.site.nest/tsconfig.json` 无错误。

---

### Task 3: 前端 API 类型 + page.tsx 适配

**文件:**
- Modify: `packages/wuh.site.next/app/lib/api.ts`
- Modify: `packages/wuh.site.next/app/post/[number]/page.tsx`

**api.ts** — 更新 `getPost` 返回类型：

```typescript
type AdjacentPost = { number: number; title: string } | null;

getPost(slugOrNumber: string | number, options?: FetchOptions): Promise<ContentItem & { prev: AdjacentPost; next: AdjacentPost }> {
  return apiGet<ContentItem & { prev: AdjacentPost; next: AdjacentPost }>(`/content/posts/${slugOrNumber}`, options);
},
```

**[number]/page.tsx** — 删除 `getAdjacentIssue` 函数（原第 51-65 行），修改 `getIssue` 和 `Page`：

```typescript
async function getIssue(num: string): Promise<{
  issue: Issue | null;
  prev: AdjacentIssue | null;
  next: AdjacentIssue | null;
}> {
  try {
    const content = await api.content.getPost(num, { revalidate: 1800 });
    const issue = mapContentToIssue(content);
    if (issue.body) {
      issue.body_html = await renderMarkdown(issue.body);
    }
    return {
      issue,
      prev: content.prev ? { number: content.prev.number, title: content.prev.title } : null,
      next: content.next ? { number: content.next.number, title: content.next.title } : null,
    };
  } catch {
    return { issue: null, prev: null, next: null };
  }
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const { issue, prev: prevIssue, next: nextIssue } = await getIssue(number);
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />;

  return <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} />;
}
```

**验证:** `pnpm exec tsc --noEmit -p packages/wuh.site.next/tsconfig.json` 无错误。
