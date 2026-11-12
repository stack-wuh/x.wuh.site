---
{
  "schema": "shadow-dev/v1",
  "name": "20261112-fix-visitstats-id-cast",
  "type": "fix",
  "scope": "apps/server",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261112-fix-visitstats-id-cast",
  "files": [
    "apps/server/src/modules/visit-stats/visit-stats-total.schema.ts"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 588,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/588"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0383d821e9c261f5e82affa044410d6906fcc566",
    "verifiedAt": "2026-11-12T16:22:33.550Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:588",
    "planHash": "0659e0a552954524a8d3d7ba8ab53b2e330c25a12853bb5553ae5368bc346cd2",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/server/src/modules/visit-stats/visit-stats-total.schema.ts"
      ],
      "message": "fix(server): 计数器 schema _id 显式 String——global 固定 id 不再被 ObjectId cast 崩"
    }
  },
  "knowledge": null
}
---

# 热修：visit-stats 计数器 _id cast 崩（v1.4.104 上报端点 500）

## 动机

v1.4.104 部署后 `POST /visit-stats/stats` 500：VisitStatsTotal schema 未定义 _id 类型，mongoose 默认把 filter `_id:'global'` cast 到 ObjectId → CastError。本地 dry-run 走原生 collection driver（无 cast）未暴露。

## 复杂度评级
- **评级:** S
- **理由:** schema 一行显式类型。
- **期望验证深度:** runtime（v1.4.105 部署后上报 200 + 计数器就位）
- **取证策略:** observation

## 领域模型
- **限界上下文:** 访问统计防线——计数器文档形态契约。
- **被触及的既有不变量:** 上报路径 200；计数器幂等迁移语义不变。

## 决策
- **选型:** schema 显式 `@Prop({ type: String }) _id: string`。
- **对比方案:** filter 改用其他唯一键（多此一举，global 语义就在 _id）。
- **理由:** 显式类型是 mongoose 固定字符串 id 文档的标准形态。

## 任务
### Phase 1
- [x] task 1 — `visit-stats-total.schema.ts` — _id 显式 String

## 结果
- 实际耗时: —
- 验证: —（v1.4.105 部署后上报 200 实证）

## 知识评估
- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** mongoose 通用知识
