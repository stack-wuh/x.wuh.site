---
{
  "schema": "shadow-dev/v1",
  "name": "20260903-fix-floating-group-width",
  "type": "fix",
  "scope": "post",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260903-fix-floating-group-width",
  "files": [
    "apps/site/app/post/styles/post-floating.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 362,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/362",
    "pullRequest": 363,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/363"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "cb18c1b9ef4083ea860b935cb1dcda6f791dc3b6",
    "verifiedAt": "2026-09-03T10:31:43.060Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:363",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 修复三钮组胶囊在平板/桌面端不收缩问题

## 动机

v1.4.11（#361）三钮组连体分段改造中，`FloatingButtonGroup` 在 ≥640 断点使用了 `width: auto`——flex 容器为块级盒，`width: auto` 撑满整列（约 680px）而非收缩包裹内容，导致 home/↑/赞 靠左堆积、胶囊右侧留大段空白（用户截图实证）。<640 断点因 `width:100% + max-width:320px` 不受影响。

## 引用规范

- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 三钮组为全断点统一连体分段胶囊（≥640 内容宽居中）
  - 适用 scope: apps/site/app/post

## 决策

- **选型:** ≥640 断点 `width: auto` 改为 `width: fit-content`，胶囊收缩包裹内容，既有 `margin: var(--space-sm) auto 0` 继续负责水平居中
- **对比方案:** `justify-content: center`（胶囊仍占满整列，视觉上分段悬在长条中间，边界感差）——放弃；display: inline-flex（改变外层布局语义）——放弃
- **理由:** 一行修复；fit-content 现代浏览器全支持；语义上「胶囊包裹内容」正是设计本意

## 任务

### Phase 1

- [x] 宽度修复 — apps/site/app/post/styles/post-floating.ts — FloatingButtonGroup ≥640 断点 `width: auto` → `width: fit-content`
- [x] 回归验证 — `tsc --noEmit`、oxlint、三断点目检胶囊均收缩包裹内容且水平居中

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无（blog-detail.md 已记载「≥640 内容宽居中」，本次是实现 bug 修复，结论不变）
- **理由:** 实现层笔误修复，不产生新的长期事实
