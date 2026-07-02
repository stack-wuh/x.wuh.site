# 任务清单

## Phase 1: 类型和工具函数

### Task 1: PostListItem.comments → views

- [ ] **文件:** `packages/shared-contracts/src/index.ts`
- [ ] `PostListItem.comments` → `PostListItem.views`
- [ ] `blog/page.tsx` 映射 `views: 0`
- [ ] **预计耗时:** 5 min

### Task 2: 日期格式化工具函数

- [ ] **文件:** `packages/wuh.site.next/app/lib/date.ts`（新建）
- [ ] 实现 `formatShortDate(dateStr)` — MM-dd
- [ ] 实现 `formatRelativeTime(dateStr)` — 相对时间
- [ ] **预计耗时:** 10 min

## Phase 2: 前端页面更新

### Task 3: 首页和博客列表

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`
- [ ] 日期改 `formatShortDate`
- [ ] `post.comments` → `post.views`
- [ ] **预计耗时:** 10 min

### Task 4: 详情页 PostHeader

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostHeader.tsx`
- [ ] 日期改 `formatRelativeTime`
- [ ] `issue.comments`条评论 → 浏览量标识
- [ ] **预计耗时:** 5 min

## 验收

- [ ] 首页日期 MM-dd，展示"浏览量"字样的数值
- [ ] 博客列表同上
- [ ] 详情页 1天内文章显示 "X小时前发布"
- [ ] 详情页 1周内文章显示 "X天前发布"
- [ ] `npx tsc --noEmit` 零错误
