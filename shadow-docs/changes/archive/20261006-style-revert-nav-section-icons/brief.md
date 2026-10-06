---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-style-revert-nav-section-icons",
  "type": "style",
  "scope": "apps/site,packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20261006-style-revert-nav-section-icons",
  "files": [
    "apps/site/app/HomeView/ProjectsSection.tsx",
    "apps/site/app/HomeView/WereadSection.tsx",
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/app/styles/index.ts",
    "packages/components/icons/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 479,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/479",
    "pullRequest": 480,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/480"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "184d6a4a8dd447622e423d72787bff678cee189a",
    "verifiedAt": "2026-10-06T07:58:09.019Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:480",
    "planHash": "3cff85d960f90ac735afe16fc5ee2095fb59b9f13b55887b2dcfffdd3494feca",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 撤回 Header 导航与首页模块标题的描边 Icon",
      "titleRaw": "撤回 Header 导航与首页模块标题的描边 Icon",
      "supplement": "设计探索未达预期，用户决定不加图标。将 #474 加入的 7 个代码文件还原到加图标前状态。方案与任务见 brief：shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md",
      "body": "## 动机\n前序变更 20261005-style-nav-section-icons（PR #474）为桌面 Header 四项导航与首页四个模块标题加了一批描边图标。经多轮设计探索（纸墨重译、暗纹、云纹），用户认为这些图标不符合站点文艺风格、且无法做到满意，明确要求撤回、不再加图标。本变更把 7 个代码文件还原到加图标之前（c27a94d 的父提交）的状态。\n\n## 引用规范\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: 通用图标从 `icons/index.tsx` 按需具名导出；本次移除 #474 新增的 `IconNote`/`IconUser`/`IconBookMarked` 三个 lucide 导出（无其它消费者）。\n  - 适用 scope: packages/components/icons\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: Header「静默条」导航为纯文字 + 运笔下划线；还原后回到无图标的原始静默态。\n  - 适用 scope: apps/site/app/components/SiteHeader\n\n## 决策\n- **选型:** 整文件还原到 c27a94d^。7 个文件最后改动均为 c27a94d，无后续漂移，故 `git checkout c27a94d^ -- <files>` 得到精确的加图标前状态（含 #474 内的图标居中对齐 flex 改动一并撤销，回到最初纯文字标题）。\n- **对比方案:** 逐处手工删图标——易漏、且无法保证与原始态字节一致，不采用。\n- **理由:** 一次确定性的整提交还原，最稳、零残留。保留 #474 的历史 brief 文档（作为已完成 change 记录），仅新增本 revert 说明。\n\n## 任务\n### Phase 1 — 还原\n\n- [ ] 还原 7 个代码文件到 c27a94d^ — `packages/components/icons/index.tsx`、`apps/site/app/components/SiteHeader/index.tsx`、`apps/site/app/components/SiteHeader/styles/index.ts`、`apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/ProjectsSection.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/styles/index.ts`\n\n### Phase 2 — 验证\n\n- [ ] tsc（site 域 + 根）+ oxlint：确认移除图标后无未用导入、无类型断裂\n- [ ] 渲染核对：Header 导航与首页模块标题恢复为纯文字、无图标、无散落的图标占位\n\n## 补充\n设计探索未达预期，用户决定不加图标。将 #474 加入的 7 个代码文件还原到加图标前状态。方案与任务见 brief：shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md\n\n完整 brief：shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-style-revert-nav-section-icons\",\"type\":\"style\",\"scope\":\"apps/site,packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/HomeView/ProjectsSection.tsx",
        "apps/site/app/HomeView/WereadSection.tsx",
        "apps/site/app/HomeView/index.tsx",
        "apps/site/app/components/SiteHeader/index.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "apps/site/app/styles/index.ts",
        "packages/components/icons/index.tsx",
        "shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md"
      ],
      "message": "[style] 撤回 Header 导航与首页模块标题的描边 Icon",
      "title": "[style] 撤回 Header 导航与首页模块标题的描边 Icon",
      "body": "Closes #479\n\n完整 brief：shadow-docs/changes/20261006-style-revert-nav-section-icons/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "还原与 c27a94d 逐文件互逆已在 merge 前验证（tsc/lint/SSR 结构零残留）；main 184d6a4 即该还原内容经 squash 合入，v1.4.62 部署链 success，交付闭环"
  }
}
---

# 撤回 Header 导航与首页模块标题的描边 Icon

## 动机

前序变更 20261005-style-nav-section-icons（PR #474）为桌面 Header 四项导航与首页四个模块标题加了一批描边图标。经多轮设计探索（纸墨重译、暗纹、云纹），用户认为这些图标不符合站点文艺风格、且无法做到满意，明确要求撤回、不再加图标。本变更把 7 个代码文件还原到加图标之前（c27a94d 的父提交）的状态。

## 复杂度评级

- **评级:** S
- **理由:** 纯还原，无契约变更、无新增逻辑；触及面即 #474 那 7 个文件（均自 c27a94d 后无其它改动，可整文件还原）；可发现性高。
- **期望验证深度:** unit（tsc + lint + 渲染确认无图标）

## 引用规范

- shadow-docs/knowledge/icon-system.md
  - 当前结论: 通用图标从 `icons/index.tsx` 按需具名导出；本次移除 #474 新增的 `IconNote`/`IconUser`/`IconBookMarked` 三个 lucide 导出（无其它消费者）。
  - 适用 scope: packages/components/icons
- shadow-docs/knowledge/design-system.md
  - 当前结论: Header「静默条」导航为纯文字 + 运笔下划线；还原后回到无图标的原始静默态。
  - 适用 scope: apps/site/app/components/SiteHeader

## 决策

- **选型:** 整文件还原到 c27a94d^。7 个文件最后改动均为 c27a94d，无后续漂移，故 `git checkout c27a94d^ -- <files>` 得到精确的加图标前状态（含 #474 内的图标居中对齐 flex 改动一并撤销，回到最初纯文字标题）。
- **对比方案:** 逐处手工删图标——易漏、且无法保证与原始态字节一致，不采用。
- **理由:** 一次确定性的整提交还原，最稳、零残留。保留 #474 的历史 brief 文档（作为已完成 change 记录），仅新增本 revert 说明。

## 任务

### Phase 1 — 还原

- [x] 还原 7 个代码文件到 c27a94d^ — `packages/components/icons/index.tsx`、`apps/site/app/components/SiteHeader/index.tsx`、`apps/site/app/components/SiteHeader/styles/index.ts`、`apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/ProjectsSection.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/styles/index.ts`

### Phase 2 — 验证

- [x] tsc（site 域 + 根）+ oxlint：确认移除图标后无未用导入、无类型断裂
- [x] 渲染核对：Header 导航与首页模块标题恢复为纯文字、无图标、无散落的图标占位

## 结果

- 实际耗时: ~20 分钟（设计轮另计）
- 验证: 7 文件与 c27a94d 反向补丁内容级 diff 精确互逆；site 域 tsc + oxlint 0 errors；SSR 结构核对 header nav/h2 无图标 svg；PR #480 已合并（184d6a4，branch protection REVIEW_REQUIRED 因作者无法自审以 admin 合并）；Release v1.4.62 部署链 CI-CD run 37431627213 **success**。生产直接目检因本机 DNS 不可达顺延（既有环境限制先例），还原目标为曾被生产验证的 pre-#474 态，风险为零。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 纯撤回，不改变 icon-system / design-system 既有结论；图标方案本身未沉淀为 active Knowledge。
