---
{
  "schema": "shadow-dev/v1",
  "name": "20261107-chore-audit-quality-gates",
  "type": "chore",
  "scope": "ci",
  "status": "committed",
  "baseBranch": "main",
  "branch": "chore/20261107-chore-audit-quality-gates",
  "files": [
    ".github/workflows/ci-cd.yml",
    "apps/server/src/modules/comment/comment.service.ts",
    "apps/server/src/modules/content/content.service.ts",
    "apps/server/src/modules/footprint/footprint.service.ts",
    "apps/server/src/modules/repos/repos.service.ts",
    "apps/server/src/modules/rss/rss.service.ts",
    "apps/server/src/modules/sync/sync.service.ts",
    "apps/server/src/modules/webhook/webhook.controller.ts",
    "apps/server/src/modules/weread/weread.service.ts",
    "apps/site/app/about/AboutView/index.tsx",
    "apps/site/app/components/ContactCard.tsx",
    "apps/site/app/components/TypewriterMotto/index.tsx",
    "apps/site/app/design/system-color/page.tsx",
    "apps/site/app/design/system-color/styles/index.tsx",
    "apps/site/app/footprint/page.tsx",
    "apps/site/app/post/components/PostToolbar/index.tsx",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-toolbar.ts",
    "apps/site/next.config.ts",
    "apps/site/tsconfig.json",
    "package.json",
    "packages/components/dialog/index.tsx",
    "packages/components/empty/types.ts",
    "packages/components/image-preview/Toolbar.tsx",
    "packages/components/image/styles/index.tsx",
    "packages/components/message/types.ts",
    "packages/components/package.json",
    "packages/components/progress/types.ts",
    "packages/hooks/useFetch/createService.ts",
    "pnpm-lock.yaml",
    "scripts/run-tests.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 575,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/575",
    "pullRequest": 576,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/576"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "129bb11f0ed3b37f93c17cca59a3f8d86bacad52",
    "planHash": "7681ac07b43c2e4b0f5a4acd224b695c431b27a7db25a8528b5605f665a278b7",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[chore] [Audit #568] P0-4 质量门真闸：typecheck 全域 + 测试入 CI + 去 ignoreBuildErrors",
      "titleRaw": "[Audit #568] P0-4 质量门真闸：typecheck 全域 + 测试入 CI + 去 ignoreBuildErrors",
      "supplement": "审计 #568 批次 1 收尾（P0-4）。typecheck 四域串联（根+server+site+console）+ 根 test script 入 quality-gate（10 个红守卫文件隔离棘轮）+ 移除 ignoreBuildErrors。详见仓库 shadow-docs/changes/20261107-chore-audit-quality-gates/brief.md",
      "body": "## 动机\n审计 #568 根因一「质量门是纸糊的」的三道闸实际为零：根 `typecheck` 的 include 仅 `packages/*/src/**`（实际只覆盖 core，hooks/components 与全部 apps 不在其内）；`apps/site/next.config.ts` `ignoreBuildErrors: true` 让 next build 类型错误静默放行；63 个测试文件无一进 CI（2026-11-04 盘点：263 用例 232 绿 / 25 红 / 6 skip，红分布 10 个文件）。CI 已有 pull_request 触发（#574 顺带修掉 P1-30），quality-gate 目前只跑 typecheck（假覆盖）+ oxlint。批次 1（P0 安全止血）已随 #572/#573 合并，本变更收掉批次 1 仅剩的 P0-4。\n\n预检事实（2026-11-07）：`tsc -p apps/{server,site,console}` 本机全 139（SGN-001 ×5 到上限，含 node22 mise / ambient node24+1400 / 关增量 / 拆单等待四配方），真值移交 runner——CI 即本变更要建立的闸门，让闸门自己出数。site 存量约 43 个类型错误（build-config 卡 2026-10-26 口径）真值待 CI 揭示，揭红就地清零。\n\n## 引用规范\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: CI 触发策略（push main 只跑 quality-gate、release 触发部署链）；类型检查按 workspace 分治（根 tsc 不覆盖 apps/site，site 检查须 `cd apps/site && tsc`）；组件域守卫配方（tsconfig.guard.json + typecheck.test.mjs，audio-player/cursor 在案）；site 存量约 43 个类型错误（2026-10-26 口径，本变更 CI 出真值后 release 阶段对账修正）\n  - 适用 scope: .github/workflows、Dockerfile、根 tsconfig\n- shadow-docs/signals.md SGN-001\n  - 当前结论: tsc/build 家族环境噪音配方（等待重试、限堆、mise node22、重试上限 ≥5）\n  - 适用 scope: 本机验证环境；本次新形态「app 级 `-p` tsc 三端全 139 而根程序（177 文件）可跑」，apply 阶段本机不硬打 typecheck，真值走 runner\n\n## 决策\n- **选型:** 方案 A——真闸三件套 + 红守卫隔离棘轮（用户 2026-11-07 确认）\n- **对比方案:** B=本批连 10 红守卫逐文件考古对账（25 用例漂移 vs 真回归判定，XL 化违反小步快跑）；C=只接 typecheck（P1-31 不解，测试继续腐烂）\n- **理由:** 闸门 0→1 的杠杆最大：四域 typecheck + 232 个绿测试回归保护 + next build 类型闸激活一次到位；25 个红守卫不隐瞒——隔离清单在 runner 脚本内逐条写原因注释（漂移 vs 待对账），红守卫对账（含真回归甄别）拆后继变更登记 #568。组件域守卫（audio-player/cursor）一并入 sweep。#568 勾选已修条目（P0-1/2/3、P1-4/9/11/43/44、P2 admin ?status=、P2 SITE_URL、P2 /post/undefined）属审计簿记（issue 正文自述「修复合入后勾选」），随本变更执行。\n\n## 任务\n### Phase 1\n- [ ] task 1 — `package.json` — `typecheck` 改四域串联（根 + `-p` server/site/console）；新增 `test` script 指向 `scripts/run-tests.mjs`\n- [ ] task 2 — `scripts/run-tests.mjs` — 新建：枚举 apps/site/test、packages/hooks/test、packages/components/test、packages/components/{audio-player,cursor}/typecheck.test.mjs；QUARANTINE 常量隔离 10 个红守卫文件（逐条原因注释）；spawn `node --test <显式文件列表>` 透传退出码\n- [ ] task 3 — `apps/site/next.config.ts` — 移除 `typescript.ignoreBuildErrors`（连带清空 typescript 块）\n- [ ] task 4 — `.github/workflows/ci-cd.yml` — quality-gate 增加 `- run: pnpm run test` 步骤\n\n### Phase 2（CI 揭红处置）\n- [ ] task 5 — CI 出真值后：存量类型错误就地清零（server/site/console 按揭红清单修）；隔离清单与实际红文件复核对齐（若 CI 有意外红则按实际调整）\n\n### Phase 3（簿记）\n- [ ] task 6 — GitHub issue #568 — 勾选已修条目（#572/#573 已交付的 P0/P1/P2 各条 + 本变更交付的 P0-4、P1-31 部分接线）\n\n## 补充\n审计 #568 批次 1 收尾（P0-4）。typecheck 四域串联（根+server+site+console）+ 根 test script 入 quality-gate（10 个红守卫文件隔离棘轮）+ 移除 ignoreBuildErrors。详见仓库 shadow-docs/changes/20261107-chore-audit-quality-gates/brief.md\n\n完整 brief：shadow-docs/changes/20261107-chore-audit-quality-gates/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261107-chore-audit-quality-gates\",\"type\":\"chore\",\"scope\":\"ci\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261107-chore-audit-quality-gates/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "chore"
      ]
    },
    "commit": {
      "files": [
        "apps/site/app/post/components/PostToolbar/index.tsx"
      ],
      "message": "fix(site): PostToolbar 启用分支闭合标签误替换修正（SpreadSideStatic 拆分收尾）"
    }
  }
}
---

# P0-4 质量门真闸：typecheck 全域覆盖 + 测试入 CI + 移除 ignoreBuildErrors

## 动机

审计 #568 根因一「质量门是纸糊的」的三道闸实际为零：根 `typecheck` 的 include 仅 `packages/*/src/**`（实际只覆盖 core，hooks/components 与全部 apps 不在其内）；`apps/site/next.config.ts` `ignoreBuildErrors: true` 让 next build 类型错误静默放行；63 个测试文件无一进 CI（2026-11-04 盘点：263 用例 232 绿 / 25 红 / 6 skip，红分布 10 个文件）。CI 已有 pull_request 触发（#574 顺带修掉 P1-30），quality-gate 目前只跑 typecheck（假覆盖）+ oxlint。批次 1（P0 安全止血）已随 #572/#573 合并，本变更收掉批次 1 仅剩的 P0-4。

预检事实（2026-11-07）：`tsc -p apps/{server,site,console}` 本机全 139（SGN-001 ×5 到上限，含 node22 mise / ambient node24+1400 / 关增量 / 拆单等待四配方），真值移交 runner——CI 即本变更要建立的闸门，让闸门自己出数。site 存量约 43 个类型错误（build-config 卡 2026-10-26 口径）真值待 CI 揭示，揭红就地清零。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更=quality-gate 语义从「假覆盖」升级为全域真闸（CI/部署链直接消费）；触及面=4 文件 + 1 新脚本 + CI 揭红的存量类型修复外溢；可发现性=低（机制变更，行为靠 CI 绿红表达）。
- **期望验证深度:** unit（CI runner 机器探针：typecheck/test/build 退出码）
- **取证策略:** observation（观察点=CI run 的 job 结论 + 本机测试套退出码；本机 SGN-001 限制下 typecheck 真值唯一可信源是 runner）

## 领域模型

- **限界上下文:** 工程基建（构建与质量门）— 职责=把代码正确性从人的自觉变成机器闸门。上游=全部 workspace 代码；下游=部署链（release 触发的部署链以 quality-gate 为前置 job）。反腐边界=只管结构正确性（类型/回归守卫），不管业务功能正确性。
- **统一语言增量:** 「质量门真闸」=typecheck 四域串联 + test 入 gate + next build 类型闸三件套在 CI 强制执行；「隔离棘轮」=红测试文件从 gate 隔离的显式清单（runner 脚本内常量），只准缩小不准扩大。
- **聚合与不变量:**
  - `INV-1 quality-gate`：`pnpm run typecheck` 必须覆盖根(core)+apps/server+apps/site+apps/console 四域，任一域类型错误 gate 即红；观察点=CI job 退出码
  - `INV-2 quality-gate`：`pnpm run test` 中隔离清单外的任一测试文件红 gate 即红；隔离清单每条必须带原因注释；观察点=runner 脚本退出码 + 清单注释 grep
  - `INV-3 next build`：`ignoreBuildErrors` 移除后类型错误使 build 失败（docker build 即类型闸）；观察点=build 退出码
  - `INV-4 隔离棘轮`：隔离清单单调不增（对账批次移出）；观察点=PR diff 中清单条目数
- **领域事件:** pull_request 与 push main 的 quality-gate 从两步（typecheck+lint）变三步（typecheck+lint+test）；gate 红 → 部署链前置 job 失败 → 不出镜像。

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: CI 触发策略（push main 只跑 quality-gate、release 触发部署链）；类型检查按 workspace 分治（根 tsc 不覆盖 apps/site，site 检查须 `cd apps/site && tsc`）；组件域守卫配方（tsconfig.guard.json + typecheck.test.mjs，audio-player/cursor 在案）；site 存量约 43 个类型错误（2026-10-26 口径，本变更 CI 出真值后 release 阶段对账修正）
  - 适用 scope: .github/workflows、Dockerfile、根 tsconfig
- shadow-docs/signals.md SGN-001
  - 当前结论: tsc/build 家族环境噪音配方（等待重试、限堆、mise node22、重试上限 ≥5）
  - 适用 scope: 本机验证环境；本次新形态「app 级 `-p` tsc 三端全 139 而根程序（177 文件）可跑」，apply 阶段本机不硬打 typecheck，真值走 runner

## 决策

- **选型:** 方案 A——真闸三件套 + 红守卫隔离棘轮（用户 2026-11-07 确认）
- **对比方案:** B=本批连 10 红守卫逐文件考古对账（25 用例漂移 vs 真回归判定，XL 化违反小步快跑）；C=只接 typecheck（P1-31 不解，测试继续腐烂）
- **理由:** 闸门 0→1 的杠杆最大：四域 typecheck + 232 个绿测试回归保护 + next build 类型闸激活一次到位；25 个红守卫不隐瞒——隔离清单在 runner 脚本内逐条写原因注释（漂移 vs 待对账），红守卫对账（含真回归甄别）拆后继变更登记 #568。组件域守卫（audio-player/cursor）一并入 sweep。#568 勾选已修条目（P0-1/2/3、P1-4/9/11/43/44、P2 admin ?status=、P2 SITE_URL、P2 /post/undefined）属审计簿记（issue 正文自述「修复合入后勾选」），随本变更执行。

## 任务

### Phase 1
- [x] task 1 — `package.json` — `typecheck` 改四域串联（根 + `-p` server/site/console）；新增 `test` script 指向 `scripts/run-tests.mjs`
- [x] task 2 — `scripts/run-tests.mjs` — 新建：枚举 apps/site/test、packages/hooks/test、packages/components/test、packages/components/{audio-player,cursor}/typecheck.test.mjs；QUARANTINE 常量隔离 10 个红守卫文件（逐条原因注释）；spawn `node --test <显式文件列表>` 透传退出码
- [x] task 3 — `apps/site/next.config.ts` — 移除 `typescript.ignoreBuildErrors`（连带清空 typescript 块）
- [x] task 4 — `.github/workflows/ci-cd.yml` — quality-gate 增加 `- run: pnpm run test` 步骤

### Phase 2（CI 揭红处置）
- [ ] task 5 — CI 出真值后：存量类型错误就地清零（server/site/console 按揭红清单修）；隔离清单与实际红文件复核对齐（若 CI 有意外红则按实际调整）

### Phase 3（簿记）
- [ ] task 6 — GitHub issue #568 — 勾选已修条目（#572/#573 已交付的 P0/P1/P2 各条 + 本变更交付的 P0-4、P1-31 部分接线）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（quality-gate 三步契约、类型检查分治口径修正、site 存量错误真值对账）；signals.md SGN-001（app 级 -p tsc 139 新形态增补）
- **理由:** CI 门语义与类型检查覆盖面是 build-config 卡核心结论，随本变更升级；本机 139 新形态按信号卡加分流程入档（verified-depth=runtime，以 CI run 为证）。
