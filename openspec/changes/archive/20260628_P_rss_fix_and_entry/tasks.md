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
