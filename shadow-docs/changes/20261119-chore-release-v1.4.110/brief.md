---
{
  "schema": "shadow-dev/v1",
  "name": "20261119-chore-release-v1.4.110",
  "type": "chore",
  "scope": "distribution",
  "status": "published",
  "baseBranch": "main",
  "branch": "chore/20261119-chore-release-v1.4.110",
  "files": [
    "CHANGELOG.md",
    "package.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 598,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/598"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c591ffb118d184192b39386d085acaa7a3b0d5d8",
    "verifiedAt": "2026-11-19T14:36:51.391Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:598",
    "planHash": "7d29e201a6b5e320cd47d141fd84ae2edc71f0063467e5fa77124ad10a4ce5f2",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "CHANGELOG.md",
        "package.json",
        "shadow-docs/changes/20261119-chore-release-v1.4.110/brief.md"
      ],
      "message": "chore(release): v1.4.110 版本 bump",
      "title": "chore(release): v1.4.110 版本 bump",
      "body": "## 变更\n- `package.json` version `1.4.109` → `1.4.110`\n- `CHANGELOG.md` 新增 1.4.110 条目，记录 PR #597 切年全屏闪动修复\n\n## 影响\n- 行为/触发面变化：无，纯版本载体\n- 明确不受影响的范围：所有运行时行为\n\n## 关联\n- brief: shadow-docs/changes/20261119-chore-release-v1.4.110/brief.md\n- 覆盖：PR #597（手动换幕抑制 root 过渡）"
    }
  },
  "knowledge": null
}
---

# 发布 v1.4.110

## 动机

对外发布 v1.4.110，覆盖 PR #597 的切年全屏闪动修复（手动换幕抑制 root 过渡）。

## 覆盖范围

| change | 类型 | 说明 |
|---|---|---|
| `20261119-fix-music-fullscreen-flash`（PR #597） | fix | 手动换幕抑制 root 过渡——修 /music 切年全屏闪动，/footprint 选点同步受益 |

## 复杂度评级
- **评级:** S
- **理由:** 纯版本载体（package.json + CHANGELOG），无代码逻辑。
- **期望验证深度:** runtime（版本同源 + 部署链跑通 + 线上产物对账）

## 任务
### Phase 1
- [x] task 1 — package.json — version `1.4.109` → `1.4.110`
- [x] task 2 — CHANGELOG.md — 1.4.110 条目

## 结果

（待回填）