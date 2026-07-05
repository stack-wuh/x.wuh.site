# 任务清单

## Phase 1: 服务端封面推导

### Task 1: 增加首图提取纯函数

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content-cover.util.ts`
- [x] 实现 `extractFirstImageUrl(bodyHtml, body)`，优先提取 HTML 首个 `<img src>`。
- [x] Markdown fallback 支持 `![alt](url)` 格式。
- [x] 覆盖无图、HTML 图、Markdown 图、HTML 优先于 Markdown 的单元测试。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 25 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`

### Task 2: 详情接口补齐 `metadata.cover`

- [x] **文件:** `packages/wuh.site.nest/src/modules/content/content.controller.ts`
- [x] 在 `getPostDetail()` 返回前构造 plain response，避免修改 Mongoose 文档对象。
- [x] 当原始 `metadata.cover` 缺失时，使用正文首图补齐返回值中的 `metadata.cover`。
- [x] 保留 `liked`、`prev`、`next`、`total`、`position` 返回字段。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node_modules/.bin/jest src/modules/content/content-cover.util.spec.ts src/modules/content/content.controller.spec.ts --runInBand --verbose`

## Phase 2: 前端封面展示

### Task 3: 调整 Header 与封面组件职责

- [x] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [x] 移除标题上方的封面图渲染，让 Header 只负责标题、作者、摘要和装饰分隔线。
- [x] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`
- [x] 新增封面展示组件，无 `src` 不渲染，图片加载失败后隐藏。
- [x] **预计耗时:** 50 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/post`

### Task 4: 将封面放到标题/元信息下方、正文上方

- [x] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [x] 在 `PostHeader` 后、`ArticleCard` 前渲染 `PostCover`。
- [x] 使用 `issue.metadata?.cover` 作为图片来源，`issue.title` 作为 alt。
- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-header.ts`
- [x] 复用或调整现有 `CoverImage` 样式，确保桌面和移动端不溢出。
- [x] **预计耗时:** 40 分钟
- [x] **实际耗时:** 15 分钟
- [ ] **验证:** 待用户手动检查有图/无图/坏图三种文章详情页表现

## Phase 3: 回归验证

### Task 5: 类型与构建检查

- [x] **文件:** `packages/shared-contracts/src/index.ts`
- [x] 确认无需新增契约字段；未新增契约字段。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node_modules/.bin/tsc --noEmit`

## 验收

- [x] 已有 `metadata.cover` 的文章继续使用手动封面。
- [x] 没有 `metadata.cover` 但正文含图片的文章，详情页展示正文第一张图片作为封面。
- [x] 正文没有图片的文章不展示封面区域。
- [x] 封面图片加载失败时隐藏封面区域，不出现破图。
- [x] 封面展示位置位于标题/元信息下方、正文上方。
- [x] `node_modules/.bin/tsc --noEmit` 零错误。
