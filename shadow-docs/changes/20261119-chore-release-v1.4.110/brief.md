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
    "planHash": "a321ecc8d7cf40c4dae5cbbe199aadea4a846e5f96ab2057925c67c0c1609623",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261119-chore-release-v1.4.110/brief.md"
      ],
      "message": "docs(shadow): v1.4.110 发版结果回填——部署链全绿，线上产物双向对账通过",
      "title": "docs(shadow): v1.4.110 发版结果回填",
      "body": "## 变更\n- 载体 brief 结果段回填：tag、Release URL、部署 run、线上产物双向对账证据\n\n## 关联\n- brief: shadow-docs/changes/20261119-chore-release-v1.4.110/brief.md"
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

- **PR:** #598 squash 合入 main（`5b51d7e`）
- **tag:** `v1.4.110`，其 `package.json` = `1.4.110`（版本权威对账通过）
- **Release:** https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.110
- **部署链:** run [44546396351](https://github.com/stack-wuh/x.wuh.site/actions/runs/44546396351) 全绿 —— quality-gate / changes / prepare / build-images ×2 / upload-images / load-and-stage / switch-traffic / restart-nginx 全部 success
- **线上验证:**
  - `https://wuh.site/music` → 200
  - `/api/health` → `{"status":"ok","mongodb":{"state":"connected"}}`
  - **产物对账（双向确认）**：JS chunk `/_next/static/chunks/0mqvoy5n7wg16.js` 含 `data-vt-scoped`；SSR HTML 内联样式含 `html[data-vt-scoped]::view-transition-old(root),html[data-vt-scoped]::view-transition-new(root){animation-duration:0s;}`
- **未覆盖项:** 未做浏览器内人工观感确认（本地 dev server 因 SWC 签名问题不可用）；抑制逻辑已由最小复现页实测（root 0.6s→0s、content-swap 恒 0.22s）与线上产物对账背书