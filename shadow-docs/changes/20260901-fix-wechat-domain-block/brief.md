---
{
  "schema": "shadow-dev/v1",
  "name": "20260901-fix-wechat-domain-block",
  "type": "fix",
  "scope": "infra",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
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
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 解除 wuh.site 微信内访问拦截

## 动机

wuh.site 分享到微信后打开显示「网页存在安全风险，已停止访问」。UrlSEC 检测显示安全、浏览器直连正常、域名备案齐全（鄂ICP备20001814号-1 + 粤公网安备44030002001803号），根因判定为微信聊天内拦截名单误标（非合规缺口）。

## 引用规范

- shadow-dev-workflow/knowledge/bug-investigation.md
  - 当前结论: Bug 调查保持单一上下文，复现→根因→修复→验证同上下文串联
  - 适用 scope: cross-project（本次调查已遵循）
- shadow-docs/knowledge/seo.md
  - 当前结论: OG/canonical/sitemap 使用同一公开 URL
  - 适用 scope: packages/wuh.site.next/app（申诉填写 URL 与站点公开 URL 一致，用 https://wuh.site）

## 决策

- **选型:** 腾讯官方申诉（主路径，附备案号）+ 留言板 UGC 排查（防复发）
- **对比方案:** 补备案/换域名——已排除，备案早已完成
- **理由:** 拦截名单在腾讯侧，申诉是唯一正规解除通道；匿名留言板/弹幕是常见被举报源，需排查以防复发

## 任务

### Phase 1（今天）

- [ ] 提交腾讯网址申诉（urlsec.qq.com/complain.html）：填 https://wuh.site，附鄂ICP备20001814号-1，说明为个人博客无违规 — 站外操作，用户手动执行
- [ ] 检查留言板/弹幕现存内容，清理垃圾或易被举报信息 — apps/site 留言板模块

### Phase 2（解封后）

- [ ] 微信好友分享 wuh.site 验证 → 打开正常无拦截页
- [ ] 若复发：优先复查 UGC，再二次申诉

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/domain-compliance.md（微信拦截双轨机制：检测接口≠拦截名单；申诉入口与所需材料；第三方备案查询源数据可能不全，以站点页脚和 MIIT 为准）
- **理由:** 项目菜单无此领域卡片；本次「检测安全但被拦」的机制和解封路径值得沉淀
