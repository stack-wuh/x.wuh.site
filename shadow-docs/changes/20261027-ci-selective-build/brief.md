---
{
  "schema": "shadow-dev/v1",
  "name": "20261027-ci-selective-build",
  "type": "feature",
  "scope": "build",
  "status": "draft",
  "baseBranch": "main",
  "branch": "feature/20261027-ci-selective-build",
  "files": [
    ".github/workflows/ci-cd.yml",
    "scripts/deploy-docker.sh"
  ],
  "github": { "repository": null, "issue": null, "issueUrl": null, "pullRequest": null, "pullRequestUrl": null },
  "review": { "conclusion": null, "verifiedCommit": null, "verifiedAt": null },
  "workflow": { "operation": null, "checkpoint": null, "planHash": null, "updatedAt": null, "lastError": null, "release": null },
  "knowledge": {
    "action": "待评估",
    "target": "knowledge/build-config.md",
    "reason": "部署链新增按需构建事实（paths 规则 + 单镜像 load）"
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

## 任务
### Phase 1 — workflow
- [ ] `changes` job：dorny/paths-filter，base 取最近一个 release tag（`git describe --abbrev=0 --tags <target>^` 不可靠，改用 gh api 列 release 按时间取次新）
- [ ] build-images matrix 注入 per-target if
- [ ] transfer-images / load-and-stage 需求链保持（changes 输出全 false 时 transfer 跳过，链路直通绿）

### Phase 2 — 脚本
- [ ] `load-images`：逐 tar 容错 load；校验改为「loaded 集合内的 tag 必须就绪」

### Phase 3 — 验证
- [ ] 双建用例：触发一次 release，两镜像都建（等价现状）
- [ ] 单建用例：改 apps/server 内文件发 release，观察 next 跳过
- [ ] 公网验证 + 产物指纹

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 需变更（build-config knowledge 部署链架构段补按需构建规则）
- **候选卡片:** knowledge/build-config.md
- **理由:** 路径规则是长期有效的部署事实
