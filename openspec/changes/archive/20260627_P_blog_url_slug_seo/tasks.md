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
