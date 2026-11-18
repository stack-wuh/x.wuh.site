---
{
  "schema": "shadow-dev/v1",
  "name": "20261118-chore-release-v1.4.109",
  "type": "chore",
  "scope": "distribution",
  "status": "archived",
  "baseBranch": "main",
  "branch": "chore/20261118-chore-release-v1.4.109",
  "files": [
    "CHANGELOG.md",
    "package.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 595,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/595"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "7668ea2b2e2232a9cccd97c006836365fe579d4c",
    "verifiedAt": "2026-11-18T16:09:50.879Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:595",
    "planHash": "52b3600e54f169ce991682d82e33ff9d7e99a40423e8310ead30e57accc6ce4b",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261118-chore-release-v1.4.109/brief.md"
      ],
      "message": "docs(shadow): v1.4.109 发版结果回填——部署链全绿，线上产物对账通过",
      "title": "docs(shadow): v1.4.109 发版结果回填",
      "body": "## 变更\n- 载体 brief 结果段回填：tag `v1.4.109`、Release URL、部署链 run 链接、线上验证证据\n- 任务清单 Phase 2 三项全部勾选\n\n## 关联\n- brief: shadow-docs/changes/20261118-chore-release-v1.4.109/brief.md\n- 承载发版：v1.4.109（PR #595）"
    }
  },
  "knowledge": null
}
---

# 发布 v1.4.109

## 动机

对外发布 v1.4.109，覆盖 PR #594 的切年 Loading 修复（/music 列表骨架 + 光扫，含 #592 三个缺陷修复）。同时校正 `package.json` 与 tag 序列长达 91 个版本的脱节。

## 覆盖范围

| change | 类型 | 说明 |
|---|---|---|
| `20261118-fix-music-year-loading`（PR #594） | fix | /music 切年 Loading 收窄到列表区，新增骨架行 + 光扫动效，修 #592 三缺陷 |
| `20261117-feature-music-year-transition`（PR #592） | feature | 换卷动画初版（其缺陷已由 #594 修复） |
| 两个归档 docs commit | docs | 只动 `shadow-docs/`，不含产物变更 |

## 版本脱节说明

`package.json` 的 `version` 停在 `1.4.17`，而 main 上最新 tag 是 `v1.4.108`。查证 `v1.4.105`–`v1.4.108` 四个 tag 内 `package.json` 均为 `1.4.17`，说明 standard-version 发版链在某个时点后停用，后续 tag 全部手工创建。本次直接把 version 校正到目标版本 `1.4.109`，不走 standard-version 的递增（其起点已失效，patch 会算出 `1.4.18` 而倒退）。

CHANGELOG 同因缺失：`standard-version` 找不到可用基线，1.4.109 条目手写补齐。

## 复杂度评级
- **评级:** S
- **理由:** 纯声明式配置改动（两份版本载体），无代码逻辑。
- **期望验证深度:** runtime（版本同源 + 发版链实际跑通）

## 决策
- **选型:** 直接落 `1.4.109`（用户拍板），不走 `v1.4.108 → patch` 的两段式校正。
- **理由:** 一次解决版本偏移与发版，CHANGELOG 记录跳变。

## 任务
### Phase 1
- [x] task 1 — package.json — version `1.4.17` → `1.4.109`
- [x] task 2 — CHANGELOG.md — 手写 1.4.109 条目（standard-version 无可用基线）

### Phase 2 — 发版
- [x] task 3 — 提交 bump 并合并（release plan + execute）
- [x] task 4 — 打 tag `v1.4.109` + 创建 GitHub Release
- [x] task 5 — 核对发布链（版本权威 / 资产契约 / 部署结果）

## 结果

- **实际耗时:** 约 1.5 小时（含 next 镜像构建与部署链等待）
- **PR:** #595 squash 合入 main（`491e981`）
- **tag:** `v1.4.109` → commit `4eb6316`，其 `package.json` = `1.4.109`（版本权威对账通过）
- **Release:** https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.109
- **部署链:** run [44341188846](https://github.com/stack-wuh/x.wuh.site/actions/runs/44341188846) 全绿 —— quality-gate / prepare / changes / build-images ×2 / upload-images / load-and-stage / switch-traffic / restart-nginx 全部 success
- **线上验证:**
  - `https://wuh.site/music` → 200（热缓存 0.33s）
  - `https://wuh.site/api/health` → `{"status":"ok","mongodb":{"state":"connected"}}`
  - 产物对账：线上 chunk `/_next/static/chunks/2gu0q4vc2-o7-.js` 同时含 `tracksLoading` 与 `skeletonSweep`（本次新增标识），确认新代码真实上线

## 未覆盖项

- 未做人工视觉走查（本地 dev server 启动失败，环境态）；线上页面可访问且产物对账成立，视觉效果待用户确认