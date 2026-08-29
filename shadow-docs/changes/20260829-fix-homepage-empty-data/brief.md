---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-fix-homepage-empty-data",
  "type": "fix",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20260829-fix-homepage-empty-data",
  "files": [
    "apps/site/app/page.tsx",
    "apps/site/test/first-load-boundaries.test.mjs",
    "apps/site/test/seo-p0.test.mjs",
    "shadow-docs/knowledge/homepage-data.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 340,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/340",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "109bff96d6eb02d4388dfdad20c3cb0c4b14e072",
    "verifiedAt": "2026-08-29T02:53:19.413Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:340",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 首页构建期空数据回归修复

## 动机

生产环境首页「精选博客」「年度总结」两个模块空数据展示。根因（CI 构建日志实锤）：Docker 构建阶段 Next 预渲染首页时 fetch `http://nest:3200/v2` 失败（构建容器内无 nest 服务），fallback 空数组被烘焙进 ISR 静态缓存；部署后 30 分钟内（s-maxage=1800）所有用户看到空首页。每次发布都会重现此空窗。

## 引用规范

- shadow-docs/knowledge/homepage-data.md
  - 当前结论: 首页不得把构建阶段 API 失败得到的空数组固化为生产结果；运行时请求失败必须记录模块并可降级渲染
  - 适用 scope: 首页数据获取边界（本次修复正是该结论被违反的回归）
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏主体数据优先，非首屏数据不阻塞 HTML 返回
  - 适用 scope: 首页数据获取策略（force-dynamic 不影响该原则：数据获取仍为并行 await 首屏主体）

## 决策

- **选型:** 首页改回 `export const dynamic = 'force-dynamic'`（动态渲染）
- **对比方案:**
  - 接受现状（每次发布空 30 分钟）：不可接受的体验回归
  - ISR + 部署后主动 revalidate：保留缓存收益但增加部署复杂度，治标
- **理由:** 构建期无 nest 连接是结构性事实（Docker build 阶段隔离），ISR 预渲染首页在此环境下必然产生空数据；运行时连接已验证正常（/blog 动态渲染有数据），force-dynamic 后部署完成即实时取数，空窗永久消除。SEO 无影响（SSR 完整 HTML 不变，历史上首页本就是 force-dynamic）。性能代价（每请求 SSR ~200-500ms TTFB）在个人博客流量下可忽略。

## 任务

### Phase 1: 修复
- [x] page.tsx 添加 `export const dynamic = 'force-dynamic'`，移除 getFeaturedIssues/getYearlySummaries 的 `revalidate: 1800` — `apps/site/app/page.tsx` — 修改
- [x] 构建验证：next build 输出首页为 ƒ (Dynamic)，预渲染阶段不再 fetch — 本地构建 — 验证
- [x] 回归：seo 测试中 3 个首页过期断言（期望 force-dynamic 的历史断言）恢复通过 — `apps/site/test/` — 验证

### Phase 2: 知识
- [x] homepage-data.md 补充「首页必须 force-dynamic，构建期预渲染会烘焙空数据」的结构性事实 — `shadow-docs/knowledge/homepage-data.md` — 更新

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/homepage-data.md
- **理由:** 「构建环境无法连接 nest，首页不得预渲染」是长期结构性事实；本次正是违反既有结论（不固化构建期空数据）导致的回归，卡片需强化为执行约束
