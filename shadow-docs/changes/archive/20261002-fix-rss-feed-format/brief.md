---
{
  "schema": "shadow-dev/v1",
  "name": "20261002-fix-rss-feed-format",
  "type": "fix",
  "scope": "apps/server",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261002-fix-rss-feed-format",
  "files": [
    "apps/server/src/modules/rss/rss.service.ts",
    "apps/server/src/modules/rss/rss.utils.spec.ts",
    "apps/server/src/modules/rss/rss.utils.ts",
    "shadow-docs/knowledge/rss.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 462,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/462",
    "pullRequest": 464,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/464"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "684438cabb84827be24490e382f7cd03dc580be8",
    "verifiedAt": "2026-10-01T23:22:58.641Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:464",
    "planHash": "b37c164cb5d6e67a50db45e2b78e761081e8644bc3926dbed6878c98e701f2c3",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix: RSS feed 三病灶——19/20 item description 塞原始 Markdown、guid 非永久链接、copyright 过期",
      "titleRaw": "fix: RSS feed 三病灶——19/20 item description 塞原始 Markdown、guid 非永久链接、copyright 过期",
      "supplement": "来源 #438 未纳入项 E。生产 /api/rss.xml 验尸：20 item 中 19 个 description 为原始 Markdown（summary 缺失时 body[:200] 裸兜底）；guid 为纯数字无 isPermaLink；copyright 静态 © 2024 与页脚不一致。修法：rss.utils.ts 纯函数（stripMarkdown/rssDescription/rssCopyright）+ service 三处接入 + rss.md 知识卡 scope/结论刷新（G 元债 1/16）。M 级/runtime。brief: shadow-docs/changes/20261002-fix-rss-feed-format/brief.md",
      "body": "## 动机\n#438 未纳入项 E（M 级）。生产 XML 验尸（2026-10-02，/api/rss.xml）：\n- **20 个 item 中 19 个 description 为原始 Markdown**（`## 标题`、`![image](…)`、`> 引用`、`**加粗**` 全字面量）——`metadata.summary` 大多缺失，`body.substring(0, 200)` 裸兜底（rss.service.ts:53）；`content:encoded` 的 bodyHtml 缺失回落 body 同病（:54）\n- `<guid>165</guid>` 非永久链接且无 `isPermaLink=\"false\"`（feed 库原样输出 id）——阅读器按 permalink 语义误用\n- `<copyright>© 2024 wuh.site</copyright>` 与页脚「© 2021–2026」不一致且静态过期\n顺带治理：knowledge/rss.md 卡片 scope 仍指向已不存在的 `packages/wuh.site.nest`（#438 G 项元债的 1/16），且 item URL 结论过期（现网已是 `/post/<number>` 纯数字，卡片还写着旧 slug 格式）\n\n## 引用规范\n- shadow-docs/knowledge/rss.md\n  - 当前结论: feed 只输出 open 内容——本变更不触碰；item URL 与 canonical 一致——刷新为 `/post/<number>` 纯数字现状；scope 修正为 apps/server 实路径\n  - 适用 scope: apps/server/src/modules/rss\n- shadow-docs/knowledge/seo.md\n  - 当前结论: 文章 description 降级顺序 summary→有效段落→截断（site 侧已实现）——server 侧 RSS 对齐同一语义\n  - 适用 scope: 不触碰 site\n\n## 决策\n- **选型:** ① 新增纯函数 `rss.utils.ts`：`stripMarkdownToText`（去代码块/图片/链接/标题/引用/强调/列表标记，压缩空白）+ `rssDescription`（summary 优先→剥离后截断 200，与 site 侧 description 语义对齐）+ `rssCopyright`（2021 起始年动态计算到当前年，与页脚 copyrightYears 语义一致）；② service 接入三处：description、content:encoded 的 body 回落（全量剥离不截断）、`id` 改为 canonical 永久链接 `${SITE_URL}/post/<number>`（guid 默认 isPermaLink=true 语义正确）；③ 知识卡 rss.md 原位修正 scope/URL/description 结论\n- **对比方案:** guid 保留数字加 isPermaLink=\"false\"——feed 库 addItem 不暴露该属性，需 fork XML 生成，不值；description 换成 bodyHtml 渲染 HTML——阅读器对 item description 的 HTML 支持参差，纯文本最稳\n- **理由:** 三处都是输出契约的最小修正；纯函数 util 匹配仓内测试先例\n\n## 任务\n### Phase 1 红测试\n- [ ] 单测：stripMarkdown 去 `##`/`![]()`/`[]()`/`**`/`>`/代码块/列表标记并压空白；rssDescription summary 优先与 200 截断；rssCopyright 年份区间 —— `apps/server/src/modules/rss/rss.utils.spec.ts`\n### Phase 2 实现\n- [ ] rss.utils.ts 三个纯函数 — `apps/server/src/modules/rss/rss.utils.ts`\n- [ ] service 接入：description/content 回落/id 永久链接/copyright 动态 — `apps/server/src/modules/rss/rss.service.ts`\n### Phase 3 验证与收尾\n- [ ] server jest（rss.utils.spec + 既有 spec 回归）；server tsc/build 绿 — `apps/server`\n- [ ] runtime 验收：部署后生产 `/api/rss.xml`——item description 无 markdown 字面量、guid 为永久链接、copyright 年份正确 — `apps/server`\n- [ ] 变更说明回填 PR body — issue\n\n## 补充\n来源 #438 未纳入项 E。生产 /api/rss.xml 验尸：20 item 中 19 个 description 为原始 Markdown（summary 缺失时 body[:200] 裸兜底）；guid 为纯数字无 isPermaLink；copyright 静态 © 2024 与页脚不一致。修法：rss.utils.ts 纯函数（stripMarkdown/rssDescription/rssCopyright）+ service 三处接入 + rss.md 知识卡 scope/结论刷新（G 元债 1/16）。M 级/runtime。brief: shadow-docs/changes/20261002-fix-rss-feed-format/brief.md\n\n完整 brief：shadow-docs/changes/20261002-fix-rss-feed-format/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261002-fix-rss-feed-format\",\"type\":\"fix\",\"scope\":\"apps/server\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261002-fix-rss-feed-format/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/server/src/modules/rss/rss.service.ts",
        "apps/server/src/modules/rss/rss.utils.spec.ts",
        "apps/server/src/modules/rss/rss.utils.ts",
        "shadow-docs/changes/20261002-fix-rss-feed-format/brief.md",
        "shadow-docs/knowledge/rss.md"
      ],
      "message": "fix(rss): feed 三病灶——description 剥离 Markdown、guid 永久链接、copyright 动态年份 (#462)",
      "title": "fix(rss): RSS feed 格式修复——description 原始 Markdown、guid 非永久链接、copyright 过期",
      "body": "Closes #462（RSS feed 格式修复；#438 未纳入项 E 处方落地）\n\n## 变更\n- 新增 `rss.utils.ts` 纯函数：`stripMarkdownToText`（去代码块/图片/链接/标题/引用/强调/列表标记）、`rssDescription`（summary 优先→剥离截断 200，与站点侧 description 语义对齐）、`rssCopyright`（© 2021–当前年动态）\n- `rss.service.ts` 四处接入：item description、`content:encoded` 的 body 回落、`guid` 改永久链接 URL、`copyright` 动态年份\n- `rss.md` 知识卡原位修正：scope 从已不存在的 `packages/wuh.site.nest` 迁移（G 项元债 1/16）、item URL 结论刷新为 `/post/<number>` 现状\n\n## 生产验尸（修复前）\n20 个 item 中 **19 个 description 为原始 Markdown**（`## 标题`、`![image](…)` 字面量直达阅读器）；`<guid>165</guid>` 非永久链接；`<copyright>© 2024 wuh.site</copyright>` 静态过期。\n\n## 验证\n- 单测 `rss.utils.spec.ts` 8/8（jest，纯函数路径无 mongoose）\n- 本地 tsc/nest build 处 SGN-001 密集期（139×4）不可信，以 CI quality-gate + build-nest 为权威门禁\n- 部署后复测清单：`/api/rss.xml` item description 无 markdown 字面量、guid=永久链接、copyright=`© 2021–2026 wuh.site`"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/rss.md",
    "reason": "归档前在 main HEAD 重签：生产已验证（v1.4.55 部署后三病灶清零：copyright 动态、guid 永久链接、0/20 markdown 字面量），rss.md 知识卡 scope/URL/description 结论已刷新"
  }
}
---

# RSS feed 格式修复——description 原始 Markdown、guid 非永久链接、copyright 过期

## 动机
#438 未纳入项 E（M 级）。生产 XML 验尸（2026-10-02，/api/rss.xml）：
- **20 个 item 中 19 个 description 为原始 Markdown**（`## 标题`、`![image](…)`、`> 引用`、`**加粗**` 全字面量）——`metadata.summary` 大多缺失，`body.substring(0, 200)` 裸兜底（rss.service.ts:53）；`content:encoded` 的 bodyHtml 缺失回落 body 同病（:54）
- `<guid>165</guid>` 非永久链接且无 `isPermaLink="false"`（feed 库原样输出 id）——阅读器按 permalink 语义误用
- `<copyright>© 2024 wuh.site</copyright>` 与页脚「© 2021–2026」不一致且静态过期
顺带治理：knowledge/rss.md 卡片 scope 仍指向已不存在的 `packages/wuh.site.nest`（#438 G 项元债的 1/16），且 item URL 结论过期（现网已是 `/post/<number>` 纯数字，卡片还写着旧 slug 格式）

## 复杂度评级
- **评级:** M
- **理由:** 契约变更是（feed XML 输出形态三处）；触及面为 1 service + 1 新纯函数 util + 1 spec + 1 知识卡，逻辑集中在文本变换；server 侧 jest 有 util spec 先例（content-metadata.util.spec.ts）可精确单测；可发现性高（部署后 curl XML 断言）
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/rss.md
  - 当前结论: feed 只输出 open 内容——本变更不触碰；item URL 与 canonical 一致——刷新为 `/post/<number>` 纯数字现状；scope 修正为 apps/server 实路径
  - 适用 scope: apps/server/src/modules/rss
- shadow-docs/knowledge/seo.md
  - 当前结论: 文章 description 降级顺序 summary→有效段落→截断（site 侧已实现）——server 侧 RSS 对齐同一语义
  - 适用 scope: 不触碰 site

## 决策
- **选型:** ① 新增纯函数 `rss.utils.ts`：`stripMarkdownToText`（去代码块/图片/链接/标题/引用/强调/列表标记，压缩空白）+ `rssDescription`（summary 优先→剥离后截断 200，与 site 侧 description 语义对齐）+ `rssCopyright`（2021 起始年动态计算到当前年，与页脚 copyrightYears 语义一致）；② service 接入三处：description、content:encoded 的 body 回落（全量剥离不截断）、`id` 改为 canonical 永久链接 `${SITE_URL}/post/<number>`（guid 默认 isPermaLink=true 语义正确）；③ 知识卡 rss.md 原位修正 scope/URL/description 结论
- **对比方案:** guid 保留数字加 isPermaLink="false"——feed 库 addItem 不暴露该属性，需 fork XML 生成，不值；description 换成 bodyHtml 渲染 HTML——阅读器对 item description 的 HTML 支持参差，纯文本最稳
- **理由:** 三处都是输出契约的最小修正；纯函数 util 匹配仓内测试先例

## 任务
### Phase 1 红测试
- [x] 单测：stripMarkdown 去 `##`/`![]()`/`[]()`/`**`/`>`/代码块/列表标记并压空白；rssDescription summary 优先与 200 截断；rssCopyright 年份区间 —— `apps/server/src/modules/rss/rss.utils.spec.ts`
### Phase 2 实现
- [x] rss.utils.ts 三个纯函数 — `apps/server/src/modules/rss/rss.utils.ts`
- [x] service 接入：description/content 回落/id 永久链接/copyright 动态 — `apps/server/src/modules/rss/rss.service.ts`
### Phase 3 验证与收尾
- [x] server jest（rss.utils.spec + 既有 spec 回归）；server tsc/build 绿 — `apps/server`
- [x] runtime 验收：部署后生产 `/api/rss.xml`——item description 无 markdown 字面量、guid 为永久链接、copyright 年份正确 — `apps/server`
- [x] 变更说明回填 PR body — issue

## 结果
- 实际耗时: 约 50min（SGN-001 消耗约 20min：本地 nest build 挂死、server/root tsc 连续 4 次 139）
- 验证:
  - **单测**: rss.utils.spec.ts 8/8 绿（strip 语义三态、summary 优先、200 截断、copyright 区间）；jest 纯函数路径未加载 mongoose，未触发 SGN-001
  - **类型/构建**: 本地 tsc/nest build 处 SGN-001 密集期不可信（139×4 + 挂死一次），**以 CI quality-gate（root tsc+lint）与 build-nest 为权威门禁**；此前一次 server 直查出现 3 个 weread TS2339 疑似 SGN-001 损坏输出（同命令 stash 基线干净），不采信
  - **runtime 验收**: 部署后生产 `/api/rss.xml` 为权威——复测清单：item description 无 markdown 字面量、guid 为永久链接 URL、copyright 为动态年份区间
- 流程备注/偏差:
  - rss.utils.ts 与 spec 同步落盘（新纯函数无既有行为，红阶段跳过——与「先红后绿」纪律的偏差，记档）
  - task-6（PR body 回填）时序原因在 review 前勾结
- 部署后复测清单（https://wuh.site）: `/api/rss.xml` item description 无 `##`/`![]()` 字面量；guid=永久链接 URL；copyright=`© 2021–2026 wuh.site`
- 交付发布:
  - PR #464 已合并 main（squash commit `684438c`，本会话代合并）
  - GitHub Release **[v1.4.55](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.55)** 触发 CI-CD run 36939492877 **全绿**（v1.4.54 被并行会话队列翻页屏占用顺延）
  - **生产复测（/api/rss.xml，部署后实测）**: copyright `© 2021–2026 wuh.site` ✅；guid `<guid>https://wuh.site/post/165</guid>` 永久链接 ✅；item description markdown 字面量 **0/20**（修复前 19/20）✅，首条已是干净纯文本

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/rss.md（scope 修正为 apps/server/src/modules/rss + app 侧发现标签路径；结论刷新：URL 纯数字现状、description 剥离语义、guid 永久链接、copyright 动态年份；verified 刷新）
- **理由:** 卡片 scope 已死导致 propose 路由失效（G 项元债），且 URL 结论与现网相反，必须随本变更刷新

## 关联
- GitHub issue: #438 未纳入项 E（处方来源，建议名顺延日期）
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
