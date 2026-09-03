---
{
  "schema": "shadow-dev/v1",
  "name": "20260903-style-post-hr-blockquote",
  "type": "style",
  "scope": "post",
  "status": "committed",
  "baseBranch": "main",
  "branch": "style/20260903-style-post-hr-blockquote",
  "files": [
    "apps/site/app/post/styles/post-markdown.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 358,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/358",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "637a46c888923c43bd93247292f6885880250408",
    "verifiedAt": "2026-09-03T06:50:35.324Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "5fa09b49976feb080985f1c8b7eca2dc3d977f3a",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 正文 hr 与 blockquote 引文样式重设计

## 动机

**问题 1**：正文 `hr` 显示为灰色而非主题色。根因：#354（v1.4.8）将 hr「回归原生样式，仅叠加主题背景色」，但浏览器原生 hr 的可见线由 `border`（inset 描边）绘制而非 background，`background-color` 完全不可见，线恒为原生灰白——该决策的意图（去装饰）保留了，主题色部分从未生效。

**问题 2**：`blockquote` 现为上下双 accent 金发丝线 + 行内「」朱砂引号（`post-markdown.ts:193`）。当 hr 改为横向朱砂线后（问题 1），blockquote 的横线语言与 hr 混同，需转向竖线/块面语言重设计。

## 引用规范

- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 正文链接与序号用 `--primary-color` 朱砂；引用块为上下双发丝线（accent 42%）+ 首尾「」朱砂引号（本次将更新此条）；对比度约束 primary 与背景 ≥4.5:1
  - 适用 scope: apps/site/app/post

## 决策

- **选型:**
  - hr → **渐隐朱砂线**：`border:none; height:1px; background: linear-gradient(to right, transparent, color-mix(in oklab, var(--primary-color) 45%, transparent), transparent)`，全宽。与 Divider ornament / 牌记开线同语言，避开 #354 反对的「圆环装饰」而非反对主题色
  - blockquote → **左侧朱砂竖线**：去上下边线，`2px` 朱砂竖线 + 文字缩进 16px（padding 0.35em 16px），保留行内「」朱砂引号。与目录 active 竖线、侧栏工具列同语言；hr 一横一纵语义清晰
- **对比方案:** hr 纯色平铺细线（略生硬）、复活 200px 居中短线（#354 已否定装饰路线且改变分隔语义）——放弃；blockquote 签条款纸片底（正文流中偏重）、悬挂大引号（多段引用识别度弱）——放弃
- **理由:** 两项合计约 10 行 CSS，单文件；朱砂主题色全语义 token 自动适配明暗；与站内既有竖线/渐隐语言同源

## 任务

### Phase 1

- [x] hr 渐隐朱砂线 — apps/site/app/post/styles/post-markdown.ts — hr 改 `border:none; height:1px` + 左右渐隐朱砂 background（transparent → primary 45% → transparent），移除无效的纯 background-color 方案与注释
- [x] blockquote 竖线引文 — apps/site/app/post/styles/post-markdown.ts — 移除上下 accent 边线，改 `border-left: 2px solid var(--primary-color)`（或等效 ::before 竖线）+ padding 0.35em 16px，保留「」引号注入逻辑
- [x] 回归验证 — `tsc --noEmit`、oxlint 变更文件、light/dark 双主题目检 hr 与 blockquote 不与相邻元素混同

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/blog-detail.md
- **理由:** 卡片「引用块为上下双发丝线」结论将失效（改竖线式），归档时更新；新增「正文 hr 为渐隐朱砂线」结论（卡片原本未记载 hr）
