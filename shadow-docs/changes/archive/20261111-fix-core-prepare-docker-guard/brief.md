---
{
  "schema": "shadow-dev/v1",
  "name": "20261111-fix-core-prepare-docker-guard",
  "type": "fix",
  "scope": "build",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261111-fix-core-prepare-docker-guard",
  "files": [
    "packages/core/package.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 586,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/586"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f3f61005ee2fbaa2aa5bd91364b219f32bdee0cf",
    "verifiedAt": "2026-11-11T15:00:29.888Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:586",
    "planHash": "f82f5c8284c585a7727d9c2955b7f3729279afbd5305b0326afee22dafba191f",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "packages/core/package.json"
      ],
      "message": "fix(core): prepare 加 tsconfig 存在性守卫——Docker deps-only 安装面不再触发构建失败"
    }
  },
  "knowledge": null
}
---

# 热修：core prepare 在 Docker deps-only 安装面失败致双镜像 build 红（v1.4.102 部署链）

## 动机

v1.4.102 部署链 run 43042254920 双镜像 build 红：批次 4（PR #584）恢复的 `prepare: pnpm run build` 在 Dockerfile deps 阶段炸——该阶段只 COPY package.json 清单（缓存优化设计，无 tsconfig/src），prepare 报 TS5058 使 `pnpm install` 非零退出。**PR CI quality-gate 不含 docker build，这面雷只有 release 链首跑才暴露**（审计 P1-31「gate 不跑 build」的残余面）。

## 复杂度评级

- **评级:** S
- **理由:** 单行守卫修复，双环境已实证。
- **期望验证深度:** runtime（v1.4.103 部署链全绿即验证）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 工程基建（Docker 构建链）——prepare 钩子必须在「只有 package.json 的 deps-only 安装面」与「完整源码 checkout 面」两种环境都成功。
- **被触及的既有不变量:** deps 层只拷清单的缓存优化设计不动；builder-nest 显式 `core run build` 保留；site 走 paths→src 不依赖 dist。

## 决策

- **选型:** `"prepare": "if [ -f tsconfig.json ]; then pnpm run build; fi"`——存在性守卫，deps-only 面跳过（exit 0），完整面构建。
- **对比方案:** Dockerfile deps 补 COPY tsconfig/src（破坏 install 层缓存命中，否）；`|| echo` 兜底（吞掉真实构建错误，否）。
- **理由:** 双环境本地实证（deps-only 跳过 exit 0 / packages/core 全环境 build exit 0）；守卫只对「文件不存在」这一确定条件放行。

## 任务

### Phase 1
- [x] task 1 — `packages/core/package.json` — prepare 加 tsconfig 存在性守卫

## 结果

- 实际耗时: —
- 验证: —（双环境实证；v1.4.103 部署链首跑为最终验证）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** build-config.md（prepare 钩子的双环境约束行）
- **理由:** 「workspace prepare 必须容忍 deps-only 安装面」是 Docker 构建链的长期约束
