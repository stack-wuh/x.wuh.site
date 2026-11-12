---
{
  "schema": "shadow-dev/v1",
  "name": "20261113-docs-sweep-knowledge-update",
  "type": "docs",
  "scope": "shadow-docs",
  "status": "committed",
  "baseBranch": "main",
  "branch": "docs/20261113-docs-sweep-knowledge-update",
  "files": [
    "shadow-docs/knowledge/build-config.md"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "5adeeb400d1a80b471d5a9a231e304a7943d8594",
    "verifiedAt": "2026-11-12T16:34:23.225Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "88f1de2adaeaaf909e85a6e9c55baaa82ea01209",
    "planHash": "02e2b23d090757fdbacea69f59275a659c2b31f610caf1d303cc314c36310563",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/knowledge/build-config.md"
      ],
      "message": "docs(shadow): build-config 卡 sweep 契约更新——server node:test 通道定型 (#587)"
    }
  },
  "knowledge": null
}
---

# build-config 知识卡：sweep 契约行更新（server node:test 通道定型）

## 动机

20261112-fix-audit-batch5-timezone-visitstats（PR #587）定型了两项 gate 长期事实：① sweep 目录收编 apps/server/test；② server 行为契约=node:test 纯函数 util 形态（jest 通道七轮 OOM 判死、Nest 装饰器类不可直载）。知识卡 sweep 段需同步。

## 复杂度评级

- **评级:** S
- **理由:** 单卡段落更新。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（知识卡 upkeep）——仅 sweep 契约行状态更新。
- **被触及的既有不变量:** 卡片格式不变。

## 决策

- **选型:** sweep 段内联更新（目录清单+定型决策+边界说明）。
- **对比方案:** 另立新段（碎片化）。
- **理由:** 单源陈述。

## 任务

### Phase 1
- [x] task 1 — `shadow-docs/knowledge/build-config.md` — sweep 契约行更新

## 结果

- 实际耗时: —
- 验证: —（code-read）

## 知识评估

- **预期影响:** 已更新（本单即卡更新本体）
- **候选卡片:** build-config.md
- **理由:** verified-depth=code-read（行为由 PR #587 第八轮 gate 全绿实证）
