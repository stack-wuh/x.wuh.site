---
{
  "schema": "shadow-dev/v1",
  "name": "20261027-ci-selective-build",
  "type": "feature",
  "scope": "build",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261027-ci-selective-build",
  "files": [
    ".github/workflows/ci-cd.yml",
    "scripts/deploy-docker.sh"
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
    "verifiedCommit": "ef2500b93541eae63b1ad659605ce76435fec78e",
    "verifiedAt": "2026-11-09T14:59:31.990Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "56b43909012e4dc7fafed03144ad9aba6d8a07c510b79aa66828f6628789b2cb",
    "updatedAt": null,
    "lastError": null,
    "release": null
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "补收漂移门：按需构建随 PR #558 合并上线（ea4ec56），changes job 已生产实证多版 release（v1.4.99 部署链 changes:success 为证）；知识增量（buildx 三连坑/按需构建）已由 #558 随附写入 build-config 卡；7 任务对照生产现状逐条核实"
  }
}
---

# CI 按需构建：release 只重建受影响的镜像

## 现象与影响

当前 release 链无论改了什么，next/nest 两个镜像都全量重建+传输+load。实际大部分 release 只触及一端（改 server 不必重建 next，改 site 不必重建 nest），单镜像场景可省约一半构建与传输时间。

## 复杂度评级
- **评级:** M
- **理由:** 依赖图清晰（见下），workflow paths 判定 + load-images 容错改造；风险点在路径规则漏判——策略取保守（宁可多建）
- **期望验证深度:** code-read + 实际 release 演练（单镜像跳过 + 双镜像都建两用例）

## 依赖图（20261027 核实）

- next 镜像 ← apps/site + packages/{components, hooks, core}
- nest 镜像 ← apps/server + packages/{hooks, core}（core/endpoints.ts import hooks/createService，hooks 进 nest 编译闭包）
- 交集（任一改动 → 双建）：packages/core/**、packages/hooks/**、pnpm-lock.yaml、pnpm-workspace.yaml、.npmrc、tsconfig*.json、Dockerfile、docker-compose.yml

## 方案

1. release 链在 quality-gate 后加 `changes` job：`dorny/paths-filter@v3` 对比 `github.event.release.target_commitish`（release 的 target SHA）与上一次 release tag，输出 `next`/`nest` 两个布尔
2. build-images matrix 加 `if: needs.changes.outputs.<target> == 'true'`，被跳过的 target 无 artifact
3. transfer-images 不变（下载 `pattern: image-*`，有几个下几个）
4. `deploy-docker.sh load-images` 改容错：tar 有哪个 load 哪个，只校验「存在 tar 的镜像」的固定 tag；两个 tar 都没有才报错
5. staging-test / switch-traffic 不变：tag 未变的镜像 `up -d` 自然无操作，容器不重启

### 路径规则（保守优先）

- next: `apps/site/**`, `packages/components/**`
- nest: `apps/server/**`
- 双建（交集）：`packages/core/**`, `packages/hooks/**`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, `tsconfig.json`, `tsconfig.base.json`, `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci-cd.yml`
- 未命中任何规则（如纯 docs 改动）→ 双跳过，部署链直接绿过（无新东西可上车）

## 领域模型

- **限界上下文:** 工程基建（CI 构建分发链）— release 触发的构建按变更范围裁剪（next/nest 依赖图判定）；上游=GitHub Release 事件，下游=transfer/load/部署链。反腐边界=只做「建不建」判定，不动构建本体与部署编排语义。
- **被触及的既有不变量:** ① 依赖图规则（next←site+components+hooks+core；nest←server+hooks+core；交集→双建）保守取真，宁可多建不漏建；② changes 全 false → transfer 链跳过直通绿；③ load-and-stage 只加载 changes 输出集合内的镜像。
- **补记（2026-11-09 治理对账）:** 本 brief 为 pre-regime 老账（status=draft 为 CLI 接管前形态）。工作已随 PR #558 合并上线（ea4ec56，changes job 已生产实证多版 release，v1.4.99 部署链 changes:success 为证）；7 任务已对照生产现状逐条核实勾选、review 漂移门 passed。因分支已清理，CLI 无法补登记 PR 号归档，保留本目录作为历史凭证。

## 任务
### Phase 1 — workflow
- [x] `changes` job：dorny/paths-filter，base 取最近一个 release tag（`git describe --abbrev=0 --tags <target>^` 不可靠，改用 gh api 列 release 按时间取次新）
- [x] build-images matrix 注入 per-target if
- [x] transfer-images / load-and-stage 需求链保持（changes 输出全 false 时 transfer 跳过，链路直通绿）

### Phase 2 — 脚本
- [x] `load-images`：逐 tar 容错 load；校验改为「loaded 集合内的 tag 必须就绪」

### Phase 3 — 验证
- [x] 双建用例：触发一次 release，两镜像都建（等价现状）
- [x] 单建用例：改 apps/server 内文件发 release，观察 next 跳过
- [x] 公网验证 + 产物指纹

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 需变更（build-config knowledge 部署链架构段补按需构建规则）
- **候选卡片:** knowledge/build-config.md
- **理由:** 路径规则是长期有效的部署事实
