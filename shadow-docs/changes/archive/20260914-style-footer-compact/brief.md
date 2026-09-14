---
{
  "schema": "shadow-dev/v1",
  "name": "20260914-style-footer-compact",
  "type": "style",
  "scope": "components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260914-style-footer-compact",
  "files": [
    "packages/components/layout/footer.tsx",
    "packages/components/layout/styles/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 378,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/378"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b0e46aa83a092280c8b2f5736e6e8b72b8c50905",
    "verifiedAt": "2026-09-14T08:49:44.654Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:378",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Footer 垂直节奏收紧（方案 A + B）

## 动机

v1.4.20 上线后页脚实际高度约 550-600px，是改版前两栏布局的两倍多；区块间距 token 用量偏松、Divider ornament 自带 --space-lg 上下 margin、注脚拆行后各占一行，垂直累积过高。用户确认：方案 A（压间距）必做；方案 B（注脚合并一行）需解决响应式折行后实施。

## 引用规范

- shadow-docs/knowledge/footer-design.md
  - 当前结论: 中轴层级顺序与 640px 护栏、语义 token、触屏标签媒体查询
  - 适用 scope: packages/components/layout
- shadow-docs/knowledge/design-system.md
  - 当前结论: 间距/字号/断点只经语义 token
  - 适用 scope: 全站样式

## 决策

- **选型:** A + B 组合。A：区块间隙 --space-md → --space-sm/base，Divider margin 收至 --space-sm/base，logo 84×42 → 64×32，footer 纵向 padding --space-lg → --space-md。B：版权注脚三行段合并为一段 flex-wrap 行——三段（© 段 / 协议段 / 技术栈段）各自 white-space: nowrap，段间 · 分隔，窄屏只在段边界换行；技术栈段沿用 <520px 隐藏（分隔符并入段内，不残留孤点）。
- **对比方案:** 仅做 A 不合并行——高度仍多一行，未选；C 保持现状——用户已确认偏高，未选
- **理由:** 解决高度问题的同时不破坏中轴层级与信息完整性；分段 nowrap 保证任何宽度下折行都发生在语义边界

## 任务

### Phase 1
- [x] styles/index.tsx 收紧垂直节奏：footer padding、ornament/slogan/nav/beian/note 间距、注脚改分段 flex-wrap（nowrap 段 + 段界换行 + <520 隐藏技术栈段） — packages/components/layout/styles/index.tsx — 修改
- [x] footer.tsx 注脚合并为分段单行结构（© 段 / · / 协议段 / 技术栈段含分隔符），logo 缩至 64×32 — packages/components/layout/footer.tsx — 修改

### Phase 2
- [x] 验证：根 tsc、next build、dev 实测桌面高度明显收紧 + 375px 无横向溢出且折行发生在段边界 —  — 验证

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/footer-design.md
- **理由:** 垂直节奏与注脚分段 nowrap 规则属于该卡执行约束的修订，archive 时原位更新（追加 source）
