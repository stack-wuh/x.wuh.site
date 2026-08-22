# 部署触发改为 release 发布

## 动机

当前 `ci-cd.yml` 在 `push` 到 main 分支时触发完整部署流水线（quality-gate → prepare → build → staging → switch-traffic）。每次合入 main 都会自动部署，缺少发布节奏控制：

- 频繁合入小改动会触发多次部署，服务器反复构建切换。
- 无法把「代码合入」和「对外发布」解耦，回滚/灰度节奏不可控。

改为「GitHub Release 发布时触发部署」，让部署由发布动作显式控制。

## 引用规范

- `shadow-docs/knowledge/build-config.md`
  - 当前结论: Docker 多阶段构建、staging health、switch 部署脚本能力；「构建和部署必须保持 workspace 路径、健康检查、运行端口与环境变量一致」
  - 适用 scope: `.github/workflows`、Dockerfile、docker-compose.yml
  - 本次影响: 只改 CI 触发策略，不改变部署脚本和 Docker 构建本身

## 决策

- **选型:** 单 workflow + `if` 条件（方案 A）
  - `ci-cd.yml` 保持单文件
  - 触发条件: `push: branches: [main]` + `release: types: [published]`
  - `quality-gate` 在两种触发下都执行（release 部署前也必须过质量检查）
  - 部署链（prepare → prepare-deps → build-next/build-nest → staging-test → switch-traffic）加 `if: github.event_name == 'release'`
- **对比方案:**
  - 方案 B（拆两个 workflow）: 职责分离但需双文件维护，跨 workflow 表达「部署前先过质量检查」复杂，未选
  - 完全移除 main push 的质量检查: 合入 main 无 CI 反馈，未选（用户确认保留）
- **理由:** 改动最小、部署依赖关系在同一文件内表达自然；镜像 tag 机制保持现状（用户确认），release 版本号不写入镜像标识
- **concurrency 分组调整:**
  - `quality-gate` 用 `ci-quality` 分组（push main 与 release 互不 cancel）
  - 部署链用 `ci-deploy-<ref>` 分组（多次 release 部署串行排队，不互相取消）

## 任务

### Phase 1: 修改触发与 job 条件

- [x] 修改 `.github/workflows/ci-cd.yml` — `on` 增加 `release: types: [published]`
- [x] 修改 `.github/workflows/ci-cd.yml` — 部署链各 job 增加 `if: github.event_name == 'release'`
- [x] 修改 `.github/workflows/ci-cd.yml` — 调整 concurrency 分组（quality 与 deploy 分离）
- [x] 验证: workflow 语法校验（结构模式检查通过：release 触发、push main 保留、6 个部署 job if、动态 concurrency 分组）

## 结果

- 实际耗时: ~10min
- 验证: 结构检查 5/5 PASS；部署 job if 数量 6/6 PASS

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/build-config.md`
- **理由:** 该卡片 scope 含 `.github/workflows`，当前结论需补充「部署由 release 触发」这一事实；待 review 确认后更新
