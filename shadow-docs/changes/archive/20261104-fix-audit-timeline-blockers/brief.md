---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-fix-audit-timeline-blockers",
  "type": "fix",
  "scope": "about",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261104-fix-audit-timeline-blockers",
  "files": [],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 572,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/572"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "31b1c3344b617c96489c5e887ca593e3a3a78542",
    "verifiedAt": "2026-11-07T08:48:21.589Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:572",
    "planHash": "1a5cbdc7958d01067bcf33c682841930b1a2d89cd8b27c31cdd710087c209f72",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "apps/server/src/modules/about-timeline/providers/github-timeline.provider.ts",
        "apps/server/src/modules/about-timeline/providers/site-timeline.provider.ts",
        "shadow-docs/changes/20261104-fix-audit-timeline-blockers"
      ],
      "message": "fix(about): 修 timeline 开源仓库判据字段与站内链接双死链源\n\n- github provider CreateEvent 判据 repository_type → ref_type（GitHub Events API 实际字段），\n  「开源仓库」动态此前永不产生（审计 #568 P1-44）；payload 消费字段以本地 interface 收口，\n  顺带清零该文件 3 条存量 tsc 基线错误\n- site provider SITE_URL 兜底改 @wuh.site/core 单源（此前硬编码 x.wuh.site 与 core 漂移）\n- 留言链接守卫：guestbook repo / about-guestbook 页 / issueNumber 缺失一律回 /about，\n  杜绝 /post/999999、/post/undefined 死链"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "归档补跑漂移门：变更已合并、内容在 main 同源在案，按当日 brief 结论复申（HEAD 随归档推进逐单重验）"
  }
}
---

# 修复审计阻断项：about-timeline「开源仓库」永不产生 + 链接双死链源

## 动机
2026-11-04 全仓审计（issue #568）对已合入 main 的 about-timeline（PR #569）的遗留阻断项核实（2026-11-05 复核 HEAD）：
- P1-44 `github-timeline.provider.ts:30` CreateEvent 判据字段写错：GitHub Events API 为 `ref_type`，不存在 `repository_type`，「开源仓库」动态永不产生（域 tsc TS2339 实锤）
- P2 site provider `SITE_URL` 兜底硬编码 `x.wuh.site`，与 core 常量 `wuh.site` 双源漂移；env 未配置时生成错误域名链接
- P2 site provider 留言链接：`repo='guestbook'`（issueNumber=999999）或历史留言 `issueNumber` 缺失时生成 `/post/999999`、`/post/undefined` 死链，违背 INV-1 link 有效性意图

审计原列的 P1-43（douban 单 feed 失败丢另一 feed 条目）经复核**已在 PR #569 合并前修复**（现为双 feed 全挂才 throw、单 feed 仅 warn），本变更不再涉及。

## 复杂度评级
- **评级:** S
- **理由:** 单域 2 文件、判据与兜底级修复，无契约变更；顺带清零所触文件 3 条存量 tsc 基线错误（属维护）
- **期望验证深度:** 结构 + 域 tsc
- **取证策略:** observation（不新建测试文件）

## 决策
- CreateEvent/ReleaseEvent 的 payload 访问用本地 interface 收敛消费字段（Octokit events payload 为松散联合），同时消掉 `repository_type`/`release` 两条 TS2339 与未使用 `logger` 一条 TS6133——预期域 tsc 基线 24→21
- 留言链接守卫以 `repo === 'guestbook' || page === 'about-guestbook' || issueNumber == null` 三条件兜底回 `/about`（repo 判据覆盖 999999 魔法数路径，page 判据保留兼容）
- SITE_URL 兜底改 `import { SITE_URL } from '@wuh.site/core'`（main.ts/rss.service 同款单源路径）

## 任务
### Phase 1 provider 修复
- [x] github provider：ref_type 判据修复 + payload 类型收口 + 清 logger 残留 — `apps/server/src/modules/about-timeline/providers/github-timeline.provider.ts`
- [x] site provider：SITE_URL 兜底单源化 + 留言链接死链守卫 — `apps/server/src/modules/about-timeline/providers/site-timeline.provider.ts`

## 结果
- 实际耗时: —
- 验证: —

