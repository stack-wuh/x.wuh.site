---
{
  "schema": "shadow-dev/v1",
  "name": "20261109-chore-shadow-docs-governance",
  "type": "docs",
  "scope": "shadow-docs",
  "status": "archived",
  "baseBranch": "main",
  "branch": "docs/20261109-chore-shadow-docs-governance",
  "files": [
    "shadow-docs/changes/20261027-ci-oss-transfer/brief.md",
    "shadow-docs/changes/20261027-ci-selective-build/brief.md",
    "shadow-docs/knowledge/animation-system.md",
    "shadow-docs/knowledge/build-config.md",
    "shadow-docs/knowledge/music-player.md",
    "shadow-docs/knowledge/shared-hooks.md"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 579,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/579"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "65c614fbb3ed774dc5aa2db6bae0863a7c049d0c",
    "verifiedAt": "2026-11-09T15:21:57.563Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:579",
    "planHash": "cd7f42bd734347d01eaeb09fbd3317e4a1ec4b4cbb3ce7076975405e9934d965",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/changes/20261027-ci-oss-transfer/brief.md",
        "shadow-docs/changes/20261027-ci-selective-build/brief.md",
        "shadow-docs/knowledge/animation-system.md",
        "shadow-docs/knowledge/build-config.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/knowledge/shared-hooks.md"
      ],
      "message": "docs(shadow): pre-regime 老账补票与知识卡 source 移位修正——check-brief 清零（治理 #568 尾单）"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "合并后漂移门：随 PR #579 squash 落 main（65c614f 同源）；check-brief 3/3 绿在案；CI 红因 npmmirror 源 500 与内容零关；3 任务实际完成已勾"
  }
}
---

# shadow-docs 治理：pre-regime 老账补票与知识卡 source 移位修正

## 动机

审计 #568 收口后的老年代遗留清单：
1. **check-brief 2 红**（20261027-ci-oss-transfer / 20261027-ci-selective-build 缺领域模型最小形态）——两单为 pre-regime 老账（draft 状态为 CLI 接管前形态），工作均已上线（分别随 PR #563 / #558 合并，生产实证），因分支已清理 CLI 无法补登记 PR 号归档（archive 硬前置 PR_NOT_MERGED；publish 补票路径 GIT_PUSH_FAILED 被正确拒绝）。
2. **知识卡 4 条 source 悬空**（animation-system/music-player/shared-hooks → 20261104-style-state-transition-motion、build-config → 20261107-chore-audit-quality-gates）——写入时 brief 还在 changes/，归档移位后 source 未跟移。

## 复杂度评级

- **评级:** S
- **理由:** 纯 shadow-docs 内容治理（两 brief 补领域模型段 + 四卡 source 加 archive/ 前缀），零代码零运行时。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（流程治理）——brief 台账与知识卡溯源的簿记修复；反腐边界=不改任何代码与守卫语义，不追溯历史命名漂移。
- **统一语言增量:** 「pre-regime 老账补票」= CLI 接管前完成的工作，以内容补记（领域模型段 + 正文 PR 落点标注）收口 check-brief 红因，保留原目录作历史凭证。

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: 测试 sweep 段与归档闭环契约
  - 适用 scope: shadow-docs/ 全域

## 决策

- **选型:** 内容补票（补领域模型最小形态 + 正文标注 PR 落点），不强行 archive（PR 证据缺失硬前置不可绕）、不手改受管 JSON（旁路禁区）。
- **对比方案:** 删除两 brief（破坏性，未获授权）；publish 复用强推老分支（语义造假，已被 GIT_PUSH_FAILED 拒绝验证此路不通）。
- **理由:** 检查器红因=领域模型段缺失，补段即清红且内容为真；保留目录=台账真实性（工作确实发生过）。

## 任务

### Phase 1
- [x] task 1 — `shadow-docs/changes/20261027-ci-oss-transfer/brief.md` — 补领域模型段（限界上下文+被触及不变量+补记 PR #563 落点）
- [x] task 2 — `shadow-docs/changes/20261027-ci-selective-build/brief.md` — 同法补段（PR #558 落点；7 任务已对照生产勾选、review 漂移门 passed）
- [x] task 3 — 四张知识卡 source 加 archive/ 前缀（animation-system/music-player/shared-hooks/build-config）

## 结果

- 实际耗时: 约 40 分钟
- 验证: check-brief **3/3 全绿**（briefs=3 ok=3 fail=0，修复前 fail=2）；4 条 source 修正后 `ls` 实存验证通过；本仓内卡 source 全量自检 183 条引用中悬空 148 条——全部为 archive 历史命名漂移（多次重构累积），按知识规范既有「存量豁免·不回溯迁移」原则记录为已知债不追溯；本次新写入的 4 条修正均经实存验证。另：check-knowledge.mjs 的 20 fail 属 CLI 产物仓自检债（其 root 钉死产物安装目录，校验产物自身 knowledge/INDEX），非本仓可修，已在上游治理范围外如实记录。
- 观察点: `node check-brief.mjs` → ok=3 fail=0；`ls shadow-docs/changes/archive/<四处>` 实存。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 本次为簿记修复本体；「存量豁免·不回溯迁移」原则已在产物规范中存在，无新长期事实。
