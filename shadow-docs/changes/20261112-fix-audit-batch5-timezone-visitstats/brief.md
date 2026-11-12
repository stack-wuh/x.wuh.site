---
{
  "schema": "shadow-dev/v1",
  "name": "20261112-fix-audit-batch5-timezone-visitstats",
  "type": "fix",
  "scope": "full",
  "status": "committed",
  "baseBranch": "main",
  "branch": "fix/20261112-fix-audit-batch5-timezone-visitstats",
  "files": [
    "apps/server/jest.config.cjs",
    "apps/server/scripts/backfill-visit-total.mjs",
    "apps/server/src/modules/sync/sync.service.spec.ts",
    "apps/server/src/modules/visit-stats/visit-record.schema.ts",
    "apps/server/src/modules/visit-stats/visit-stats-total.schema.ts",
    "apps/server/src/modules/visit-stats/visit-stats.controller.ts",
    "apps/server/src/modules/visit-stats/visit-stats.module.ts",
    "apps/server/src/modules/visit-stats/visit-stats.service.ts",
    "apps/server/src/modules/webhook/webhook.controller.spec.ts",
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/about/data.ts",
    "apps/site/app/footprint/page.tsx",
    "apps/site/app/guestbook/GuestbookPageView/index.tsx",
    "apps/site/app/lib/date.ts",
    "apps/site/app/post/components/PostComments/index.tsx",
    "apps/site/app/weread/WereadView/index.tsx",
    "scripts/run-tests.mjs"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 587,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/587"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b692baa711bb626c6f92cd520aabba20ccceb53c",
    "verifiedAt": "2026-11-12T15:12:48.323Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "cae9b4b95dd668824f69384324677bab19621609",
    "planHash": "1b55d3c0400579c1cbdc6d5cfe7a128fa69ed8bf115f93546bb9c0eb5b69ca56",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/server/jest.config.cjs"
      ],
      "message": "fix(server): ts-jest isolatedModules 纯转译根修 OOM——上轮仅改本地未随分支发布，本轮补推"
    }
  },
  "knowledge": null
}
---

# 审计 #568 批次 5：时区口径单源化 + 访问统计防线 + server spec 首次入 gate

## 动机

#568 续批三线各收一项：① P1-15 时区相关 hydration mismatch（单源 getUTC 化 + Intl timeZone 钉 UTC，覆盖审计点名的 PostHeader/PostCover/Guestbook 三处与同语义 5 处 toLocaleDateString）；② P1-7 访问统计信任 XFF 且无防线（IP 取末段 + path 白名单 + TTL 索引控无界增长 + 总量计数器与记录解耦）；③ P1-31 残项起步——server jest spec（webhook 签名/去重/删除对账、sync PR 过滤/对账删除/publishedAt）首次挂进 CI sweep 白名单。

## 复杂度评级

- **评级:** M
- **理由:** 触及面跨 site 时区面（7 文件）与 server 数据链（visit-stats 五文件 + sweep 接线）；总访问量语义从 count 迁移到计数器需存量迁移脚本；TTL 索引是持久层行为变更。
- **期望验证深度:** runtime（CI 三步真闸全绿——server jest 白名单在 gate 首跑即验证；release 后公网统计接口与时间显示核验）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 展示层时间口径 + 访问统计防线——上游 SSR/客户端渲染与上报端点，下游页面显示与统计数据。反腐边界=时间格式化必须走 `lib/date.ts` 单源（新增格式化函数一律 UTC 口径）；不做 P1-16 revalidate 链路与 Nginx 侧配置（服务器侧另行处理）。
- **统一语言增量:** 「UTC 口径」=格式化与日界判定一律 getUTC*/timeZone:'UTC'，展示语义与 GitHub 面板及 PostView slice(0,10) 既有截断口径一致。
- **被触及的既有不变量:**
  - 时间输出在 SSR 与客户端任意时区下一致（无 hydration mismatch）
  - `GET /visit-stats/stats` 响应形状不变（total/today/totalWords）；total 语义=历史累计（计数器），迁移脚本幂等（计数器存在即跳过）
  - 访问上报仍匿名公开（无鉴权面变化），防线只收紧形态不改变合法上报路径
  - sweep 隔离棘轮不变（QUARANTINE 保持清零；server jest 白名单是新增维度，只准扩大者为绿）

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: CI 三步真闸 + 测试 sweep 契约
  - 适用 scope: 全仓
- shadow-docs/signals.md
  - 当前结论: SGN-001 深压形态本地验证移交 runner
  - 适用 scope: 验证工具链

## 决策

- **选型:** ① `lib/date.ts` getUTC 化为根修 + Guestbook 日界判定 Date.UTC 化 + 5 处 Intl 加 `timeZone:'UTC'`；② XFF 取**末段**（nginx proxy_add_x_forwarded_for 追加真实 IP 于末尾，取首段=信任客户端自报）+ IP 形态防线（45 截断+字符白名单）+ path 防线（/ 开头、无协议、200 截断、剥控制字符）；③ visit_records 加 90 天 TTL 索引，总量迁移 visit_stats.global.total 计数器（pipeline $inc 原子 + backfill-visit-total.mjs 幂等迁移 + getStats 计数器缺位兜底）；④ run-tests.mjs 增 server jest 白名单段（spawn jest --runInBand，退出码透传，存量 10 spec 后批甄别收编）。
- **对比方案:** 弊弃「XFF 取首段+可信代理数配置」（无代理清单，末段是单代理拓扑正确解）；弃「visit_records TTL 45min」（今日统计需全天数据）；弃「spec 全量收编进 gate」（存量未甄别，漂移会把 gate 弄红——白名单渐进）。
- **理由:** 时间单源化后新增格式化天然继承 UTC 口径；防线均以「拒绝路径」可机检；本地 jest 被 SGN-001 三连杀（139/134/134），spec 真值由 gate 白名单首跑自证——spec 进 gate 本身即本批交付物。

## 任务

### Phase 1 — 时区口径单源化（P1-15）
- [x] task 1 — `apps/site/app/lib/date.ts` — formatShortDate/formatFullDate getUTC 化（单源根修）
- [x] task 2 — `apps/site/app/guestbook/GuestbookPageView/index.tsx` — 日界判定与分组键 Date.UTC 化 + Intl timeZone
- [x] task 3 — PostComments/about/data/footprint/HomeView/WereadView 五处 `timeZone:'UTC'`

### Phase 2 — 访问统计防线（P1-7）
- [x] task 4 — `apps/server/src/modules/visit-stats/visit-stats.controller.ts` — XFF 末段 + IP/path 形态防线
- [x] task 5 — `visit-record.schema.ts`（TTL 90 天）+ `visit-stats-total.schema.ts`（新）+ `visit-stats.service.ts`（计数器）+ `visit-stats.module.ts`（注册）
- [x] task 6 — `apps/server/scripts/backfill-visit-total.mjs`（新）— 存量总量迁移

### Phase 3 — spec 入 gate（P1-31 残项）
- [x] task 7 — `apps/server/src/modules/webhook/webhook.controller.spec.ts`（新）— 签名 rawBody 契约/503 fail-fast/去重/deleted/reopened 八用例
- [x] task 8 — `apps/server/src/modules/sync/sync.service.spec.ts`（新）— PR 过滤/publishedAt/对账删除/空集守卫四用例
- [x] task 9 — `scripts/run-tests.mjs` — server jest 白名单段接线

## 结果

- 实际耗时: —
- 验证: —（oxlint 直调 0/0；本地 jest SGN-001 三连杀移交 runner；spec 白名单在 gate 首跑自证）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（sweep 契约行补 server jest 白名单段）
- **理由:** gate 组成的长期事实
