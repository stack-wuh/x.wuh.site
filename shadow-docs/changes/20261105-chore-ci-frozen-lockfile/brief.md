---
{
  "schema": "shadow-dev/v1",
  "name": "20261105-chore-ci-frozen-lockfile",
  "type": "chore",
  "scope": ".github",
  "status": "published",
  "baseBranch": "main",
  "branch": "chore/20261105-chore-ci-frozen-lockfile",
  "files": [
    ".github/workflows/ci-cd.yml"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 574,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/574"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:574",
    "planHash": "78783813a9c73bbcfff65a6f4db0e8b0d202304b08fcd6fafa4ae871ddefd28a",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        ".github/workflows/ci-cd.yml"
      ],
      "message": "chore(ci): quality-gate 安装改 frozen-lockfile——依赖漂移即红"
    }
  }
}
---

# CI 依赖锁定：quality-gate 安装改 frozen-lockfile

## 动机

家族 CI 统一标准（20261105 desktop 先例）落地父仓部分：`pnpm install` 无锁校验，CI 可能静默解析出与 lockfile 不同的依赖树——安装改 `--frozen-lockfile`，漂移即红。

## 复杂度评级

- **评级:** S
- **理由:** 单行工作流改动，零行为契约变更
- **期望验证深度:** runtime

## 引用规范

- .github/workflows/ci-cd.yml 既有结构
  - 当前结论: quality-gate（typecheck+oxlint）+ release 部署链
  - 适用 scope: .github/workflows/ci-cd.yml
  - 遵循方式: 仅改安装参数

## 决策

- **选型:** quality-gate 安装步骤加 --frozen-lockfile；部署链安装同步改（同一风险的同一面）

## 任务

### Phase 1
- [x] ci-cd.yml 全部 `pnpm install` → `pnpm install --frozen-lockfile` — `.github/workflows/ci-cd.yml` — 编辑
- [ ] 本 PR CI 自证绿 — runtime 观察点

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 家族 CI 统一标准的例行落地
