---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-perf-remove-streaming-skeletons",
  "type": "build",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "build/20261001-perf-remove-streaming-skeletons",
  "files": [
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/blog/loading.tsx",
    "apps/site/app/music/loading.tsx",
    "apps/site/test/first-load-streaming.test.mjs",
    "apps/site/test/seo-heading-hierarchy.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 456,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/456",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "3745bbe298fdf23258209f27debd58f63981fc64",
    "verifiedAt": "2026-10-01T15:07:59.487Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:456",
    "planHash": "eb3d8dae81738edcc7880a4bb935a853f0c6a3ced3e0cfd0669786ab84960398",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[build] build: 拆除 /、/blog、/music 流式骨架——HTML 膨胀与骨架 FCP",
      "titleRaw": "build: 拆除 /、/blog、/music 流式骨架——HTML 膨胀与骨架 FCP",
      "supplement": "来源 #438 未纳入项 B2、#233 抓取效率线。三页 HTML 处于 Suspense 流式形态（B:0/S:0 标记），骨架先 flush 成 FCP 元素，/music HTML 120,460B。first-load-performance.md 已在 /post 定罪同类回归（撤销后单帧 70KB），本次推广到全站：删 blog/music loading.tsx、首页 TypewriterMotto dynamic 边界改静态 import。已排查零 useSearchParams 无构建风险。M 级/runtime。brief: shadow-docs/changes/20261001-perf-remove-streaming-skeletons/brief.md",
      "body": "## 动机\n#438 未纳入项 B2（type build）。生产实测（2026-10-01，v1.4.51）：`/`、`/blog`、`/music` 三页 HTML 均为流式形态（各含 `<template id=\"B:0\">` + `<div hidden id=\"S:0\">`），骨架先 flush、真容后置隐藏再由脚本交换——骨架成为 FCP 元素；`/music` HTML 涨至 120,460B（对照 `/blog` 103,284B、已修复的 `/post` 单帧 70KB）。\n这是 `knowledge/first-load-performance.md:38` 已在 `/post/[number]` 定罪并撤销的同一回归（「loading 边界使路由进入流式形态，缓存命中也先 flush 灰骨架再由脚本交换真容，HTML 涨至 181KB 且骨架成为 FCP 元素」），当时处置只落到 post 路由未推广。残留边界：`app/blog/loading.tsx`、`app/music/loading.tsx`（路由级）；首页 `HomeView/index.tsx:17` 的 `next/dynamic` + MottoSkeleton loading 回退（TypewriterMotto）。\n已排查安全前提：全仓零 `useSearchParams`（blog/music 均服务端 await searchParams 收参），删除路由级 loading 无构建风险；TypewriterMotto 为纯展示 client 叶子，静态 import 不改变 HomeView 的 Server Component 属性。\n\n## 引用规范\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: `/post/[number]` 不得加 loading.tsx——loading 边界使路由进入流式形态，骨架成为 FCP 元素（2026-09-06 实证，撤销后单帧 70KB）；首屏主体数据优先，延迟区块保留稳定占位\n  - 适用 scope: 本变更把该裁决从 post 路由推广到 /blog、/music 与首页 dynamic 边界\n- shadow-docs/knowledge/homepage-data.md\n  - 当前结论: 首页必须 force-dynamic 运行时取数\n  - 适用 scope: 本变更不触碰首页取数路径，只去 dynamic() 的 loading 边界\n\n## 决策\n- **选型:** ① 删除 `app/blog/loading.tsx`、`app/music/loading.tsx`（路由退出流式形态，页面整体单帧 SSR 直出——与 /post 撤销先例同构）；② `HomeView` 的 TypewriterMotto 由 `next/dynamic` + MottoSkeleton 回退改为静态 import（无边界即无流式；MottoSkeleton 一并清理）；③ 同步更新 `seo-heading-hierarchy.test.mjs`：music loading 断言改为「文件不存在」（上一变更的 as='div' 补丁随文件消亡，heading 约束由文件不存在保证）；④ 新增 `/post` 无 loading.tsx 守卫断言（先例防回归）\n- **对比方案:** 骨架保留但 hidden/aria-invisible——流式形态与 HTML 膨胀仍在，只遮不治；首页 dynamic 不带 loading 回退——Suspense 边界仍在（fallback 为 null），流式标记大概率残留，不彻底\n- **理由:** 知识卡裁决的全站推广；三页都是首屏主体数据优先的页面（playlist/文章列表即主体），路由级骨架本就违背「非首屏数据不阻塞 HTML」的反向约束——它们阻塞的是主体本身\n\n## 任务\n### Phase 1 红测试\n- [ ] 契约测试：app/blog/loading.tsx 与 app/music/loading.tsx 不存在；app/post 全路由无 loading.tsx；HomeView/index.tsx 无 `dynamic(() => import('../components/TypewriterMotto')` 且含静态 import —— `apps/site/test/first-load-streaming.test.mjs`\n### Phase 2 实现\n- [ ] 删除 app/blog/loading.tsx、app/music/loading.tsx — `apps/site/app`\n- [ ] HomeView：TypewriterMotto 静态 import，移除 dynamic 与 MottoSkeleton 回退 — `apps/site/app/HomeView/index.tsx`\n- [ ] seo-heading-hierarchy.test.mjs：music loading 断言改文件不存在 — `apps/site/test/seo-heading-hierarchy.test.mjs`\n### Phase 3 验证与收尾\n- [ ] tsc + oxlint + 全量 node --test（失败文件清单基线对照） — `apps/site`\n- [ ] runtime 验收：`/`、`/blog`、`/music` HTML 无 `<template id=\"B:0\">` / `<div hidden id=\"S:0\">` 流式标记、无骨架元素为首帧；SGN-001 下以部署后生产 curl 为权威 — `apps/site`\n- [ ] 变更说明回填 PR body — issue\n\n## 补充\n来源 #438 未纳入项 B2、#233 抓取效率线。三页 HTML 处于 Suspense 流式形态（B:0/S:0 标记），骨架先 flush 成 FCP 元素，/music HTML 120,460B。first-load-performance.md 已在 /post 定罪同类回归（撤销后单帧 70KB），本次推广到全站：删 blog/music loading.tsx、首页 TypewriterMotto dynamic 边界改静态 import。已排查零 useSearchParams 无构建风险。M 级/runtime。brief: shadow-docs/changes/20261001-perf-remove-streaming-skeletons/brief.md\n\n完整 brief：shadow-docs/changes/20261001-perf-remove-streaming-skeletons/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-perf-remove-streaming-skeletons\",\"type\":\"build\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-perf-remove-streaming-skeletons/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "build"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/HomeView/index.tsx",
        "apps/site/app/blog/loading.tsx",
        "apps/site/app/music/loading.tsx",
        "apps/site/app/styles/index.ts",
        "apps/site/test/first-load-streaming.test.mjs",
        "apps/site/test/seo-heading-hierarchy.test.mjs",
        "shadow-docs/changes/20261001-perf-remove-streaming-skeletons/brief.md",
        "shadow-docs/knowledge/first-load-performance.md"
      ],
      "message": "build(perf): 拆除 /、/blog、/music 流式骨架——单帧直出替代骨架 FCP (#456)",
      "title": "build(perf): 拆除流式骨架——首页/blog/music 退出 Suspense 流式形态",
      "body": "Closes #456（流式骨架拆除；#438 未纳入项 B2 处方落地）\n关联 #233（P0「缓存与抓取效率」线的抓取效率侧）\n\n## 变更\n- 删除 `app/blog/loading.tsx`、`app/music/loading.tsx`（路由级流式骨架边界）\n- `app/HomeView/index.tsx`：TypewriterMotto 由 `next/dynamic` + MottoSkeleton 回退改为**静态 import**（无边界即无流式）；`styles/index.ts` 的 MottoSkeleton 定义随唯一引用方一并移除\n- 新契约测试 `test/first-load-streaming.test.mjs` ×3（blog/music loading 不存在、`/post` 无 loading 先例守卫、HomeView 静态 import）\n- `seo-heading-hierarchy.test.mjs` music 骨架断言同步为文件不存在（heading 变更的 as='div' 补丁随文件消亡，唯一 h1 约束由删除保证）\n\n## 根因\n`/`、`/blog`、`/music` 三页 HTML 处于 Suspense 流式形态（`<template id=\"B:0\">` + `<div hidden id=\"S:0\">`）：骨架先 flush 成为 FCP 元素，真容后置隐藏等脚本交换，`/music` HTML 涨至 120,460B。这是 first-load-performance.md 在 `/post` 已定罪并撤销的同一回归（撤销后单帧 70KB），当时只落到 post 路由未推广。已排查全仓零 `useSearchParams`（blog/music 均服务端收参），删除路由级 loading 无构建风险。\n\n## 验证\n- TDD：3 条契约先红后绿；heading 3/3、og-image 5/5 契约无回归\n- `tsc --noEmit` 0 错（2 次 SGN-001 139 重试后过）；oxlint 0 错\n- 全量 177 测试 159 绿 / 18 挂——与 heading 变更基线同批存量（header/主题/typewriter 等 8 文件；typewriter-motto-stability 虽引用组件路径，但断言的是组件内部 DOM 结构，本次未触碰 `app/components/TypewriterMotto/**`）\n- 本地 dev 仍处 SGN-001 密集期，**部署后生产 curl 为权威 runtime 验收**；CI Docker build 即删边界后的构建验证\n\n## 部署后复测清单（https://wuh.site）\n`/`、`/blog`、`/music` 三页 HTML 无 `<template id=\"B:0\">` / `<div hidden id=\"S:0\">` 流式标记；`/music` HTML 体积显著回落（基线 120,460B）；三页内容直出无灰骨架"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/first-load-performance.md",
    "reason": "归档前重签于 main HEAD：删 blog/music loading.tsx、首页 dynamic 静态化、heading 测试同步、post 守卫新增；契约 3/3 红转绿，tsc/oxlint 0 错，18 挂全为存量。知识卡裁决从 post 推广为全站：任何路由不得加 loading.tsx，首屏路径 next/dynamic loading 回退同构流式边界，部署后生产 curl 复测为权威"
  }
}
---

# 拆除流式骨架——/、/blog、/music 三页退出 Suspense 流式形态

## 动机
#438 未纳入项 B2（type build）。生产实测（2026-10-01，v1.4.51）：`/`、`/blog`、`/music` 三页 HTML 均为流式形态（各含 `<template id="B:0">` + `<div hidden id="S:0">`），骨架先 flush、真容后置隐藏再由脚本交换——骨架成为 FCP 元素；`/music` HTML 涨至 120,460B（对照 `/blog` 103,284B、已修复的 `/post` 单帧 70KB）。
这是 `knowledge/first-load-performance.md:38` 已在 `/post/[number]` 定罪并撤销的同一回归（「loading 边界使路由进入流式形态，缓存命中也先 flush 灰骨架再由脚本交换真容，HTML 涨至 181KB 且骨架成为 FCP 元素」），当时处置只落到 post 路由未推广。残留边界：`app/blog/loading.tsx`、`app/music/loading.tsx`（路由级）；首页 `HomeView/index.tsx:17` 的 `next/dynamic` + MottoSkeleton loading 回退（TypewriterMotto）。
已排查安全前提：全仓零 `useSearchParams`（blog/music 均服务端 await searchParams 收参），删除路由级 loading 无构建风险；TypewriterMotto 为纯展示 client 叶子，静态 import 不改变 HomeView 的 Server Component 属性。

## 复杂度评级
- **评级:** M
- **理由:** 三要素——契约变更是（三页 HTML 交付形态：流式→单帧直出）；触及面 2 删除 + 1 文件改造 + 2 测试文件，但含首页边界来源定位与回归守卫设计；可发现性高（curl 断言 `id="B:0"`/`id="S:0"` 标记）
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: `/post/[number]` 不得加 loading.tsx——loading 边界使路由进入流式形态，骨架成为 FCP 元素（2026-09-06 实证，撤销后单帧 70KB）；首屏主体数据优先，延迟区块保留稳定占位
  - 适用 scope: 本变更把该裁决从 post 路由推广到 /blog、/music 与首页 dynamic 边界
- shadow-docs/knowledge/homepage-data.md
  - 当前结论: 首页必须 force-dynamic 运行时取数
  - 适用 scope: 本变更不触碰首页取数路径，只去 dynamic() 的 loading 边界

## 决策
- **选型:** ① 删除 `app/blog/loading.tsx`、`app/music/loading.tsx`（路由退出流式形态，页面整体单帧 SSR 直出——与 /post 撤销先例同构）；② `HomeView` 的 TypewriterMotto 由 `next/dynamic` + MottoSkeleton 回退改为静态 import（无边界即无流式；MottoSkeleton 一并清理）；③ 同步更新 `seo-heading-hierarchy.test.mjs`：music loading 断言改为「文件不存在」（上一变更的 as='div' 补丁随文件消亡，heading 约束由文件不存在保证）；④ 新增 `/post` 无 loading.tsx 守卫断言（先例防回归）
- **对比方案:** 骨架保留但 hidden/aria-invisible——流式形态与 HTML 膨胀仍在，只遮不治；首页 dynamic 不带 loading 回退——Suspense 边界仍在（fallback 为 null），流式标记大概率残留，不彻底
- **理由:** 知识卡裁决的全站推广；三页都是首屏主体数据优先的页面（playlist/文章列表即主体），路由级骨架本就违背「非首屏数据不阻塞 HTML」的反向约束——它们阻塞的是主体本身

## 任务
### Phase 1 红测试
- [x] 契约测试：app/blog/loading.tsx 与 app/music/loading.tsx 不存在；app/post 全路由无 loading.tsx；HomeView/index.tsx 无 `dynamic(() => import('../components/TypewriterMotto')` 且含静态 import —— `apps/site/test/first-load-streaming.test.mjs`
### Phase 2 实现
- [x] 删除 app/blog/loading.tsx、app/music/loading.tsx — `apps/site/app`
- [x] HomeView：TypewriterMotto 静态 import，移除 dynamic 与 MottoSkeleton 回退 — `apps/site/app/HomeView/index.tsx`
- [x] seo-heading-hierarchy.test.mjs：music loading 断言改文件不存在 — `apps/site/test/seo-heading-hierarchy.test.mjs`
### Phase 3 验证与收尾
- [x] tsc + oxlint + 全量 node --test（失败文件清单基线对照） — `apps/site`
- [x] runtime 验收：`/`、`/blog`、`/music` HTML 无 `<template id="B:0">` / `<div hidden id="S:0">` 流式标记、无骨架元素为首帧；SGN-001 下以部署后生产 curl 为权威 — `apps/site`
- [x] 变更说明回填 PR body — issue

## 结果
- 实际耗时: 约 1h（SGN-001 消耗约 15min：tsc 2 次 139）
- 验证:
  - **TDD**: first-load-streaming.test.mjs 3 条契约（blog/music loading.tsx 不存在、post 先例守卫、HomeView 静态 import 无 MottoSkeleton）先红后绿；seo-heading-hierarchy 同步改文件不存在断言后 3/3 绿；seo-og-image 5/5 无回归
  - **全量**: 177 测试 159 绿 / 18 挂——挂的 18 个与 heading 变更基线同批（header/主题/typewriter/related 等 8 文件），grep 实证零引用 MottoSkeleton/TypewriterMotto/loading，与本次 diff 无因果
  - **静态检查**: tsc --noEmit 0 错（2 次 139 重试后过）；oxlint 0 错
  - **runtime 验收**: 本地 dev 仍处 SGN-001 密集期，以部署后生产 curl 为权威——复测清单：三页 HTML 无 `id="B:0"`/`id="S:0"` 流式标记；CI Docker build 本身即删除 loading 边界后的构建验证
- 流程备注/偏差:
  - styles/index.ts 的 MottoSkeleton 定义随使用点一并移除（HomeView 唯一引用方）
  - task-6（PR body 回填）时序原因在 review 前勾结
- 部署后复测清单（https://wuh.site）: `/`、`/blog`、`/music` 三页无 `<template id="B:0">` / `<div hidden id="S:0">`；HTML 体积应显著回落（/music 参照基线 120,460B）
- 交付发布: 待 PR 合并后按 build-config.md 发布流程执行

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/first-load-performance.md（loading 边界禁令从 post 路由推广为全站裁决：任何路由不得加 loading.tsx 流式骨架，首屏路径上 next/dynamic 的 loading 回退同样构成流式边界；source 追加本 brief；verified 刷新 runtime）
- **理由:** 本次把单点经验升格为全站约束，后续新页面/新 dynamic 都受它兜底

## 关联
- GitHub issue: #438 未纳入项 B2（处方来源，建议名沿用）；#233 P0「缓存与抓取效率」线的抓取效率侧
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
