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
