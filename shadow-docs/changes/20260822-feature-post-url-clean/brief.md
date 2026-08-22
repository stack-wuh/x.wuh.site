# 文章 URL 只保留 id

## 动机

文章 URL 当前为 `/post/{number}-{slug}`（`buildPostUrl` 在标题后追加 slug）。实测效果不好：地址栏过长、重复内容风险（错误 slug 也返回同一篇文章，issue #233 P0 指出「错误 slug 也可能返回同一篇文章，形成重复 URL」）、sitemap 与 canonical 不一致。

改为只保留 `/post/{number}`：地址栏干净、URL 唯一、与 sitemap/canonical 天然一致。

## 引用规范

- `shadow-docs/knowledge/seo.md`
  - 当前结论: （待读取确认）URL 规范化与 canonical 相关约束
  - 适用 scope: apps/site/app/post、apps/site/app/lib
- Issue #233（SEO 总任务）
  - P0「索引与规范化」: 建立唯一 canonical URL；数字 URL、错误 slug、历史 slug 统一 301 到 canonical

## 决策

- **选型:** URL 改为 `/post/{number}`，旧 slug URL 301 重定向
  - `buildPostUrl(number)` 只返回 `/post/${number}`，去掉 title 参数
  - 9 处调用更新（博客列表、首页、相关文章、工具栏、topics、sitemap、seo、PostView）
  - `post/[number]/page.tsx`：`raw.split('-')[0]` 改为纯数字解析；非数字路径 301 到 canonical；带 slug 后缀的旧 URL 301 到 `/post/{number}`
  - `isCanonicalPostPath` 简化为纯 number 校验
- **对比方案:**
  - 保留 slug 只修 canonical 逻辑: URL 仍长，重复 URL 风险仍在，未选
  - slug 放 query（`/post/165?slug=xxx`）: 地址栏不干净，未选
- **理由:** 与 issue #233 的 P0 目标一致（唯一 canonical、旧 URL 301）；地址栏最干净；改动集中在 slug.ts 与 post 路由

## 任务

### Phase 1: URL 生成改造

- [x] 修改 `apps/site/app/lib/slug.ts` — `buildPostUrl` 只返回 `/post/{number}`；`isCanonicalPostPath` 简化为纯 number 校验
- [x] 更新 9 处 `buildPostUrl` 调用（去掉 title 参数）

### Phase 2: 路由与重定向

- [x] 修改 `apps/site/app/post/[number]/page.tsx` — 纯数字解析、旧 slug URL 301 到 `/post/{number}`、非数字 404/301
- [x] 验证: `tsc` 通过；site 测试套件 98 个测试全绿（含 SEO 47 个）

## 结果

- 实际耗时: ~1.5h
- 验证: `tsc` 通过；全部测试文件通过（98 tests）；浏览器验证受 Node 24 V8 崩溃限制未执行，URL 逻辑由 seo-p0 测试断言覆盖（buildPostUrl 纯 id、isCanonicalPostPath 纯数字、permanentRedirect）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/seo.md`
- **理由:** 文章 URL 结构是长期事实（`/post/{number}` 为 canonical + 旧 slug 301），需同步卡片；待 review 确认
