---
{
  "schema": "shadow-dev/v1",
  "name": "20261111-fix-audit-batch3-resilience",
  "type": "fix",
  "scope": "full",
  "status": "committed",
  "baseBranch": "main",
  "branch": "fix/20261111-fix-audit-batch3-resilience",
  "files": [
    ".env.example",
    "apps/server/scripts/sync-init.mjs",
    "apps/server/src/common/filters/http-exception.filter.ts",
    "apps/server/src/main.ts",
    "apps/server/src/modules/admin/admin.controller.spec.ts",
    "apps/server/src/modules/admin/admin.controller.ts",
    "apps/server/src/modules/content/content.controller.ts",
    "apps/server/src/modules/sync/sync.service.ts",
    "apps/server/src/modules/webhook/webhook.controller.ts",
    "apps/site/app/guestbook/page.tsx",
    "apps/site/app/layout.tsx",
    "apps/site/app/post/components/FloatingActions/index.tsx",
    "packages/hooks/useFetch/createService.ts"
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
    "verifiedCommit": "9cfeef78b0b1a96278483bbc5e736fcc64c886a9",
    "verifiedAt": "2026-11-10T16:20:48.690Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "d960bd94ca9e97f61de1e25d0c8cb2b35ed19a82",
    "planHash": "8dd198674a7fca858d802a83230ebd53691f4fae56c254b16887e9112452af73",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        ".env.example",
        "apps/server/scripts/sync-init.mjs",
        "apps/server/src/common/filters/http-exception.filter.ts",
        "apps/server/src/main.ts",
        "apps/server/src/modules/admin/admin.controller.spec.ts",
        "apps/server/src/modules/admin/admin.controller.ts",
        "apps/server/src/modules/content/content.controller.ts",
        "apps/server/src/modules/sync/sync.service.ts",
        "apps/server/src/modules/webhook/webhook.controller.ts",
        "apps/site/app/guestbook/page.tsx",
        "apps/site/app/layout.tsx",
        "apps/site/app/post/components/FloatingActions/index.tsx",
        "packages/hooks/useFetch/createService.ts"
      ],
      "message": "fix(server,site,hooks): 审计 #568 批次 3——webhook rawBody 签名加固/delivery 去重、sync 过滤 PR、fire-and-forget 显式 catch、5xx 生产留痕、admin email PII 收敛、点赞与留言板韧性、serverCall 超时护栏"
    }
  },
  "knowledge": null
}
---

# 审计 #568 批次 3：server 安全韧性 6 项 + site/hooks 快修 7 项

## 动机

#568 审计收口推进：P0×4 与质量门三件套已闭环，本批按审计路线图第 2/3 批清剩余 P1 中「小而高价值」的安全与韧性项——server 侧 6 项（webhook 签名加固、sync 过滤 PR、火后不管吞 rejection、生产 500 静默、admin email PII 泄漏、.env.example 脱节）+ 搭车 1 项 P2（dispatchArchive 不检查响应状态），site 侧 4 项（点赞错误扣减、留言板标题双拼接、留言板 500、缩放锁 WCAG 违规），hooks 侧 2 项（falsy data 误判失败、SSR 无超时）。共 13 项：P1×10 + P2×2 + P1-38 配套 spec 守卫。

## 复杂度评级

- **评级:** M
- **理由:** 触及面跨三域 13 文件但每项独立小改；webhook 签名从 re-serialize JSON 改 raw body 属行为契约变更（观察点：合法 webhook 事件仍能触发同步）；大部分为拒绝路径/降级路径改写。
- **期望验证深度:** runtime（合并后 CI 三步真闸 typecheck/lint/sweep 全绿 + release 部署后公网 webhook/留言板/点赞面核验）
- **取证策略:** observation

## 领域模型

- **限界上下文:** 服务端安全与前端韧性——上游为 GitHub webhook/内容同步链，下游为公开 API 消费面（主站 SSR 与客户端）。反腐边界=不做 P1-3/P1-5/P1-16 等未列入本批的大改（webhook deleted 处理、upsert 原子化、revalidate 链路另行立项）；不改守卫语义与既有 API 形状。
- **统一语言增量:** 「delivery 去重」=以 `x-github-delivery` 头为键、5 分钟窗口内同 id 只处理一次的重放防护。
- **被触及的既有不变量:**
  - webhook 合法事件仍能触发同步（签名对 raw body 校验后，GitHub 真实投递必须通过）
  - 公开评论/内容 API 响应形状不变（admin `/users` 仅收敛 email 字段）
  - 留言板降级空态而非 5xx；点赞失败不改本地计数
  - 质量门三步真闸语义不变（#576 契约）

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: CI 三步真闸（typecheck 四域 + lint + test sweep）；发布流程 Release 触发部署链
  - 适用 scope: 全仓
- shadow-docs/knowledge/shared-hooks.md
  - 当前结论: useFetch/useRequest 行为契约
  - 适用 scope: packages/hooks

## 决策

- **选型:** 逐项最小修复（每项一个文件级 diff，拒绝路径优先）；webhook 采用 express json `verify` 回调捕获 rawBody + `timingSafeEqual` 等长比较 + 内存 Map 窗口去重 + 密钥缺失 fail-fast 503。
- **对比方案:** rawBody 方案弃 `NestFactory.create({rawBody:true})`（当前 bodyParser:false 手挂中间件，改工厂参数牵连更大）；admin email 修复弃整类 RootGuard（writer 角色未来功能面不明，PII 收敛是最小充分面）；留言板弃 revalidate 链路改造（P1-16 另行立项）。
- **理由:** 每项独立可回滚、可单独验证；webhook raw body 是 GitHub 官方推荐实现路径；本地 tsc/jest 受 SGN-001 环境所限（SIGSEGV×6），类型与 spec 真值移交 CI runner 自证。

## 任务

### Phase 1 — server 安全与韧性
- [x] task 1 — `apps/server/src/modules/webhook/webhook.controller.ts` — P1-1 rawBody+timingSafeEqual+delivery 去重+密钥缺失 503；搭车 P2 dispatchArchive 补 res.ok
- [x] task 2 — `apps/server/src/main.ts` — json 中间件 verify 回调捕获 rawBody
- [x] task 3 — `apps/server/src/modules/sync/sync.service.ts` + `apps/server/scripts/sync-init.mjs` — P1-2 过滤 PR
- [x] task 4 — `apps/server/src/modules/content/content.controller.ts` — P1-6 fire-and-forget 显式 catch
- [x] task 5 — `apps/server/src/common/filters/http-exception.filter.ts` — P1-8 5xx 生产留痕 + Sentry captureException
- [x] task 6 — `apps/server/src/modules/admin/admin.controller.ts` + `admin.controller.spec.ts` — P1-38 email 收敛 + spec 回归守卫
- [x] task 7 — `.env.example` — P1-32 补齐代码实读键

### Phase 2 — site/hooks 快修
- [x] task 8 — `apps/site/app/post/components/FloatingActions/index.tsx` — P1-14 res.ok 先判
- [x] task 9 — `apps/site/app/guestbook/page.tsx` — P1-17 短标题走模板 + P1-18 降级空态与超时护栏
- [x] task 10 — `apps/site/app/layout.tsx` — P1-20 解锁双指缩放
- [x] task 11 — `packages/hooks/useFetch/createService.ts` — P1-27 falsy data 不误判 + P1-21 serverCall 默认 15s 超时

## 结果

- 实际耗时: —
- 验证: —（oxlint 0/0 全绿；useRequest UR1-UR7 7/7 绿；server tsc 与 jest spec 本地受 SGN-001 环境所限 SIGSEGV×6，真值移交 CI quality-gate）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 本批为审计既有缺陷的逐项修复，无新长期契约；webhook raw-body 校验属标准实践，若后续 P1-31 补 webhook spec 时再一并沉淀
