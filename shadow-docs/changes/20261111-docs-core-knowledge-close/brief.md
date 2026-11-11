---
{
  "schema": "shadow-dev/v1",
  "name": "20261111-docs-core-knowledge-close",
  "type": "docs",
  "scope": "shadow-docs",
  "status": "published",
  "baseBranch": "main",
  "branch": "docs/20261111-docs-core-knowledge-close",
  "files": [
    "shadow-docs/knowledge/build-config.md"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 585,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/585"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "fd3777a6b24a1d9bef8ba555254a6514a875d5eb",
    "verifiedAt": "2026-11-11T14:50:59.356Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:585",
    "planHash": "fea53eaeaddb045c330fe64ac53b242b90509713c9e25735c53086affa9ecb13",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/knowledge/build-config.md"
      ],
      "message": "docs(shadow): build-config 卡 core 段根治闭环——prepare 恢复 + types→dist + 重 build 契约 (#584)"
    }
  },
  "knowledge": null
}
---

# build-config 知识卡：core 解析面根治入卡

## 动机

20261111-fix-audit-batch4-data-integrity（PR #584）落地了 build-config.md 中标记「仍开放」的 core 双解析面根治（prepare 恢复 + types→dist）——知识卡既有段落需同步闭环，并登记「改 core 后须重 build」的运行时契约。

## 复杂度评级

- **评级:** S
- **理由:** 单卡单段落状态更新。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（知识卡 upkeep）——build-config.md core 段从「根治仍开放」改「根治已落地」并登记契约行。
- **被触及的既有不变量:** 卡片格式与既有段落不改写，仅状态闭环与增量。

## 决策

- **选型:** 原段落内联更新（桥接方案保留，「根治仍开放」改为落地描述+契约）。
- **对比方案:** 新开段落（碎片化，一个事实两处维护）。
- **理由:** 同一事实的单源陈述。

## 任务

### Phase 1
- [x] task 1 — `shadow-docs/knowledge/build-config.md` — core 段根治状态闭环 + 契约行

## 结果

- 实际耗时: —
- 验证: —（code-read）

## 知识评估

- **预期影响:** 已更新（本单即卡更新本体）
- **候选卡片:** build-config.md
- **理由:** verified-depth=code-read（状态闭环，构建行为已由 PR #584 CI 与 core build exit 0 实证）
