---
{
  "schema": "shadow-dev/v1",
  "name": "20261011-fix-webhook-body-limit",
  "type": "fix",
  "scope": "apps/server",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261011-fix-webhook-body-limit",
  "files": [
    "apps/server/src/main.ts"
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
    "verifiedCommit": "e0e09a119bee0cc3e7e5687633e4695c41f5a447",
    "verifiedAt": "2026-10-11T14:31:46.231Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "f64fe4452925193d45e1bcc466ae11534b11189a1332640675c81e04f9306311",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/server/src/main.ts",
        "shadow-docs/changes/20261011-fix-webhook-body-limit/brief.md"
      ],
      "message": "fix: webhook 大 payload 超 express 默认 100kb 拒收——全局 body limit 提至 5mb",
      "title": "[fix] webhook 大 payload 拒收——bodyParser 全局 5mb",
      "body": ""
    },
    "commit": {
      "files": [
        "apps/server/src/main.ts",
        "shadow-docs/changes/20261011-fix-webhook-body-limit/brief.md"
      ],
      "message": "fix: webhook 大 payload 超 express 默认 100kb 拒收——全局 body limit 提至 5mb"
    }
  },
  "knowledge": null
}
---

# GitHub webhook 大 payload 被 express 默认 100kb 上限拒收

## 现象与影响

GitHub 向 `POST /v2/webhook/github` 派发 issue 事件时，payload 携带 issue 正文全文；长文章（正文数千行 + 标签 + 评论体）序列化后超过 300kb。影响面：博客文章的 opened/edited/closed 三条同步链路全部失效（`entity.too.large` → 413），GitHub 侧记 delivery 失败，文章改动不再同步进 MongoDB；发现渠道为本地未提交改动随附的现场问题。

## 复杂度评级

- **评级:** S
- **理由:** 单文件启动配置，改 body-parser 全局 limit，不触及 DTO/契约/DB/共享包；被同一 `main.ts` 拉起的全局中间件影响所有 POST 端点，但只放宽上限不改语义。
- **期望验证深度:** unit（独立探针复现）+ field（部署后 webhook delivery 恢复）

## 根因与修复

根因：`NestFactory.create(AppModule)` 使用 Nest 默认 bodyParser，即 express `json`/`urlencoded` 的 `limit: '100kb'`；GitHub webhook 派发体超过该上限即 `PayloadTooLargeError`。

最小修复：关闭 Nest 默认 bodyParser，显式挂 `json({ limit: '5mb' })` 与 `urlencoded({ extended: true, limit: '5mb' })`。

不波及确认（只读核查）：`webhook.controller.ts:46` 的签名校验对象是 `JSON.stringify(payload)` 重序列化，不依赖 raw body，关闭默认 bodyParser 不改变其结果（该写法对键序脆弱属既有问题，不在本修复范围）；服务端无 `FileInterceptor`/multipart 依赖，express 4.22 不自动挂 urlencoded，全局替换不丢解析能力。

## 引用规范

- knowledge/bug-investigation.md
  - 当前结论: 复现→追踪→根因→最小修复→回归由单一上下文完成
  - 适用 scope: cross-project

## 任务

### Phase 1

- [x] 取不变量被破坏的观察 — 独立 express 探针：300kb JSON 打默认 `json()` → 413；打 `json({limit:'5mb'})` → 200 且字节数完整。记录观察点
- [x] 修复并回归 — `apps/server/src/main.ts` — bodyParser 关闭 + json/urlencoded 5mb；回归：`pnpm build:nest` 通过，探针复验

## 结果

- 实际耗时: ~25 分钟（含复现探针与 139 归因）
- 验证: 复现探针 300kb payload：默认 `json()` → **413 PayloadTooLargeError**，`json({limit:'5mb'})` → **200 {"received":307214}**（字节完整）。回归：`tsc --noEmit` exit 0。`nest build` 本机连崩（默认/30s 重试/限堆 1400 均 exit 139），**归因=环境问题非本改动**：stash 掉修复后 baseline 同命令同样 139；命中已登记信号 SGN-001（本仓 V8 SIGSEGV 家族，明确「禁止把 139 当测试失败排查」）。field 深度（部署后 webhook delivery 恢复）待 PR 合入上线后确认。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 一次性配置修复，除非揭示长期事实（express 默认 100kb 上限对本仓所有 webhook 类端点的普适约束），否则不入 Knowledge
