---
name: shadow-openspec-superpowers-workflow
description: >
  Shadow 的开发工作流统一入口 (6 环节): 新需求→需求讨论→开始执行→代码审查→文档归档→代码提交。
  整合 Superpowers 技能: propose 嵌 brainstorming, discuss 嵌 writing-plans, apply 嵌 worktree+TDD+subagent,
  review 嵌 verification+code-review+simplify, archive 纯文档管理, commit 嵌 finishing-branch。
  失败回环: 审查 ✗ → 回到执行修复。
  触发词: 新需求/propose; 需求讨论/explore/design; 开始执行/apply; 代码审查/review/verify; 归档/archive; 提交/commit/PR。
  所有输出使用中文，关键字(tasks/proposal/specs/design)保留英文。
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: shadow
  version: "5.0"
---
# Shadow OpenSpec Superpowers 工作流

统一入口，按用户意图路由到各子流程。所有文档输出使用中文，结构化关键字保留英文。

变更命名: `YYYY-MM-DD-{kebab-case}`，如 `2026-05-01-add-comment-api`。

## 核心原则: Action Not Phases

每个 Action 是独立能力，不强制按顺序完成：
- 紧急 hotfix → 可跳过 brainstorming 直接 propose + apply
- 小修复 → 可用 `ff` 快进跳过 discuss 直接生成制品
- 需求模糊 → 必须走 brainstorming，不跳过探索
- 复杂功能 → 必须走完整流程

**判断标准:** 简单变更（单文件、明确输入输出、无架构影响）可以跳过 discuss；复杂变更（多模块、技术选型、数据模型变更）必须走完整流程。

## 流程状态机

```
                ┌── ff（快进: propose + 制品一键生成）──┐
                │                                         │
                ↓                                         ↓
propose ──→ discuss ──→ apply ──→ review ──→ archive ──→ commit
 新建需求     需求讨论     开始执行    代码审查   文档归档   提交/PR
                           ↑            │
                           │   ✓ 通过   │
                           │            │
                           └── ✗ 阻塞 ──┘  (失败回环: 修复后重新审查)
```

- **propose** → **discuss**: 制品创建完成，进入需求讨论细化方案
- **propose** → **ff**: 简单变更，跳过讨论直接生成全部制品
- **discuss** → **apply**: 方案明确，开始执行
- **apply** → **review**: 所有 task 完成，进入代码审查
- **review ✓** → **archive**: 审查通过，归档 openspec 文档
- **review ✗** → **apply**: 有阻塞项，回到执行修复（修复后再次 review）
- **review ⚠** → 用户决定: 修复后归档 / 直接归档
- **archive ✓** → **commit**: openspec 文档已归档，进入代码提交/PR

## 中断恢复

会话中断后重新进入，先执行 `openspec list` 查看当前状态：
- 有活跃变更 → 路由到对应阶段继续执行
- 具体步骤已在对应阶段中定义，直接在中断点继续即可
- worktree 仍在时继续使用，无需重建

---

## 意图识别 → 路由

| 用户说 | 路由 |
|--------|------|
| "新需求"、"新增需求"、"创建需求"、"propose" | → `Skill("shadow-openspec-superpowers-workflow-propose")` |
| "快进"、"fast-forward"、"ff"、"快速生成" | → `Skill("shadow-openspec-superpowers-workflow-propose")` (ff 模式) |
| "继续"、"continue"、"接着做"、"上次" | → **中断恢复**，自行路由到对应阶段 |
| "需求讨论"、"讨论一下"、"架构设计"、"技术方案"、"怎么设计"、"explore"、"design" | → `Skill("shadow-openspec-superpowers-workflow-discuss")` |
| "开始执行"、"开始前端"、"开始后端"、"执行任务"、"apply" | → `Skill("shadow-openspec-superpowers-workflow-apply")` |
| "代码审查"、"review"、"验收"、"verify"、"审查代码" | → `Skill("shadow-openspec-superpowers-workflow-review")` |
| "归档"、"需求完成"、"archive" | → `Skill("shadow-openspec-superpowers-workflow-archive")` |
| "提交"、"commit"、"push"、"PR"、"创建PR"、"合并" | → `Skill("shadow-openspec-superpowers-workflow-commit")` |

已存在的变更名直接使用；否则让用户选择或新建议。
