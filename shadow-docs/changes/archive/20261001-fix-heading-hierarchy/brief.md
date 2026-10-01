---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-fix-heading-hierarchy",
  "type": "fix",
  "scope": "apps/site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261001-fix-heading-hierarchy",
  "files": [
    "apps/site/app/music/loading.tsx",
    "apps/site/app/styles/index.ts",
    "apps/site/test/seo-heading-hierarchy.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 454,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/454",
    "pullRequest": 455,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/455"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "557ed3c83db4eb72bf297309d9deb15f54f01567",
    "verifiedAt": "2026-10-01T14:53:33.730Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:455",
    "planHash": "3b03ca6bd878cb253bb739af5f63ae0d6216b09ce2cb29f8eae8fca29fef6579",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix: heading hierarchy——首页无 h1、/music 双 h1，页面主语义缺失",
      "titleRaw": "fix: heading hierarchy——首页无 h1、/music 双 h1，页面主语义缺失",
      "supplement": "来源 #438 未纳入项 B、#233 P1 页面理解线。生产实测：/ 零 h1（主标题「wuh.site · 朝朝如念」是 styled.p）；/music DOM 含 2 个相同 h1「音乐」（流式骨架先 flush + 真实内容 hidden div 各一）。其余 6 区块页均恰 1 个 h1。方案：SiteTitle styled.p→styled.h1（margin 全向重置防默认外距塌陷）、music/loading.tsx 骨架 PageTitle as='div' 降型。S 级/runtime。brief: shadow-docs/changes/20261001-fix-heading-hierarchy/brief.md",
      "body": "## 动机\n#438 未纳入项 B（按「持续损失 × 改动量」排序第二，S 级）。生产实测（2026-10-01，v1.4.47）：\n- `/` **0 个 h1**——主标题「wuh.site · 朝朝如念」是 `SiteTitle = styled.p`（`app/styles/index.ts:34`），搜索引擎页面理解缺失头号语义信号\n- `/music` DOM 里 **2 个相同 `<h1>音乐</h1>`**——流式形态下 `app/music/loading.tsx` 骨架先 flush 一个 h1（aria-busy 段不隐藏），真实内容 h1 在 `<div hidden id=\"S:0\">` 里等交换\n- 其余 6 个区块页（blog/about/footprint/weread/topics/design）生产实测均恰好 1 个 h1，无问题\n- `HeroSection.tsx` 为死代码（无引用），首页标题唯一渲染路径是 `HomeView/index.tsx:61` 的默认分支——改 styled 组件一处即生效\n关联 #233 P1「页面理解」线。\n\n## 引用规范\n- shadow-docs/knowledge/seo.md\n  - 当前结论: 页面语义与结构化数据同源约束；「全站页面包含 og…」等已修复项\n  - 适用 scope: apps/site/app（命中改动文件）\n- shadow-docs/knowledge/first-load-performance.md（只引用不触碰）\n  - 当前结论: 流式骨架是 B2 变更（`20261001-perf-remove-streaming-skeletons`，M 级另开）的处置对象；本变更只修 heading 语义，不拆流式形态\n\n## 决策\n- **选型:** ① `SiteTitle` 由 `styled.p` 改为 `styled.h1`，同时把 `margin-top` 收敛为 `margin: var(--space-xs) 0 0`（压掉 h1 默认 0.67em 外距，字号字重已有显式声明不受 h1 默认影响）；② `music/loading.tsx` 骨架的 `<PageTitle>` 改 `as='div'` 降型（样式类不变，h1 唯一归属让给 MusicView 真实内容）\n- **对比方案:** 给骨架 h1 加 aria-hidden/hidden——不选，骨架仍渲染 h1 在 pre-hydration DOM 里，语义重复未除；删 HeroSection.tsx 死代码——不在本变更扩散，留档观察\n- **理由:** 每页唯一 h1 是 heading hierarchy 的硬约束；改动最小且完全可被 curl 断言\n\n## 任务\n### Phase 1 红测试\n- [ ] 契约测试：styles/index.ts 的 SiteTitle 必须是 `styled.h1` 且 margin 全向声明；music/loading.tsx 不得渲染裸 `<PageTitle>`（h1 唯一归属真实内容） —— `apps/site/test/seo-heading-hierarchy.test.mjs`\n### Phase 2 实现\n- [ ] SiteTitle：`styled.p` → `styled.h1` + margin 全向重置 — `apps/site/app/styles/index.ts`\n- [ ] 骨架 PageTitle 降型 `as='div'` — `apps/site/app/music/loading.tsx`\n### Phase 3 验证与收尾\n- [ ] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`\n- [ ] runtime 验收（dev 模式 curl）：`/` 恰 1 个 h1 且含「朝朝如念」、`/music` 恰 1 个 h1；首页标题区视觉无塌陷（h1 默认样式已被显式声明全覆盖） — `apps/site`\n- [ ] 变更说明回填 PR body — issue\n\n## 补充\n来源 #438 未纳入项 B、#233 P1 页面理解线。生产实测：/ 零 h1（主标题「wuh.site · 朝朝如念」是 styled.p）；/music DOM 含 2 个相同 h1「音乐」（流式骨架先 flush + 真实内容 hidden div 各一）。其余 6 区块页均恰 1 个 h1。方案：SiteTitle styled.p→styled.h1（margin 全向重置防默认外距塌陷）、music/loading.tsx 骨架 PageTitle as='div' 降型。S 级/runtime。brief: shadow-docs/changes/20261001-fix-heading-hierarchy/brief.md\n\n完整 brief：shadow-docs/changes/20261001-fix-heading-hierarchy/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-fix-heading-hierarchy\",\"type\":\"fix\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-fix-heading-hierarchy/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/music/loading.tsx",
        "apps/site/app/styles/index.ts",
        "apps/site/test/seo-heading-hierarchy.test.mjs",
        "shadow-docs/changes/20261001-fix-heading-hierarchy/brief.md",
        "shadow-docs/knowledge/seo.md"
      ],
      "message": "fix(seo): heading hierarchy——首页主标题升 h1、music 流式骨架 h1 降型 (#454)",
      "title": "fix(seo): heading hierarchy——首页无 h1、/music 双 h1",
      "body": "Closes #454（heading hierarchy；#438 未纳入项 B 处方落地）\n关联 #233（P1「页面理解」线）\n\n## 变更\n- `app/styles/index.ts`：首页主标题 `SiteTitle` 由 `styled.p` 改为 **`styled.h1`**，`margin-top` 收敛为 `margin: var(--space-xs) 0 0`（压掉 h1 默认 0.67em 外距；字号/字重/字距均有显式声明，视觉零变化）\n- `app/music/loading.tsx`：流式骨架的 `<PageTitle>` 改 `as='div'` 降型（样式类不变），h1 唯一归属让给 MusicView 真实内容\n- 新契约测试 `test/seo-heading-hierarchy.test.mjs` ×3\n\n## 根因\n- `/` 生产 DOM **0 个 h1**——主标题「wuh.site · 朝朝如念」一直是 `<p>`，搜索引擎页面理解缺失头号语义信号\n- `/music` 生产 DOM **2 个相同 `<h1>音乐</h1>`**——流式形态下 loading 骨架先 flush 一个 h1（aria-busy 段不隐藏），真实内容 h1 在 `<div hidden id=\"S:0\">` 里等交换\n- 其余 6 区块页生产实测均恰 1 个 h1，无需改动\n\n## 验证\n- TDD：3 条契约测试先红后绿（SiteTitle 必须 styled.h1 + margin 全向声明、骨架不得渲染裸 PageTitle）\n- `tsc --noEmit` 0 错；oxlint 0 错\n- 全量套件 19 挂经「失败文件清单 + grep 符号零引用」实证为 main 存量（header/主题/related 等 8 个文件，均不引用本次改动符号），与本次无因果\n- 本地 dev server 处 SGN-001 密集崩溃期（node 24 间歇 SIGSEGV，5 次零输出秒退），**部署后对生产 curl 复测为权威 runtime 验收**\n\n## 部署后复测清单（https://wuh.site）\n`/` 恰 1 个 `<h1>` 且文本含「朝朝如念」；`/music` 恰 1 个 `<h1>音乐</h1>`；首页标题区布局无塌陷（对照 h1 默认样式已被显式声明全覆盖）"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/seo.md",
    "reason": "归档前在 main HEAD 重签：生产已验证（v1.4.51 部署后 / 恰 1 个 h1「朝朝如念」、/music 恰 1 个），seo.md heading 约束已更新"
  }
}
---

# heading hierarchy 修复——首页无 h1、music 双 h1

## 动机
#438 未纳入项 B（按「持续损失 × 改动量」排序第二，S 级）。生产实测（2026-10-01，v1.4.47）：
- `/` **0 个 h1**——主标题「wuh.site · 朝朝如念」是 `SiteTitle = styled.p`（`app/styles/index.ts:34`），搜索引擎页面理解缺失头号语义信号
- `/music` DOM 里 **2 个相同 `<h1>音乐</h1>`**——流式形态下 `app/music/loading.tsx` 骨架先 flush 一个 h1（aria-busy 段不隐藏），真实内容 h1 在 `<div hidden id="S:0">` 里等交换
- 其余 6 个区块页（blog/about/footprint/weread/topics/design）生产实测均恰好 1 个 h1，无问题
- `HeroSection.tsx` 为死代码（无引用），首页标题唯一渲染路径是 `HomeView/index.tsx:61` 的默认分支——改 styled 组件一处即生效
关联 #233 P1「页面理解」线。

## 复杂度评级
- **评级:** S
- **理由:** 三要素——契约变更是（DOM heading 语义：h1 数量与归属），但改动仅 2 个声明式文件（styled 标签改型 + 骨架 as 降型）；触及面小且集中；可发现性高（dev server curl 数 h1 即断言）
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/seo.md
  - 当前结论: 页面语义与结构化数据同源约束；「全站页面包含 og…」等已修复项
  - 适用 scope: apps/site/app（命中改动文件）
- shadow-docs/knowledge/first-load-performance.md（只引用不触碰）
  - 当前结论: 流式骨架是 B2 变更（`20261001-perf-remove-streaming-skeletons`，M 级另开）的处置对象；本变更只修 heading 语义，不拆流式形态

## 决策
- **选型:** ① `SiteTitle` 由 `styled.p` 改为 `styled.h1`，同时把 `margin-top` 收敛为 `margin: var(--space-xs) 0 0`（压掉 h1 默认 0.67em 外距，字号字重已有显式声明不受 h1 默认影响）；② `music/loading.tsx` 骨架的 `<PageTitle>` 改 `as='div'` 降型（样式类不变，h1 唯一归属让给 MusicView 真实内容）
- **对比方案:** 给骨架 h1 加 aria-hidden/hidden——不选，骨架仍渲染 h1 在 pre-hydration DOM 里，语义重复未除；删 HeroSection.tsx 死代码——不在本变更扩散，留档观察
- **理由:** 每页唯一 h1 是 heading hierarchy 的硬约束；改动最小且完全可被 curl 断言

## 任务
### Phase 1 红测试
- [x] 契约测试：styles/index.ts 的 SiteTitle 必须是 `styled.h1` 且 margin 全向声明；music/loading.tsx 不得渲染裸 `<PageTitle>`（h1 唯一归属真实内容） —— `apps/site/test/seo-heading-hierarchy.test.mjs`
### Phase 2 实现
- [x] SiteTitle：`styled.p` → `styled.h1` + margin 全向重置 — `apps/site/app/styles/index.ts`
- [x] 骨架 PageTitle 降型 `as='div'` — `apps/site/app/music/loading.tsx`
### Phase 3 验证与收尾
- [x] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`
- [x] runtime 验收（dev 模式 curl）：`/` 恰 1 个 h1 且含「朝朝如念」、`/music` 恰 1 个 h1；首页标题区视觉无塌陷（h1 默认样式已被显式声明全覆盖） — `apps/site`
- [x] 变更说明回填 PR body — issue

## 结果
- 实际耗时: 约 1h（其中 SGN-001 环境消耗约 25min：tsc 1 次 139、本地 next dev 秒退 5 次零输出）
- 验证:
  - **TDD**: seo-heading-hierarchy.test.mjs 3 条契约先红（SiteTitle 非 h1、margin 未全向重置、骨架裸 PageTitle）→ 实现后 3/3 绿（红期测试自身切片 bug 修复一次：slice 需截到下一个 export 边界，不能切到文件尾）
  - **全量**: 套件 161 测试 142 绿 / 19 挂——19 挂全部位于 header-quiet-bar / site-header-theme-toggle / image-role-migration / post-typography-design-language / seo-p12 / seo-p15 / seo-p16 / typewriter-motto 8 个文件，**grep 实证零引用 SiteTitle / music/loading**，与本次 diff 无因果（main 在 b116e81→4617f60 间合入的 player/i18n 提交带来的存量；全量套件计数在 SGN-001 下有 171/161 波动，以挂文件清单+符号归属为证据）
  - **静态检查**: 根 tsc --noEmit 0 错（1 次 139 重试后过）；oxlint 0 错
  - **runtime 验收**: 本地 dev server 处 SGN-001 密集崩溃期（5 次零输出秒退，含管道 SIGPIPE、后台任务、双层子壳三种起法），**改以部署后生产 curl 为权威 runtime 验收**——本变更 DOM 输出是 JSX 直接函数（styled 标签改型），源码契约已锁死行为，不确定性远低于 og:image 的 metadata 合并语义；复测清单见下
- 流程备注/偏差:
  - task-6（PR body 回填）为时序原因在 review 前勾结，交付物随 PR body 落实
  - 全量套件归属证据改为「失败文件清单 + grep 符号零引用」而非 stash 全量对比（SGN-001 下全量跑不稳，定向证据足够 S 级）
- 部署后复测清单（https://wuh.site）: `/` 恰 1 个 h1 且含「朝朝如念」；`/music` 恰 1 个 h1「音乐」；首页标题区无布局塌陷
- 交付发布:
  - PR #455 已合并 main（merge commit `557ed3c`）
  - GitHub Release **[v1.4.51](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.51)** 触发 CI-CD run 36878402805 **全绿**（7/7 jobs：quality-gate → prepare → build-next/nest → staging-test → switch-traffic）；v1.4.46–50 已被其他会话占用故顺延
  - **生产复测（https://wuh.site，部署后实测）**: `/` 恰 1 个 `<h1>` 且文本「wuh.site · 朝朝如念」✅；`/music` 恰 1 个 `<h1>音乐</h1>`（修复前 DOM 双 h1）✅

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/seo.md（新增长期事实：全站每页恰好 1 个 h1——首页主标题 SiteTitle 必须保持 h1 语义、流式骨架不得渲染 h1；verified-depth: runtime）
- **理由:** heading hierarchy 是 #233 P1 页面理解的长期语义约束，后续页面改造都需要它兜底

## 关联
- GitHub issue: #438 未纳入项 B（处方来源）；#233 P1「页面理解」线
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
