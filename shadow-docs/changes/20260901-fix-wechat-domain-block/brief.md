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
    "issue": 346,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/346",
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
    "checkpoint": "issue:346",
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

- [x] 提交腾讯网址申诉（urlsec.qq.com/complain.html）：填 https://wuh.site，附鄂ICP备20001814号-1，说明为个人博客无违规 — 站外操作，用户手动执行 — **结果：2026-09-01 申诉被打回**
- [x] 检查留言板/弹幕现存内容，清理垃圾或易被举报信息 — 已完成技术侧审计：以微信 UA 抓取首页/留言板/文章页，SSR 内容无高危词、无 UGC 直出（留言板客户端渲染，爬虫不可见）、robots.txt 全开放（Allow: /）、sitemap 62 条正常；页面内容层面无可触发拦截的信号，拦截定性为域名级信誉问题（.site 后缀 + 误标历史），非页面内容问题

### Phase 2（解封后）

- [ ] 微信好友分享 wuh.site 验证 → 打开正常无拦截页
- [ ] 若复发：优先复查 UGC，再二次申诉

## 结果

- 实际耗时: —
- 验证: —

## 二次申诉计划（首轮打回后）

1. **查打回理由**：urlsec 申诉记录中的驳回说明，决定二次申诉的类目与措辞
2. **查服务器侧是否误拦腾讯爬虫（最优先技术排查项）**：已排除文件摆放问题——`MP_verify_YLATRlEBRa9TKuow.txt` 与 `ebd56786b0a9c5ecbb7e1fddc7178e85.txt` 外网实抓均 200、内容正确、http→https 301 正常；下一步查宝塔/nginx 日志 `grep "MP_verify\|ebd56786" /www/wwwlogs/*.log`：200=策略层驳回；403/444/验证码=WAF 误拦腾讯核查（加白腾讯网段与 MicroMessenger UA 后冷却重申）；无记录=腾讯未触发抓取，同为策略层
3. **换通道**：微信内打开被拦截页面 → 「申请恢复访问」入口（直达微信团队，区别于 urlsec 通用通道）
4. **材料升级**：工信部备案查询单截图 + 域名注册证书 + 页面内容自查说明（引用本次审计结论）+ 合规承诺
5. **冷却窗口**：距上次申诉间隔 3–7 天再提交，短期内重复申诉大概率被自动打回

## 知识评估

- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/domain-compliance.md（微信拦截双轨机制：检测接口≠拦截名单；申诉入口与所需材料；第三方备案查询源数据可能不全，以站点页脚和 MIIT 为准）
- **理由:** 项目菜单无此领域卡片；本次「检测安全但被拦」的机制和解封路径值得沉淀
