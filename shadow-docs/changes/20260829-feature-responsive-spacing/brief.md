---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-feature-responsive-spacing",
  "type": "feature",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260829-feature-responsive-spacing",
  "files": [
    "apps/site/app/post/styles/post-layout.ts",
    "packages/components/themes/breakpoints.ts",
    "packages/components/themes/cssVariableProvider.tsx",
    "packages/components/themes/index.ts",
    "shadow-docs/knowledge/blog-detail.md",
    "shadow-docs/knowledge/design-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 342,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/342",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "429278b661eebbdf8d7f9bbef30d20b9bc23c4c1",
    "verifiedAt": "2026-08-29T05:08:50.952Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:342",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 响应式间距与行高体系

## 动机

全站断点散乱（8 种无体系：640/520/767/768/560/480/420 + 1024），space tokens 固定值无响应式，手机端博客详情页边距偏大（Container 左右 24px、顶部 40px 起跳）、行高偏松。目标：建立语义化断点体系 + 响应式间距 token，博客详情页作为首个落地页面。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: CSS 变量三层结构；非颜色 tokens 通过 theme props 注入；酒红行高 1.8 / 素雅 2.0
  - 适用 scope: 主题 token 层与全局样式（本次在 token 层增加响应式语义）
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 正文 16px；酒红行高 1.8 / 素雅 2.0；封面/目录/工具栏排版约束
  - 适用 scope: 详情页排版（行高移动端收紧需同步卡片）

## 决策

- **选型:** 全站体系 + 详情页落地：
  - 断点体系：语义化 3 档常量 `mobile: 640 / small: 520 / tablet: 1024`（对应现有使用最多的断点），`packages/components/themes/breakpoints.ts` 导出，styled-components 模板字符串引用；存量散乱断点不强制一次收敛，新代码必须用语义常量
  - 响应式 space token：md/lg/xl/2xl/3xl 改为 clamp（窄屏收缩、桌面封顶原值），xs/sm/base 保持固定
  - 移动端行高收紧（max-width 640）：酒红 1.8→1.7、素雅 2.0→1.8，桌面不变
  - 详情页落地：Container padding `clamp(40px, 5vw, 72px) 24px` → `clamp(24px, 5vw, 72px) clamp(16px, 4vw, 24px)`；正文边距随 token 自动收缩
- **对比方案:**
  - 仅修详情页：治标，其他页面手机端问题仍在
  - 体系先行不落地：见效慢，无法验证用户痛点是否解决
- **理由:** 断点体系是设计系统长期缺口；token clamp 化让全站组件自动获得响应式间距（低迁移成本）；详情页落地直接验证用户痛点

## 任务

### Phase 1: 断点体系
- [x] breakpoints.ts 定义 3 档语义断点并导出 — `packages/components/themes/breakpoints.ts` — 新建
- [x] themes/index.ts 导出断点常量 — `packages/components/themes/index.ts` — 修改

### Phase 2: 响应式 token
- [x] spaces md/lg/xl/2xl/3xl clamp 化 — `packages/components/themes/index.ts` — 修改

### Phase 3: 详情页落地
- [x] Container padding 收紧 + 移动端行高收紧 — `apps/site/app/post/styles/post-layout.ts` + `packages/components/themes/cssVariableProvider.tsx` — 修改
- [x] 三端视口验收（375/768/1280）+ 现有测试回归 — dev server — 验证

### Phase 4: 知识
- [x] design-system.md + blog-detail.md 更新响应式间距与行高规范 — `shadow-docs/knowledge/` — 更新

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/design-system.md、shadow-docs/knowledge/blog-detail.md
- **理由:** 断点体系与响应式 token 是长期设计事实；行高移动端收紧改变 blog-detail 排版结论
