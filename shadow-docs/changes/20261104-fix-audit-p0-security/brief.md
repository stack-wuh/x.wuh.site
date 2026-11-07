---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-fix-audit-p0-security",
  "type": "fix",
  "scope": "server",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261104-fix-audit-p0-security",
  "files": [],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 573,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/573"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:573",
    "planHash": "63f452bc92d57be2260d337e6fdfc5c283411e8e3c0042be173ff36863ca7b0e",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/server/scripts/backfill-comment-status.mjs",
        "apps/server/src/common/utils/jwt-expiration.ts",
        "apps/server/src/modules/auth/auth.module.ts",
        "apps/server/src/modules/auth/auth.service.ts",
        "apps/server/src/modules/comment/comment.controller.ts",
        "apps/server/src/modules/comment/comment.module.ts",
        "apps/server/src/modules/comment/comment.service.ts",
        "apps/server/src/modules/comment/dto/comment.dto.ts",
        "apps/server/src/modules/sync/sync.service.ts",
        "apps/server/src/modules/webhook/webhook.controller.ts",
        "apps/server/src/modules/webhook/webhook.module.ts",
        "shadow-docs/changes/20261104-fix-audit-p0-security"
      ],
      "message": "fix(server): 加固评论/同步端点越权面并修正 JWT 过期截断\n\n- PATCH /comments/:id/approve 与 POST /webhook/sync/:n 挂 JwtAuthGuard+RootGuard（审计 #568 P0-1/P0-3）\n- 公开 GET /comments 默认 approved + findAll 收敛 PII 投影；QueryCommentDto 补 status @IsIn（修复 admin ?status= 死过滤）与四字段 MaxLength（P0-2/P1-11/P2）\n- guestbook 匿名评论创建即 approved（对齐既有注释意图）；syncComment 同步 GitHub 评论写 status approved（此前落默认 pending）\n- 新增 scripts/backfill-comment-status.mjs 一次性归位存量 pending 数据（默认 dry-run，--yes 落库）\n- resolveJwtExpiration：纯数字按秒、带单位透传，修复 parseInt('24h')===24 秒会话（P1-4），auth.module signOptions 同步修复"
    }
  }
}
---

# 修复审计 P0：评论/同步端点越权、评论 PII 泄漏与 JWT 过期截断

## 动机
2026-11-04 全仓 CTO 审计（GitHub issue #568）定位的四个服务端最高优先级缺陷：
- P0-1 `PATCH /comments/:id/approve` 无鉴权，可匿名以服务器身份向内容仓任意 Issue 投递内容
- P0-2 公开 `GET /comments` 无投影（clientIp/email/userAgent/footprint 全量外泄）且不区分状态（pending 未审核内容对外可见，审核机制形同虚设）
- P0-3 `POST /webhook/sync/:issueNumber` 无鉴权无限流，公网可直接触发同步烧 GitHub 配额
- P1-4 JWT `expiresIn` 经 `parseInt` 截断（`'24h'`→24 秒），会话秒掉线

深挖发现修复 P0-2 不能只加过滤：存量数据全在 `pending`（guestbook 评论落 schema 默认值、`syncComment` 同步回的 GitHub 评论不写 status），直接默认 approved 会把现有可见内容全部藏掉。故本变更连动数据语义与一次性 backfill。

## 复杂度评级
- **评级:** M
- **理由:** 触及 comment/sync/webhook/auth 四模块与守卫 DI 装配（CommentModule/WebhookModule 补 import AuthModule）；含一次公开行为变更（默认 approved）与配套 backfill 脚本；无新增端点、无契约破坏
- **期望验证深度:** 冒烟 + 回归探针
- **取证策略:** observation（不新建测试文件；结构探针 grep + tsc + 既有 jest 套件）

## 决策
- approve 与 sync 直同步端点统一挂 `JwtAuthGuard + RootGuard`（与 admin 既有模式一致）；不选删除——保留 root 手工补同步能力。**附带影响：** apps/blog 子模块 publish 脚本的直同步 fast-path 将 403（该链路已有 issue 'opened' webhook 兜底，不丢功能）；publish 脚本的失败处理属 blog 仓 P1-41，另行动
- P0-2 采用「语义归位 + 默认 approved + backfill」三连：
  1. `syncComment`（GitHub 源）写 `status:'approved'`——GitHub 上的评论即已公开内容
  2. guestbook 匿名评论创建即 `approved`（对齐 controller 既有注释声明的意图，保持当前用户可见行为不变；拒绝/下架走 admin updateStatus）
  3. 公开 `GET /comments` 缺省 `status:'approved'`，`QueryCommentDto` 补 `@IsIn` status（顺带修复 admin `?status=` 被 whitelist 剥离的死过滤，P2）
  4. blog 匿名评论维持 pending（真实审核队列，root 批准后复用同一文档转 approved，无双显示）
- `findAll` 加 `.select('-clientIp -userAgent -email -footprint')`（admin 列表同样不再吐 PII，console 未渲染这些字段，无破坏）
- JWT：`resolveJwtExpiration` 工具（纯数字→秒数 number，带单位→透传 string，规避 jsonwebtoken 对裸数字串按毫秒解释的陷阱），auth.service 与 auth.module（JwtModule signOptions 同 bug）两处统一走它
- DTO 补长度上限（nickname 50 / content 2000 / footprint 100 / page 100，P1-11 顺带闭环，同文件零风险）
- backfill 规则：`repo='guestbook'` 全部→approved（auto-approve 意图）；`repo='blog'` 且 externalId 为纯数字→approved（GitHub 源）；UUID externalId 的 blog 评论维持 pending（真实待审队列）。脚本 `apps/server/scripts/backfill-comment-status.mjs`，**不自动执行**，由使用者在确认目标库后手动跑一次

## 任务
### Phase 1 守卫与模块装配
- [x] comment approve 路由挂 JwtAuthGuard+RootGuard，CommentModule import AuthModule — `apps/server/src/modules/comment/comment.controller.ts`, `apps/server/src/modules/comment/comment.module.ts`
- [x] webhook sync/:issueNumber 挂同款守卫 + parseInt NaN 校验，WebhookModule import AuthModule — `apps/server/src/modules/webhook/webhook.controller.ts`, `apps/server/src/modules/webhook/webhook.module.ts`

### Phase 2 评论数据语义
- [x] QueryCommentDto 补 status @IsIn + 四字段 MaxLength — `apps/server/src/modules/comment/dto/comment.dto.ts`
- [x] 公开 getComments 缺省 approved；guestbook 创建即 approved；findAll 加 PII 投影 — `apps/server/src/modules/comment/comment.controller.ts`, `apps/server/src/modules/comment/comment.service.ts`
- [x] syncComment 写 status approved — `apps/server/src/modules/sync/sync.service.ts`
- [x] backfill 脚本（guestbook 全量 / blog 纯数字 externalId → approved） — `apps/server/scripts/backfill-comment-status.mjs`

### Phase 3 JWT 过期修复
- [x] resolveJwtExpiration 工具 + auth.service/auth.module 两处接入 — `apps/server/src/common/utils/jwt-expiration.ts`, `apps/server/src/modules/auth/auth.service.ts`, `apps/server/src/modules/auth/auth.module.ts`

## 结果
- 实际耗时: —
- 验证: —
