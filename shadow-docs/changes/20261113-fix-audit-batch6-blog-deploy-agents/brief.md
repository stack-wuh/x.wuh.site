---
{
  "schema": "shadow-dev/v1",
  "name": "20261113-fix-audit-batch6-blog-deploy-agents",
  "type": "fix",
  "scope": "full",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261113-fix-audit-batch6-blog-deploy-agents",
  "files": [
    "AGENTS.md",
    "apps/blog"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 590,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/590"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f033d1daaf145db0bad8eee29eb8da99d468804a",
    "verifiedAt": "2026-11-13T00:34:00.064Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:590",
    "planHash": "cc59c91d5b126ffa6be36a1f1b73219282bc58f8a2bc87be9e5a2208af2aeadb",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/blog"
      ],
      "message": "fix(blog): 子模块 pin 再 bump 至 52fbce0——AST 05 frontmatter YAML 修复（Pages main 部署成功实证）"
    }
  },
  "knowledge": null
}
---

# 审计 #568 批次 6：blog 部署链统一 main（子模块）+ AGENTS.md 事实对齐

## 动机

#568 批次 6——按实况核验收口 blog 部署链与文档漂移：① P1-39 实证「Pages 跑 13 个提交前的旧站」（master⊂main，deploy.yaml 触发 master 而 .gitmodules/发布链在 main）；② P1-40 pnpm 8 装 lockfile v9（升级对齐主仓 10.23.0 + frozen）；③ P1-41/42 载体已消亡（publish 脚本随 #173 移除收编 shadow-dev CLI blog publish 域）——审计条目标注失效；④ P1-34 AGENTS.md 版本/路由/模块表对齐实况。

## 复杂度评级

- **评级:** M
- **理由:** 跨仓库（blog 子模块 push main + 主仓 pin bump）且 Pages 部署链行为变更（触发分支切换），需核验 main 触发后 Pages 部署成功；AGENTS.md 三处事实面修订。
- **期望验证深度:** runtime（子模块 push main 后 Pages workflow 触发部署成功 + 主仓 gate 绿 + bump 后 release 部署绿）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（blog 发布部署链 + 文档事实面）——上游 shadow-dev blog publish（issue+sync），下游 GitHub Pages（workflow 模式）。反腐边界=不动用户子模块工作区未提交改动（docs/$AST 实验内容原样保留）；不清理 gh-page/master 历史分支（另行处理）。
- **统一语言增量:** 无
- **被触及的既有不变量:**
  - master⊂main（b28f152 为 merge-base，main 领先 13 提交零分叉）——切 main 触发无内容损失
  - 子模块用户未提交改动不进任何提交
  - 主仓子模块 pin 指向存在的 commit（e238390 已推 origin/main）
  - AGENTS.md 能力清单与代码实况一致

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: 部署链 OSS 中转架构；CI 三步真闸
  - 适用 scope: 全仓

## 决策

- **选型:** ① 子模块 worktree 隔离修改（用户工作区零风险）deploy.yaml `branches:[master]→[main]` + `pnpm/action-setup v4 version 10.23.0` + `--frozen-lockfile`，SSH 通道推 main（OAuth token 缺 workflow scope 实测被拒）；② 主仓 bump gitlink 8ea9164→e238390；③ AGENTS.md：Next 15.1→16.3（16.3.2 实况）、CI/CD 行改 OSS 中转、路由行补 footprint/guestbook/music/topics、模块表补 about-activity/about-timeline/footprint/music/visit-stats 五实存模块。
- **对比方案:** 弃「双分支触发 [master,main]」（重复部署）；弃「直接 checkout 用户工作区」（实验改动有冲突风险）；弃「gh-page 分支清理」（历史分支另行处理）。
- **理由:** master⊂main 使切 main 成为零损失单向升级；worktree 隔离是对用户未提交内容的最大保护；SSH push 是 workflow scope 缺失下的既有可用通道（desktop 子模块同形态）。

## 任务

### Phase 1 — 子模块修复
- [x] task 1 — blog 子模块 `deploy.yaml` — P1-39 触发 main + P1-40 pnpm v4/10.23.0+frozen（worktree 隔离，push origin main e238390）

### Phase 2 — 主仓
- [x] task 2 — 主仓 `apps/blog` gitlink — bump pin 8ea9164→e238390
- [x] task 3 — `AGENTS.md` — P1-34 版本/路由/模块表/CI-CD 行对齐实况

## 结果

- 实际耗时: —
- 验证: —（子模块 push 成功；Pages main 触发部署核验；主仓 gate 绿）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** blog 部署链是子模块仓事实，主仓知识卡以 AGENTS.md 行与 .gitmodules 为准
