---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-docs-knowledge-reconcile",
  "type": "docs",
  "scope": "docs",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "docs/20261104-docs-knowledge-reconcile",
  "files": [
    "shadow-docs/changes/20261104-docs-knowledge-reconcile/brief.md",
    "shadow-docs/knowledge/animation-system.md",
    "shadow-docs/signals.md"
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
    "verifiedCommit": "6b41f7e406ce916845bb45e09916905b9a671ce3",
    "verifiedAt": "2026-11-04T15:29:05.327Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "f02c7ed98baff309b4f99bb9d209e467af7a9cc0ad985d858e20200eca97f5cd",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261104-docs-knowledge-reconcile/brief.md",
        "shadow-docs/knowledge/animation-system.md",
        "shadow-docs/signals.md"
      ],
      "message": "docs(shadow): 裸 ease 白名单考古对账 + SGN-001 信号增补",
      "title": "docs(shadow): 裸 ease 白名单考古对账 + SGN-001 信号增补",
      "body": "## 变更\n- animation-system 卡裸 ease 白名单考古修正：枚举改为真实在案清单（audio-player 自持 + image-preview:43,218 + dialog:123），附来源提交（517fe7d3 / 41db5be6）与「口径漂移非回归」判定；「保留手调节奏」边界入卡\n- signals.md SGN-001 增补 20261104 证据：ambient pnpm tsc 空转挂起新形态（>10 分钟高 CPU 零输出）、node22 next build SIGSEGV 三连后 ambient24+1400 第 4 试过（批次4 配方再实证）、CLI 链路 139×2；命中 34→40，陈述同步\n\n## 影响\n- 行为/触发面变化：无——纯 shadow-docs 知识治理\n- 明确不受影响的范围：站点代码、守卫探针、CI 均不变\n\n## 验证\n- 命令与结果：考古证据链（pickaxe 定位两源提交 + foundation 前夜 831ebdea 在位核验）；signals 三处编辑后 grep 复核在案；review passed（verifiedCommit 6b41f7e）\n- 未覆盖项（明说，不留空白）：无——纯知识文档变更\n\n## 关联\n- brief: shadow-docs/changes/20261104-docs-knowledge-reconcile/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/animation-system.md",
    "reason": "本变更即知识写入本体：裸 ease 白名单经考古修正（口径漂移非回归，三处手调节奏保留）；SGN-001 增补 20261104 证据与命中计数；verified 维持 2026-11-04 runtime"
  }
}
---

# 知识对账：裸 ease 白名单考古修正 + SGN-001 信号增补

## 动机

两处知识治理欠账，均来自 20261104-style-state-transition-motion 验证期发现：

1. **裸 ease 白名单口径漂移**：animation-system 卡 20261023 定稿记录「裸 ease 清零（白名单=audio-player 自持 + image:55）」，实势为 image-preview/styles:43,218 + dialog/styles:123。考古（pickaxe）：三处分别源自 `517fe7d3`（ImagePreview 初版）与 `41db5be6`（dialog 重设计），均**先于** 20261023 定稿存在且在 foundation 合并前夜（831ebdea）即在位——属**口径漂移非回归**；且各带手调手感（dialog 出场 `ease` 与入场过冲曲线有意区分、image 拖拽 `transform 0.26s ease` 调过的节奏），强推 ease-out-soft 属行为变更，不在知识对账内做。
2. **SGN-001 信号增补**：本日换幕 change 验证期产生两类新证据——ambient `pnpm exec tsc` **空转挂起**新形态（10 分钟 72% CPU 零输出，家族从「139 退出」扩展到「挂起不退出」，杀后 mise node22 直跑 tsc 一遍过）；mise node22 下 next build page-data SIGSEGV **三连**（清 `.next` 无效），ambient node24+1400 限堆第 4 试一遍过（批次4 配方再实证）。shadow-dev CLI 链路另有 issue execute / archive execute 单发 139 各一次，等 35s 重试全过。

## 复杂度评级

- **评级:** S
- **理由:** 纯 shadow-docs 知识治理（卡片字段修正 + 信号证据追加），零代码、零运行时契约。
- **期望验证深度:** code-read
- **取证策略:** observation

## 任务

### Phase 1
- [x] task 1 — `shadow-docs/knowledge/animation-system.md` — 验证方式段裸 ease 白名单修正为考古在案清单（audio-player 自持 + image-preview:43,218 + dialog:123，含来源提交与「保留手调节奏」边界），标注 20261104 对账
- [x] task 2 — `shadow-docs/signals.md` — SGN-001 增补证据追加 20261104 条目（tsc 空转挂起新形态 + node22 build 三连 SIGSEGV + CLI 链路 139×2），命中数与陈述同步更新

## 结果

- 实际耗时: 约 30 分钟（含 branch 流程排障）
- 验证: 考古证据链（pickaxe 定位 517fe7d3/41db5be6 两源提交 + foundation 前夜 831ebdea 在位核验）；signals 三处编辑后 grep 复核在案；纯 shadow-docs 变更不触代码门

## 知识评估

- **预期影响:** 更新
- **候选卡片:** animation-system.md（白名单枚举修正，verified 维持 2026-11-04 runtime）
- **理由:** 本变更即知识写入本体；signals 卡按 norms/signals.md 加分流程更新证据与命中计数。
