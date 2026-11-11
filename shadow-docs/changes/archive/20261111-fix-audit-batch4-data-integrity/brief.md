---
{
  "schema": "shadow-dev/v1",
  "name": "20261111-fix-audit-batch4-data-integrity",
  "type": "fix",
  "scope": "full",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261111-fix-audit-batch4-data-integrity",
  "files": [
    "AGENTS.md",
    "apps/server/scripts/backfill-published-at.mjs",
    "apps/server/scripts/sync-init.mjs",
    "apps/server/src/modules/comment/comment.service.ts",
    "apps/server/src/modules/content/content.service.ts",
    "apps/server/src/modules/sync/sync.service.ts",
    "apps/server/src/modules/webhook/webhook.controller.ts",
    "packages/components/config-provider",
    "packages/components/float-button",
    "packages/components/modal",
    "packages/components/space",
    "packages/components/spin",
    "packages/components/video-player",
    "packages/core/package.json",
    "packages/hooks/useLocale",
    "packages/hooks/useTheme",
    "packages/hooks/useTokens"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 584,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/584"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "24a6b39028244b0bd9c24b67364c72e7eecfff72",
    "verifiedAt": "2026-11-11T14:48:33.531Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:584",
    "planHash": "a0cfa4dc114f5666700a96fd1aa63ec00da0802d6e61d052fa6c00b79afee8d7",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "packages/hooks/useTheme/切换站点模式.md",
        "packages/hooks/useTokens/获取全局注入的token.md"
      ],
      "message": "chore(hooks): 清退 useTheme/useTokens 目录残留文档（批次 4 显式清单补漏）"
    }
  },
  "knowledge": null
}
---

# 审计 #568 批次 4：数据一致性 3 项 + 共享包解析面收敛与死代码清退

## 动机

#568 审计批次 3（#582）交付后的续批：server 数据一致性 P1×3（原子 upsert、webhook 删除漂移、publishedAt 无写入路径）+ 共享包 P1×3（core 双解析面 fresh clone 崩、hooks 三死入口、六 0 字节占位组件被 AGENTS.md 向后人推荐）。共 6 项 P1，顺带 AGENTS.md 事实面同步（P1-34 局部）。

## 复杂度评级

- **评级:** M
- **理由:** 触及面跨 server 数据链（sync/webhook/content/comment 五文件）与共享包契约（core 解析面、组件/hooks 包清单）；fullSync 对账删除是破坏性动作需防残缺集合误删；core types 面切换影响三端解析路径（已逐端核验）。
- **期望验证深度:** runtime（CI 三步真闸全绿 + release 部署后 backfill 落库 + fullSync 实跑）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 服务端数据一致性 + 共享包工程面——上游 GitHub webhook/fullSync，下游 content/comment 集合与三端消费。反腐边界=不做 P1-16 revalidate 链路与 P1-31 spec 补写（另行立项）；不迁移 148 条历史命名漂移。
- **统一语言增量:** 「对账删除」=fullSync 拉取远端 issue number 全集成功完成后，删除本地 number 不在全集内的记录；全集拉取中途失败即 throw，绝不持残缺集合执行删除。
- **被触及的既有不变量:**
  - content/comment 的 externalId 唯一索引语义不变（读后写→原子 findOneAndUpdate upsert，并发不再 E11000 整轮失败）
  - webhook 合法事件处理路径保持（新增 deleted/reopened 分支不改既有 opened/edited/closed 行为）
  - site 端 core 解析走 tsconfig paths→src 不变；server/console 走 dist（install 后 prepare 构建就位）
  - AGENTS.md 能力清单与实存一致（删除条目均有退役标注）

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: CI 三步真闸；发布流程 Release 触发部署链
  - 适用 scope: 全仓
- shadow-docs/signals.md
  - 当前结论: SGN-001 深压形态移交 runner；mongoose 脚本直连风险在案
  - 适用 scope: 验证工具链

## 决策

- **选型:** ① upsert 原子化 `findOneAndUpdate(filter, {$set}, {upsert, new})`（sync-init.mjs 既有形态是范本）；② webhook 增 deleted 分支（comment deleted 后重同步宿主 issue 修计数）+ reopened 入 issue 分支；③ fullSync state 'all' 返回远端全集 → `deleteMany({number:{$nin}})` 对账；④ publishedAt=createdAtGitHub（与站点 PostView 口径一致）+ backfill-published-at.mjs 存量脚本（collection 'blogs' 已核）；⑤ core `types→dist/index.d.ts` + `prepare: pnpm run build`（类型与运行时同面，fresh clone install 即产 dist）；⑥ 死入口/占位组件整删（20261014 先例）。
- **对比方案:** 弃「本地探测远端 404 对账」（N 次 API 调用太贵）；弃 `NestFactory rawBody` 类工厂参数改造（批次 3 已定型）；弃 core main→src（node 运行时不认 .ts，生产崩）；弃占位组件最小 stub（0 消费先例整删更干净，AGENTS.md 也不再向后人推荐空文件）。
- **理由:** 每项独立可回滚；对账删除有「全集成功才执行」防线；本地 tsc/jest 照例 SGN-001 受限，真值移交 runner。

## 任务

### Phase 1 — server 数据一致性
- [x] task 1 — `apps/server/src/modules/content/content.service.ts` — P1-5 原子 upsert + deleteByExternalId + deleteAllNotIn（对账删除）
- [x] task 2 — `apps/server/src/modules/comment/comment.service.ts` — P1-5 原子 upsert + deleteByExternalId
- [x] task 3 — `apps/server/src/modules/sync/sync.service.ts` — P1-3 fullSync 对账（state 'all' + 全集返回 + deleteAllNotIn 收尾）+ P1-10 publishedAt 写入 + deleteIssue/deleteComment 代理
- [x] task 4 — `apps/server/src/modules/webhook/webhook.controller.ts` — P1-3 deleted（issue/comment）+ reopened 分支
- [x] task 5 — `apps/server/scripts/sync-init.mjs` + `apps/server/scripts/backfill-published-at.mjs`（新）— P1-10 口径一致 + 存量回填脚本

### Phase 2 — 共享包收敛与清退
- [x] task 6 — `packages/core/package.json` — P1-22 types→dist/index.d.ts + prepare 恢复构建
- [x] task 7 — `packages/hooks/{useLocale,useTheme,useTokens}` 删除 — P1-23 三死入口
- [x] task 8 — `packages/components/{config-provider,float-button,modal,space,spin,video-player}` 删除 — P1-24 六 0 字节占位
- [x] task 9 — `AGENTS.md` — hooks 清单/组件清单同步退役标注（P1-34 局部）

## 结果

- 实际耗时: —
- 验证: —（oxlint 0/0；UR1-7 7/7；core build exit 0 + dist 完整实证 prepare 链路；server tsc 移交 CI）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（core 构建契约行：prepare 恢复、types 指 dist、三端解析面口径）
- **理由:** core 双解析面收敛是跨 change 稳定事实，后续给 core 加常量时需知道「重 build 才生效」
