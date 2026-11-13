---
{
  "schema": "shadow-dev/v1",
  "name": "20261113-fix-audit-batch7-console-dialog",
  "type": "fix",
  "scope": "full",
  "status": "committed",
  "baseBranch": "main",
  "branch": "fix/20261113-fix-audit-batch7-console-dialog",
  "files": [
    "apps/console/src/pages/comments/CommentsPage.tsx",
    "apps/console/src/pages/content/PostsPage.tsx",
    "apps/console/src/pages/guestbook/GuestbookPage.tsx",
    "packages/components/dialog/index.tsx",
    "shadow-docs/knowledge/admin-console.md"
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
    "verifiedCommit": "6ab31226699e36cf3c7b1feb9ccb659bd17ac839",
    "verifiedAt": "2026-11-13T15:39:41.050Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "cd7e21b6d7f68e14065198f8f1504064b03e2d36",
    "planHash": "49be3b7cd27da577d86c8dc944f603467127b3115ee4d4d67c88b4ebb2d49f9d",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/console/src/pages/comments/CommentsPage.tsx",
        "apps/console/src/pages/content/PostsPage.tsx",
        "apps/console/src/pages/guestbook/GuestbookPage.tsx",
        "packages/components/dialog/index.tsx",
        "shadow-docs/knowledge/admin-console.md"
      ],
      "message": "fix(components,console): 审计 #568 批次 7——Dialog 焦点陷阱/归还/placement hydration 根除、Console 只读壳诚实化、admin-console 卡回写"
    }
  },
  "knowledge": null
}
---

# 审计 #568 批次 7：Dialog 焦点管理三缺口 + Console 只读壳诚实化 + admin-console 卡回写

## 动机

#568 批次 7 三线：① P1-19 Dialog 剩余三缺口（Tab 焦点陷阱穿透、关闭后焦点不归还、placement 的 matchMedia 在 useMemo 期求值致 SSR/客户端首帧 hydration mismatch）；② P1-36 Console 三个死按钮（编辑/审核/处理，无 onClick 无 API）——按审计允许的「先隐藏」路线换显式只读文案；③ P1-37 按审计允许的「回写知识卡」路线——admin-console 卡的部署形态/路径/写按钮三处过时事实回写为实况。

## 复杂度评级

- **评级:** M
- **理由:** Dialog 是共享组件行为契约变更（焦点管理/a11y），消费面全站弹层；触及面三域五文件+一卡。
- **期望验证深度:** unit（sweep dialog 8 用例回归 + oxlint）+ runtime（弹层交互核验）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 共享组件无障碍契约 + Console 事实面——Dialog 焦点管理属弹层族契约（layout-components 卡邻域）；反腐边界=不接通 console 写端点（功能开发另行立项）、不动弹层族 API 收敛（P1-26 另行立项）。
- **统一语言增量:** 「焦点归还」=Dialog 关闭完成后 focus 回到打开前的 document.activeElement。
- **被触及的既有不变量:**
  - Dialog 现有契约保持（Escape/scroll lock/aria 标注/surface 初始聚焦/dialog 测试 8 用例）
  - placement 显式传值行为不变；响应式判定从渲染期移到 effect 期（输出值不变，仅时机后移）
  - console 页面结构/数据获取不变，仅操作列文案

## 引用规范

- shadow-docs/knowledge/admin-console.md
  - 当前结论: 本批回写后的 Console 实况（只读壳/无部署链/认证契约）
  - 适用 scope: apps/console + server auth/admin

## 决策

- **选型:** ① placement 改 state（固定 'center' 起始与 SSR 一致）+ effect 内 matchMedia 求值 + change 监听；② Tab 陷阱 onKeyDown 查 surface 内可聚焦序列首尾循环（无焦点元素时回落 surface 本体）；③ 焦点归还：open 时记录 activeElement、关闭完成 focus 回还；④ 死按钮换「只读（xx 尚未接入）」显式文案；⑤ admin-console 卡回写（scope 路径 apps/console、部署形态=本地开发态无生产链、写按钮实况只读壳、接线路径次序）。
- **对比方案:** 弃「接通 console 写端点」（功能开发超审计修复范畴）；弃「hidden 属性隐藏死按钮」（显式只读文案对用户更诚实）；弃 Dialog 焦点陷阱用第三方 focus-trap 库（自实现 30 行，零新依赖）。
- **理由:** 焦点管理三缺口均为标准 a11y 配方；只读壳诚实化是审计认可的中间态。

## 任务

### Phase 1
- [x] task 1 — `packages/components/dialog/index.tsx` — placement state 化+effect 求值（hydration）+Tab 陷阱+焦点归还
- [x] task 2 — console 三页（Posts/Comments/Guestbook）— 死按钮换显式只读文案
- [x] task 3 — `shadow-docs/knowledge/admin-console.md` — 回写实况（P1-37）

## 结果

- 实际耗时: —
- 验证: —（sweep dialog 8/8；oxlint 0/0；真值 runner）

## 知识评估

- **预期影响:** 已更新（task 3 即卡更新本体）
- **候选卡片:** admin-console.md
- **理由:** verified-depth=code-read（Console 实况核对）
