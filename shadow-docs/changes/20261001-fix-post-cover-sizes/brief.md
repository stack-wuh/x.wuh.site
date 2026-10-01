---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-fix-post-cover-sizes",
  "type": "fix",
  "scope": "packages/components,apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261001-fix-post-cover-sizes",
  "files": [
    "apps/site/app/post/components/PostCover/index.tsx",
    "apps/site/test/seo-post-cover-sizes.test.mjs",
    "packages/components/image/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 458,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/458",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "6bf77cfc52255d7435387b77a7e25f08eba2e3e2",
    "verifiedAt": "2026-10-01T15:57:04.060Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:458",
    "planHash": "ab933f43169b53c89f0c9c60f9dea2ce1cbb31e532a6e25394d0bc41c10f98ae",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix: 文章首图 sizes 缺失超需 3.6 倍 + Next 16 priority 不再映射 fetchPriority",
      "titleRaw": "fix: 文章首图 sizes 缺失超需 3.6 倍 + Next 16 priority 不再映射 fetchPriority",
      "supplement": "来源 #438 未纳入项 F。生产验尸 /post/165 cover img：sizes=100vw（实际渲染 526px，超需 3.6 倍带宽）；fetchpriority 缺失但 preload link 在——next@16.3.2 get-img-props.js 实证 fetchPriority 为独立 prop，priority 只管 preload+禁 lazy，处方「根因未确认」项关闭（排除透传丢失/对象误判）。修法：组件库 priority→fetchPriority=high 映射一处 + PostCover 补 sizes=(max-width:1023px) 100vw, 526px。S 级/runtime。brief: shadow-docs/changes/20261001-fix-post-cover-sizes/brief.md",
      "body": "## 动机\n#438 未纳入项 F（S 级）。生产实测（2026-10-01 复核 v1.4.52 站点）：\n- PostCover 传 `fill + ratio='16:9'` 但**未传 sizes** → next/image fill 模式默认 `sizes=\"100vw\"`，浏览器按视口宽选档（1440 视口选 1920w），实际渲染仅 526px（post 头部双栏网格的图列，容器 1100px−padding 的半宽）——超需约 3.6 倍带宽\n- **诊断结论（关闭处方「根因未确认」项）**: 生产 DOM 验尸 `/post/165` cover img——`fetchpriority` 属性缺失，但 `<link rel=\"preload\" as=\"image\" imageSrcSet>` **在**。对照 next@16.3.2 源码 `get-img-props.js:150`：`fetchPriority` 是独立 prop，`priority` 只映射 preload + 禁 lazy（无 loading 属性=原生 eager ✓），**img 的 `fetchpriority=\"high\"` 需显式传**——Next 16 解耦了 priority 与 fetchPriority。排除处方候选：透传链路完好（styled(NextImage) 全量转发，preload 即证据）、实测对象无误（data-nimg=fill + ImgWrapper class + cover alt）\n- priority 的 SSR 直出路径健康（`shouldLazy = lazy && !priority` → inView 初始 true，img 在初始 HTML）\n\n## 引用规范\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: 每个关键页面可识别实际 LCP 元素及依赖，图片优先级只依据测量结果调整\n  - 适用 scope: 本次即测量驱动修复；改造不引入新请求依赖\n- shadow-docs/knowledge/seo.md（弱相关，不触碰）\n  - 当前结论: 页面语义与 OG 约束，不受本变更影响\n\n## 决策\n- **选型:** ① `packages/components/image/index.tsx`：`priority` 时向 ImgWrapper 显式传 `fetchPriority='high'`（priority 语义即 LCP，映射一处全体受益，不要求调用方懂 Next 16 新参数）；② `PostCover/index.tsx` 补 `sizes='(max-width: 1023px) 100vw, 526px'`（双栏网格 ≥1024 图列 526px=容器半宽实测值，<1024 单栏全宽；断点取 BREAKPOINTS.tablet）\n- **对比方案:** 只传 fetchPriority 不修 sizes——带宽浪费 3.6× 的主问题不解决；改用固定 width/height 替代 fill——动 DOM 结构，超出 S 级\n- **理由:** 两处都是测量驱动的最小修正；src 回落 w=3840 升采样问题（原图 531×354）系 next/image fill 的 src 生成策略，sizes 修复后浏览器正常走 srcSet 择档，src 仅极老浏览器触达，不在本变更扩散\n\n## 任务\n### Phase 1 红测试\n- [ ] 契约测试：image/index.tsx 含 priority→fetchPriority='high' 映射；PostCover 含 sizes 声明（断点 1023 + 526px） —— `apps/site/test/seo-post-cover-sizes.test.mjs`\n### Phase 2 实现\n- [ ] Image 组件：priority → fetchPriority='high' 传 ImgWrapper — `packages/components/image/index.tsx`\n- [ ] PostCover：补 sizes 声明 — `apps/site/app/post/components/PostCover/index.tsx`\n### Phase 3 验证与收尾\n- [ ] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`、`packages/components`\n- [ ] runtime 验收：部署后生产 `/post/165` DOM——cover img 含 `fetchpriority=\"high\"` 与 `sizes=\"(max-width: 1023px) 100vw, 526px\"`、preload link 仍在 — `apps/site`\n- [ ] 变更说明回填 PR body — issue\n\n## 补充\n来源 #438 未纳入项 F。生产验尸 /post/165 cover img：sizes=100vw（实际渲染 526px，超需 3.6 倍带宽）；fetchpriority 缺失但 preload link 在——next@16.3.2 get-img-props.js 实证 fetchPriority 为独立 prop，priority 只管 preload+禁 lazy，处方「根因未确认」项关闭（排除透传丢失/对象误判）。修法：组件库 priority→fetchPriority=high 映射一处 + PostCover 补 sizes=(max-width:1023px) 100vw, 526px。S 级/runtime。brief: shadow-docs/changes/20261001-fix-post-cover-sizes/brief.md\n\n完整 brief：shadow-docs/changes/20261001-fix-post-cover-sizes/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-fix-post-cover-sizes\",\"type\":\"fix\",\"scope\":\"packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-fix-post-cover-sizes/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/post/components/PostCover/index.tsx",
        "apps/site/test/seo-post-cover-sizes.test.mjs",
        "packages/components/image/index.tsx",
        "shadow-docs/changes/20261001-fix-post-cover-sizes/brief.md",
        "shadow-docs/knowledge/first-load-performance.md"
      ],
      "message": "fix(perf): 文章首图 sizes 收敛选档 + priority 映射 fetchPriority=high (#458)",
      "title": "fix(perf): 文章首图 sizes 缺失超需 3.6 倍 + Next 16 priority/fetchPriority 解耦修复",
      "body": "Closes #458（文章首图 sizes 与 fetchPriority；#438 未纳入项 F 处方落地）\n\n## 变更\n- `packages/components/image/index.tsx`：`priority` 时显式传 `fetchPriority='high'`（Next 16 解耦后的根治点，组件库一处全体 priority 调用方受益）\n- `apps/site/app/post/components/PostCover/index.tsx`：补 `sizes='(max-width: 1023px) 100vw, 526px'`（双栏网格 ≥1024 图列 526px=容器半宽实测值）\n- 新契约测试 `test/seo-post-cover-sizes.test.mjs` ×2\n\n## 诊断（关闭处方「根因未确认」项）\n生产 DOM 验尸 `/post/165`：cover img 无 `fetchpriority` 但 `<link rel=\"preload\" as=\"image\" imageSrcSet>` 在。对照 next@16.3.2 `get-img-props.js:150`——`fetchPriority` 是独立 prop，`priority` 只映射 preload + 禁 lazy（img 无 loading 属性=原生 eager）。排除处方候选：styled(NextImage) 透传完好（preload 即证据）、实测对象无误（data-nimg=fill + cover alt）。\n\n## 验证\n- TDD：2 条契约先红后绿；tsc 0 错；oxlint apps/site + 组件包 0 错\n- 全量 179 测试：18 挂与 B2 基线同批存量，0 新增失败\n- 部署后复测清单：`/post/165` cover img 含 `fetchpriority=\"high\"` + `sizes=\"(max-width: 1023px) 100vw, 526px\"`、preload 仍在\n\n## 效果\n首图选档从「1440 视口选 1920w」收敛到「526px 槽位选 640w」（DPR2 选 1080w）——LCP 图带宽超需 3.6× 收敛；fetchpriority=high 补全 LCP 竞速信号。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/first-load-performance.md",
    "reason": "实现与 brief 选型一致：组件库 priority→fetchPriority=high 映射（Next 16 解耦的根治点，全体 priority 调用方受益）+ PostCover sizes=(max-width:1023px) 100vw,526px（双栏网格实测值）。TDD 2/2 红转绿，tsc/oxlint（apps/site+组件包）0 错，18 挂存量同批。生产 DOM 验尸已关闭处方「根因未确认」项：preload 在而 fetchpriority 缺失，next@16.3.2 get-img-props.js 实证 fetchPriority 独立 prop。runtime 以部署后生产 curl 为权威。知识卡新增：Next 16 priority/fetchPriority 解耦陷阱 + fill 模式必须显式 sizes"
  }
}
---

# 文章首图 sizes 与 fetchPriority 修复

## 动机
#438 未纳入项 F（S 级）。生产实测（2026-10-01 复核 v1.4.52 站点）：
- PostCover 传 `fill + ratio='16:9'` 但**未传 sizes** → next/image fill 模式默认 `sizes="100vw"`，浏览器按视口宽选档（1440 视口选 1920w），实际渲染仅 526px（post 头部双栏网格的图列，容器 1100px−padding 的半宽）——超需约 3.6 倍带宽
- **诊断结论（关闭处方「根因未确认」项）**: 生产 DOM 验尸 `/post/165` cover img——`fetchpriority` 属性缺失，但 `<link rel="preload" as="image" imageSrcSet>` **在**。对照 next@16.3.2 源码 `get-img-props.js:150`：`fetchPriority` 是独立 prop，`priority` 只映射 preload + 禁 lazy（无 loading 属性=原生 eager ✓），**img 的 `fetchpriority="high"` 需显式传**——Next 16 解耦了 priority 与 fetchPriority。排除处方候选：透传链路完好（styled(NextImage) 全量转发，preload 即证据）、实测对象无误（data-nimg=fill + ImgWrapper class + cover alt）
- priority 的 SSR 直出路径健康（`shouldLazy = lazy && !priority` → inView 初始 true，img 在初始 HTML）

## 复杂度评级
- **评级:** S
- **理由:** 契约变更是（img 的 sizes 与 fetchpriority 输出），改动 2 个声明式点位（组件映射 + PostCover 传参）；可发现性高（生产 DOM 属性 curl 即断言）
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 每个关键页面可识别实际 LCP 元素及依赖，图片优先级只依据测量结果调整
  - 适用 scope: 本次即测量驱动修复；改造不引入新请求依赖
- shadow-docs/knowledge/seo.md（弱相关，不触碰）
  - 当前结论: 页面语义与 OG 约束，不受本变更影响

## 决策
- **选型:** ① `packages/components/image/index.tsx`：`priority` 时向 ImgWrapper 显式传 `fetchPriority='high'`（priority 语义即 LCP，映射一处全体受益，不要求调用方懂 Next 16 新参数）；② `PostCover/index.tsx` 补 `sizes='(max-width: 1023px) 100vw, 526px'`（双栏网格 ≥1024 图列 526px=容器半宽实测值，<1024 单栏全宽；断点取 BREAKPOINTS.tablet）
- **对比方案:** 只传 fetchPriority 不修 sizes——带宽浪费 3.6× 的主问题不解决；改用固定 width/height 替代 fill——动 DOM 结构，超出 S 级
- **理由:** 两处都是测量驱动的最小修正；src 回落 w=3840 升采样问题（原图 531×354）系 next/image fill 的 src 生成策略，sizes 修复后浏览器正常走 srcSet 择档，src 仅极老浏览器触达，不在本变更扩散

## 任务
### Phase 1 红测试
- [x] 契约测试：image/index.tsx 含 priority→fetchPriority='high' 映射；PostCover 含 sizes 声明（断点 1023 + 526px） —— `apps/site/test/seo-post-cover-sizes.test.mjs`
### Phase 2 实现
- [x] Image 组件：priority → fetchPriority='high' 传 ImgWrapper — `packages/components/image/index.tsx`
- [x] PostCover：补 sizes 声明 — `apps/site/app/post/components/PostCover/index.tsx`
### Phase 3 验证与收尾
- [x] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`、`packages/components`
- [x] runtime 验收：部署后生产 `/post/165` DOM——cover img 含 `fetchpriority="high"` 与 `sizes="(max-width: 1023px) 100vw, 526px"`、preload link 仍在 — `apps/site`
- [x] 变更说明回填 PR body — issue

## 结果
- 实际耗时: 约 40min
- 验证:
  - **TDD**: seo-post-cover-sizes.test.mjs 2 条契约先红后绿（第一版断言正则大小写不匹配修一次；测试文件 repoRoot 相对路径 bug 修一次）
  - **静态检查**: tsc --noEmit 0 错；oxlint apps/site 与 packages/components/image 均 0 错
  - **全量**: 179 测试，18 挂与 B2 变更基线同批存量（第 19 个为本人测试正则 bug 已修）
  - **runtime 验收**: 以部署后生产 curl 为权威——`/post/165` cover img 应含 `fetchpriority="high"` 与 `sizes="(max-width: 1023px) 100vw, 526px"`，preload link 仍在
- 流程备注/偏差:
  - task-6（PR body 回填）时序原因在 review 前勾结
- 部署后复测清单（https://wuh.site）: `/post/165` cover img `fetchpriority="high"` + `sizes="(max-width: 1023px) 100vw, 526px"`
- 交付发布: 待 PR 合并后按 build-config.md 发布流程执行

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/first-load-performance.md（新增：Next 16 priority 与 fetchPriority 解耦——preload 照发但 img 属性需显式传 fetchPriority='high'；fill 模式必须显式 sizes，默认 100vw 会按视口选档造成超需；source 追加本 brief）
- **理由:** priority→fetchPriority 解耦是 Next 16 升级带来的长期陷阱，fill+sizes 是所有 cover 类图片的通用约束

## 关联
- GitHub issue: #438 未纳入项 F（处方来源，建议名沿用）
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
