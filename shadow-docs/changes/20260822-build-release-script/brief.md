# 新增 release 发布脚本

## 动机

部署已改为 GitHub Release 发布触发（`20260822-build-release-trigger-deploy`，PR #318）。但当前没有一键发布工具：版本号提升、CHANGELOG、tag、push、创建 Release 需要手动逐步执行，且现有 `pnpm release` 只做 changelog + version:major，不会 push 也不会创建 GitHub Release。

需要一个脚本把「版本提升 → CHANGELOG → 提交 → tag → push → 创建 Release」串成一条完整发布链，创建 Release 即触发 CI 部署。

## 引用规范

- `shadow-docs/knowledge/build-config.md`
  - 当前结论: 部署由 release published 触发；部署脚本提供 build、staging health、switch、diagnose、cancel、rollback 能力；「构建和部署必须保持 workspace 路径、健康检查、运行端口与环境变量一致」
  - 适用 scope: Dockerfile、docker-compose.yml、.github/workflows、部署脚本
  - 本次影响: 新增发布脚本属于发布/部署域，不改动现有部署链路

## 决策

- **选型:** 新建独立脚本 `scripts/release.sh`（方案 A）
  - 用法: `./scripts/release.sh [major|minor|patch]`，默认 `patch`
  - 流程:
    1. 前置校验: 工作区必须干净（未提交改动阻止发布）、当前分支必须为 main
    2. 版本提升: 调用现有 `pnpm version:<level>`（standard-version：提升版本 + 生成 CHANGELOG + 提交 + 打 tag）
    3. 推送: `git push origin main --follow-tags`
    4. 创建 Release: `gh release create <tag> --generate-notes`（触发 ci-cd.yml 的 release published → 完整部署链）
    5. 输出 Release URL
  - 失败即停，不自动回滚
- **对比方案:**
  - 加入 `scripts/deploy-docker.sh` 子命令: 部署脚本职责已多，发布与部署混在一起不易单独复用，未选
  - 只到 push tag（手动网页创建 Release）: 发布动作仍需人工，与「发布即部署」目标不符，未选
- **理由:** 独立脚本职责单一、可复用；复用现有 standard-version 能力不引入新依赖；与 CI 的 release 触发衔接自然

## 任务

### Phase 1: 编写 release 脚本

- [x] 新建 `scripts/release.sh` — 前置校验（工作区干净、分支 main、领先 origin）
- [x] 新建 `scripts/release.sh` — 版本提升（standard-version）→ push → gh release create
- [x] 根 `package.json` — `release` 入口改为 `bash scripts/release.sh`
- [x] 验证: `bash -n` 语法通过；非法级别拒绝；脏工作区/非 main 分支校验生效

## 结果

- 实际耗时: ~15min
- 验证: 语法 OK；`./scripts/release.sh invalid` 拒绝；脏工作区校验拦截

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/build-config.md`
- **理由:** 发布脚本是部署/发布域的长期事实（发布命令、流程、触发关系），需在卡片补充；待 review 确认后更新
