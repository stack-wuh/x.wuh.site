---
{
  "schema": "shadow-dev/v1",
  "name": "20261111-docs-signals-upkeep",
  "type": "docs",
  "scope": "shadow-docs",
  "status": "archived",
  "baseBranch": "main",
  "branch": "docs/20261111-docs-signals-upkeep",
  "files": [
    "shadow-docs/signals.md"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 583,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/583"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a6f047ff580f0939252a2e7f68372980a7611da2",
    "verifiedAt": "2026-11-10T18:49:53.379Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:583",
    "planHash": "abe8db2b91dca51c5bebb376f0f34ec66db0bf05659c09ecd0152712416580a1",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/signals.md"
      ],
      "message": "docs(shadow): 信号入账——SGN-001 深压新形态（命中 47）+ SGN-018 Actions 事故期事件投递配方"
    }
  },
  "knowledge": null
}
---

# 信号入账：SGN-001 深压新形态 + SGN-018 Actions 事故期事件被吞

## 动机

20261111-fix-audit-batch3-resilience 归档后信号台账 upkeep：① SGN-001 增补 20261110 深压新形态（swap 10.1/11.2G 下 server 小程序 canary 探针失效、tsc 139×2+挂起×1、jest SIGSEGV×2，验证全面移交 runner）命中 42→47；② 新增 SGN-018（GitHub Actions 平台事故期 PR 事件不投递，恢复后不补投、close/reopen 重投一次即触发）。

## 复杂度评级

- **评级:** S
- **理由:** 纯信号台账追加，零代码零行为。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（信号台账）——仅追加 SGN 条目与命中计数，不改既有条目语义。
- **被触及的既有不变量:** SGN 条目格式（方向/权重/深度/域/scope/证据/命中/陈述/退役条件）保持。

## 决策

- **选型:** 追加证据行 + 命中计数更新 + 新条目 SGN-018，格式对齐 SGN-016/017。
- **对比方案:** 不入账（证据流失，下次同形态重烧预算）。
- **理由:** 两个形态均会复现（内存深压常态化、Actions 事故非首例），配方可省真金预算。

## 任务

### Phase 1
- [x] task 1 — `shadow-docs/signals.md` — SGN-001 增补深压形态证据与命中 47；新增 SGN-018（Actions 事故期事件投递配方）

## 结果

- 实际耗时: —
- 验证: —（格式与 SGN-016/017 对齐，code-read 自证）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** signals.md 本身即信号台账本体；跨项目稳定经验不涉及
