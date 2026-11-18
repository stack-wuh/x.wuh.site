---
{
  "schema": "shadow-dev/v1",
  "name": "20261118-chore-release-v1.4.109",
  "type": "chore",
  "scope": "distribution",
  "status": "branched",
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
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "c8e8fe026e3b3228cc84e5278f879e1a4d0b1f6f2da0d872c85dd766f26db19d",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "CHANGELOG.md",
        "package.json",
        "shadow-docs/changes/20261118-chore-release-v1.4.109/brief.md"
      ],
      "message": "chore(release): v1.4.109 版本校正与发版载体",
      "title": "chore(release): v1.4.109 版本校正与发版载体",
      "body": "## 变更\n- `package.json` version `1.4.17` → `1.4.109`，校正与 tag 序列长达 91 个版本的脱节\n- `CHANGELOG.md` 手写 1.4.109 条目（standard-version 因缺可用基线无法生成），记录 PR #594 的切年 Loading 修复\n\n## 影响\n- 行为/触发面变化：版本号恢复与 tag 序列同源，后续发版链可用\n- 不影响任何运行时行为：纯版本载体改动，无代码逻辑变更\n\n## 关联\n- brief: shadow-docs/changes/20261118-chore-release-v1.4.109/brief.md\n- 覆盖：PR #594（切年 Loading 修复）+ PR #592（换卷动画初版）"
    }
  }
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
- [ ] task 3 — 提交 bump 并合并（release plan + execute）
- [ ] task 4 — 打 tag `v1.4.109` + 创建 GitHub Release
- [ ] task 5 — 核对发布链（版本权威 / 资产契约 / 部署结果）

## 结果

（待回填 tag、Release URL、CI run 链接、冒烟结论）