---
{
  "schema": "shadow-dev/v1",
  "name": "20261109-chore-ci-registry-unpin",
  "type": "chore",
  "scope": "ci",
  "status": "committed",
  "baseBranch": "main",
  "branch": "chore/20261109-chore-ci-registry-unpin",
  "files": [
    ".github/workflows/ci-cd.yml"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "8a8bce645ec8a6b4883d96763d72b8d5373ef685",
    "planHash": "410c0a0cb1f30973451ef287ace4689e0c346900d9403abd0b8b7f2f5f2b6249",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        ".github/workflows/ci-cd.yml"
      ],
      "message": "chore(ci): quality-gate runner 走官方 npm registry——env 覆盖 .npmrc 镜像钉源，npmmirror 故障不再拖垮 CI"
    }
  }
}
---

# CI registry 解钉：GitHub runner 走官方源，摆脱 npmmirror 单点

## 动机

2026-11-09 实测：npmmirror.com 源 500 故障持续 >15 分钟，PR #579 quality-gate 两连红——`pnpm/action-setup` 的 self-installer 在 runner 上读仓库 `.npmrc` 的 `registry=https://registry.npmmirror.com`，国内镜像故障即 CI 全挂。runner 位于海外，官方源（npmjs.org）更快更稳，CI 侧没有理由吃国内镜像。

## 复杂度评级

- **评级:** S
- **理由:** 单文件 CI 接线（job 级 env 覆盖），无代码无行为变更。
- **期望验证深度:** runtime（合并后 main CI 绿即验证）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（CI 门禁）——runner 侧依赖解析源策略；反腐边界=只改 CI 环境，本地与服务器 `.npmrc` 加速配置不动。
- **被触及的既有不变量:** quality-gate 三步（typecheck/lint/test）仍按序全跑；frozen-lockfile 不变。

## 决策

- **选型:** ci-cd.yml quality-gate job 级 `NPM_CONFIG_REGISTRY: https://registry.npmjs.org`（npm self-installer 与 pnpm install 同吃此 env）。
- **对比方案:** 改 .npmrc 本身（本地与服务器构建也被迫走官方源——国内加速丢失，否）；action 级 `registry` 输入（只覆盖 install 步，self-installer 阶段不覆盖，不彻底）。
- **理由:** env 覆盖是唯一同时覆盖 self-installer 与依赖安装两层的作用域。

## 任务

### Phase 1
- [ ] task 1 — `.github/workflows/ci-cd.yml` — quality-gate job 级 env 注入官方 registry

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（CI registry 策略行）
- **理由:** runner 依赖源策略属构建链契约。
