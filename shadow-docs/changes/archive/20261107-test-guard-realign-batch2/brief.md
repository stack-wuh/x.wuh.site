---
{
  "schema": "shadow-dev/v1",
  "name": "20261107-test-guard-realign-batch2",
  "type": "test",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "test/20261107-test-guard-realign-batch2",
  "files": [
    "apps/site/test/contact-dialog-paper.test.mjs",
    "apps/site/test/header-quiet-bar.test.mjs",
    "apps/site/test/image-role-migration.test.mjs",
    "apps/site/test/post-typography-design-language.test.mjs",
    "apps/site/test/seo-p12-related-posts.test.mjs",
    "apps/site/test/seo-p13-topic-pages.test.mjs",
    "apps/site/test/seo-p14-sitemap-noindex.test.mjs",
    "apps/site/test/site-header-theme-toggle.test.mjs",
    "apps/site/test/soft-navigation.test.mjs",
    "apps/site/test/typewriter-motto-stability.test.mjs",
    "packages/components/test/image-role-contract.test.mjs",
    "scripts/run-tests.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 577,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/577",
    "pullRequest": 578,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/578"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "521fcf1015ad8d85c521ca486e93efcdddd1759f",
    "verifiedAt": "2026-11-07T14:19:28.625Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:578",
    "planHash": "2023daa571c7af73e8bd9513a2c34223151ee053b0c7481e28431c3311b02db3",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[test] [Audit #568] 红守卫对账批次 2：11 隔离文件甄别对齐、隔离清零",
      "titleRaw": "[Audit #568] 红守卫对账批次 2：11 隔离文件甄别对齐、隔离清零",
      "supplement": "审计 #568 P1-31 跟进：20261107-chore-audit-quality-gates 隔离的 11 个红守卫文件完成甄别（seo-p14 环境误报出清单，其余 10 文件 22 红全为漂移零真回归），逐文件等强对齐断言，隔离棘轮清零。详见仓库 shadow-docs/changes/20261107-test-guard-realign-batch2/brief.md",
      "body": "## 动机\n20261107-chore-audit-quality-gates 把 11 个长期红守卫文件隔离出 gate（25 用例红，原因入册）。本变更完成对账甄别与断言对齐，隔离清单清零。\n\n**甄别结论（2026-11-07 全量取证）**：\n- **seo-p14-sitemap-noindex：非回归非漂移**——node22/24 双绿 5/5，基线红属 SGN 环境态（swap 高压期误报），直接出清单\n- **其余 10 文件 22 红全部为守卫漂移**（断言落后于有意的实现演进），零代码回归：\n  - image-role-contract：Image 类型拆分到 types.ts 后守卫仍只读 index.tsx（ImageRole/imageClassName/imageStyle/ROLE_PRESETS 全在 types.ts，角色集合与预设值未变）\n  - image-role-migration：PostHeader 的 AuthorAvatar 已随文章头重设计移除，avatar role 真实消费方=PostComments/AboutView（role='avatar' 在案）\n  - post-typography-design-language：「更新于」字面量已 i18n 化（t('post.view.updatedAt')），条件语义（updatedDate && 才显示）仍在\n  - seo-p12-related-posts：与绿守卫 related-posts.test.mjs 双守卫口径冲突——两条视觉形态断言对齐现势 thread 样式\n  - seo-p13-topic-pages：blog 行嵌套锚点断言 vs 现行行结构\n  - soft-navigation：①app/styles/index.ts:147 注释含「Link→<a>」被裸正则误报（守卫需剥注释）②分页禁用态已由 NavLinkStatic 载体结构性摘 href（as='span' 断言过时）③layout/specs.tsx 已迁走（页脚断言路径指向 footer.tsx）\n  - contact-dialog-paper：560 断点已整体移除（hover/reduced-motion 走 matchMedia），「BREAKPOINTS 导入+media 查询」形态过时\n  - header-quiet-bar / site-header-theme-toggle：外观入口/钤印/调色台形态演进后 6+6 条断言失配\n  - typewriter-motto-stability：Container 样式块结构重排 + Sizer/PHRASES 推导形态变化\n\n## 引用规范\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 测试 sweep 段（隔离棘轮只准缩小不准扩大；loader 配方）\n  - 适用 scope: scripts/run-tests.mjs、apps/site/test、packages/*/test\n- shadow-docs/signals.md SGN-001/SGN-002\n  - 当前结论: 多文件合并跑瞬态崩溃判红前先复跑；node 版本守卫形态\n  - 适用 scope: 本变更甄别方法论（seo-p14 环境误报的判定依据）\n\n## 决策\n- **选型:** 逐文件对账——按甄别结论修改断言形态（等强替换），seo-p14 出清单，全部走既有 sweep 验证\n- **对比方案:** 删守卫（放弃回归保护，否——守卫意图仍有效）；真回归先修（甄别已证零真回归）\n- **理由:** 守卫的价值在于断言与设计意图同步；#570 单文件对账先例的批量版\n\n## 任务\n### Phase 1（逐文件对账，每文件改后单独跑绿）\n- [ ] task 1 — `apps/site/test/soft-navigation.test.mjs` — 扫描剥注释（误报修复）；styled.a 白名单剔除死条目 ContactCard#LinkButton（已改 styled.span）；分页禁用态断言改 NavLinkStatic 形态；页脚断言路径 specs.tsx→footer.tsx 现势结构\n- [ ] task 2 — `packages/components/test/image-role-contract.test.mjs` — 断言源补 types.ts（ImageRole/预设/className 通道现址）\n- [ ] task 3 — `apps/site/test/image-role-migration.test.mjs` — avatar role 断言改真实消费方（PostComments/AboutView）\n- [ ] task 4 — `apps/site/test/post-typography-design-language.test.mjs` — 更新提示线 i18n 形态对齐（条件语义等强保留）\n- [ ] task 5 — `apps/site/test/seo-p12-related-posts.test.mjs` + `seo-p13-topic-pages.test.mjs` — related thread 形态/嵌套锚点断言对齐现势\n- [ ] task 6 — `apps/site/test/header-quiet-bar.test.mjs` + `site-header-theme-toggle.test.mjs` — 外观入口/钤印/调色台 12 条对齐\n- [ ] task 7 — `apps/site/test/contact-dialog-paper.test.mjs` + `typewriter-motto-stability.test.mjs` — 断点/结构形态对齐\n\n### Phase 2（收口）\n- [ ] task 8 — `scripts/run-tests.mjs` — QUARANTINE 清零（11→0），头注释同步\n- [ ] task 9 — 全量 sweep 双 node 绿（node22 mise + node24 ambient，含 CI 模拟态）；CI run 绿\n\n## 补充\n审计 #568 P1-31 跟进：20261107-chore-audit-quality-gates 隔离的 11 个红守卫文件完成甄别（seo-p14 环境误报出清单，其余 10 文件 22 红全为漂移零真回归），逐文件等强对齐断言，隔离棘轮清零。详见仓库 shadow-docs/changes/20261107-test-guard-realign-batch2/brief.md\n\n完整 brief：shadow-docs/changes/20261107-test-guard-realign-batch2/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261107-test-guard-realign-batch2\",\"type\":\"test\",\"scope\":\"site\",\"status\":\"branched\",\"branch\":\"test/20261107-test-guard-realign-batch2\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261107-test-guard-realign-batch2/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "test"
      ]
    },
    "commit": {
      "files": [
        "apps/site/test/contact-dialog-paper.test.mjs",
        "apps/site/test/header-quiet-bar.test.mjs",
        "apps/site/test/image-role-migration.test.mjs",
        "apps/site/test/post-typography-design-language.test.mjs",
        "apps/site/test/seo-p12-related-posts.test.mjs",
        "apps/site/test/seo-p13-topic-pages.test.mjs",
        "apps/site/test/site-header-theme-toggle.test.mjs",
        "apps/site/test/soft-navigation.test.mjs",
        "apps/site/test/typewriter-motto-stability.test.mjs",
        "packages/components/test/image-role-contract.test.mjs",
        "scripts/run-tests.mjs"
      ],
      "message": "test(site,components): 红守卫对账批次 2——10 文件 22 用例漂移等强对齐，隔离棘轮清零（seo-p14 甄别为环境误报出清单）"
    },
    "release": {
      "files": [
        "shadow-docs/changes/20261107-test-guard-realign-batch2/brief.md",
        "shadow-docs/knowledge/build-config.md"
      ],
      "message": "docs(shadow): 红守卫对账批次 2 收口——sweep 段隔离棘轮清零记录",
      "title": "test(site,components): 红守卫对账批次 2——隔离棘轮清零、gate 恢复 41 文件全量（审计 #568）",
      "body": "PR #578 收尾：build-config.md sweep 段棘轮清零记录 + brief 终态回填。对账明细见前序提交。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/build-config.md",
    "reason": "squash 漂移门复验：main 同源重申——sweep 41 文件全量 265 用例、棘轮清零记录随 71d6ff4 入 main；无新增漂移"
  }
}
---

# 红守卫对账批次 2：11 个隔离文件甄别与断言对齐

## 动机

20261107-chore-audit-quality-gates 把 11 个长期红守卫文件隔离出 gate（25 用例红，原因入册）。本变更完成对账甄别与断言对齐，隔离清单清零。

**甄别结论（2026-11-07 全量取证）**：
- **seo-p14-sitemap-noindex：非回归非漂移**——node22/24 双绿 5/5，基线红属 SGN 环境态（swap 高压期误报），直接出清单
- **其余 10 文件 22 红全部为守卫漂移**（断言落后于有意的实现演进），零代码回归：
  - image-role-contract：Image 类型拆分到 types.ts 后守卫仍只读 index.tsx（ImageRole/imageClassName/imageStyle/ROLE_PRESETS 全在 types.ts，角色集合与预设值未变）
  - image-role-migration：PostHeader 的 AuthorAvatar 已随文章头重设计移除，avatar role 真实消费方=PostComments/AboutView（role='avatar' 在案）
  - post-typography-design-language：「更新于」字面量已 i18n 化（t('post.view.updatedAt')），条件语义（updatedDate && 才显示）仍在
  - seo-p12-related-posts：与绿守卫 related-posts.test.mjs 双守卫口径冲突——两条视觉形态断言对齐现势 thread 样式
  - seo-p13-topic-pages：blog 行嵌套锚点断言 vs 现行行结构
  - soft-navigation：①app/styles/index.ts:147 注释含「Link→<a>」被裸正则误报（守卫需剥注释）②分页禁用态已由 NavLinkStatic 载体结构性摘 href（as='span' 断言过时）③layout/specs.tsx 已迁走（页脚断言路径指向 footer.tsx）
  - contact-dialog-paper：560 断点已整体移除（hover/reduced-motion 走 matchMedia），「BREAKPOINTS 导入+media 查询」形态过时
  - header-quiet-bar / site-header-theme-toggle：外观入口/钤印/调色台形态演进后 6+6 条断言失配
  - typewriter-motto-stability：Container 样式块结构重排 + Sizer/PHRASES 推导形态变化

## 复杂度评级

- **评级:** M
- **理由:** 契约变更=11 个守卫文件的断言语义重对齐（gate 隔离棘轮清零）；触及面=10 个测试文件 + run-tests.mjs 清单；可发现性=低（守卫红绿即表达）。
- **期望验证深度:** unit（逐文件 node --test 绿 + 全量 sweep 双 node 绿）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（质量门守卫）— 把设计意图钉成机检断言。上游=各域实现；下游=quality-gate。反腐边界=只对账断言形态，不改守卫语义意图；发现真回归走代码修复不混入本变更。
- **统一语言增量:** 「守卫对账」=逐条判定漂移（改断言）/真回归（改代码）/环境误报（出清单）三分类；「隔离棘轮清零」=QUARANTINE 11→0。
- **聚合与不变量:**
  - `INV-1 全量 sweep`：对账后 gate sweep 全绿（node22 + node24 双版本，CI 模拟态含无 core/dist）
  - `INV-2 隔离棘轮`：QUARANTINE 清单 11→0，单调不增不变量保持
  - `INV-3 对账分类`：本变更只含漂移类断言修改与环境误报出清单；任何真回归判定必须走代码修复并单独记录
  - `INV-4 守卫语义`：断言修改不降低守卫意图强度（剥注释误报 ≠ 放宽扫描；形态对齐以「等强断言」替换）
- **领域事件:** quality-gate 的 test sweep 覆盖面从 30 文件恢复到 41 文件全量。

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: 测试 sweep 段（隔离棘轮只准缩小不准扩大；loader 配方）
  - 适用 scope: scripts/run-tests.mjs、apps/site/test、packages/*/test
- shadow-docs/signals.md SGN-001/SGN-002
  - 当前结论: 多文件合并跑瞬态崩溃判红前先复跑；node 版本守卫形态
  - 适用 scope: 本变更甄别方法论（seo-p14 环境误报的判定依据）

## 决策

- **选型:** 逐文件对账——按甄别结论修改断言形态（等强替换），seo-p14 出清单，全部走既有 sweep 验证
- **对比方案:** 删守卫（放弃回归保护，否——守卫意图仍有效）；真回归先修（甄别已证零真回归）
- **理由:** 守卫的价值在于断言与设计意图同步；#570 单文件对账先例的批量版

## 任务

### Phase 1（逐文件对账，每文件改后单独跑绿）
- [x] task 1 — `apps/site/test/soft-navigation.test.mjs` — 扫描剥注释（误报修复）；styled.a 白名单剔除死条目 ContactCard#LinkButton（已改 styled.span）；分页禁用态断言改 NavLinkStatic 形态；页脚断言路径 specs.tsx→footer.tsx 现势结构
- [x] task 2 — `packages/components/test/image-role-contract.test.mjs` — 断言源补 types.ts（ImageRole/预设/className 通道现址）
- [x] task 3 — `apps/site/test/image-role-migration.test.mjs` — avatar role 断言改真实消费方（PostComments/AboutView）
- [x] task 4 — `apps/site/test/post-typography-design-language.test.mjs` — 更新提示线 i18n 形态对齐（条件语义等强保留）
- [x] task 5 — `apps/site/test/seo-p12-related-posts.test.mjs` + `seo-p13-topic-pages.test.mjs` — related thread 形态/嵌套锚点断言对齐现势
- [x] task 6 — `apps/site/test/header-quiet-bar.test.mjs` + `site-header-theme-toggle.test.mjs` — 外观入口/钤印/调色台 12 条对齐
- [x] task 7 — `apps/site/test/contact-dialog-paper.test.mjs` + `typewriter-motto-stability.test.mjs` — 断点/结构形态对齐

### Phase 2（收口）
- [x] task 8 — `scripts/run-tests.mjs` — QUARANTINE 清零（11→0），头注释同步
- [x] task 9 — 全量 sweep 双 node 绿（node22 mise + node24 ambient，含 CI 模拟态）；CI run 绿

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（sweep 段隔离棘轮清零记录）
- **理由:** 隔离棘轮状态是 sweep 段结论的一部分
